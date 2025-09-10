import type { Poll, PollOption } from "@/types/poll";
import { mockPolls } from "@/data/mock";

const STORAGE_KEY = "nextstep.polls";
const VOTES_KEY = "nextstep.votes"; // map of pollId -> array of chosen option ids for current device

function loadAll(): Poll[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Poll[];
  } catch {
    return [];
  }
}

function saveAll(polls: Poll[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(polls));
}

export function seedIfEmpty() {
  const existing = loadAll();
  if (!existing || existing.length === 0) {
    saveAll(mockPolls);
  }
}

export function getPolls(): Poll[] {
  return loadAll();
}

export function getPollById(id: string): Poll | undefined {
  return loadAll().find((p) => p.id === id);
}

export function upsertPoll(poll: Poll) {
  const polls = loadAll();
  const idx = polls.findIndex((p) => p.id === poll.id);
  if (idx >= 0) polls[idx] = poll; else polls.push(poll);
  saveAll(polls);
}

export function createPoll(data: Omit<Poll, "id" | "createdAt">): Poll {
  const id = `ns-${Math.random().toString(36).slice(2, 8)}`;
  const poll: Poll = { ...data, id, createdAt: Date.now() };
  upsertPoll(poll);
  return poll;
}

export function duplicatePoll(pollId: string): Poll | undefined {
  const polls = loadAll();
  const p = polls.find((x) => x.id === pollId);
  if (!p) return undefined;
  const copy: Poll = {
    ...structuredClone(p),
    id: `nx-${Math.random().toString(36).slice(2, 8)}`,
    title: `${p.title} (Copy)`,
    createdAt: Date.now(),
    // reset votes
    options: p.options.map((o) => ({ ...o, votes: 0 })),
  };
  upsertPoll(copy);
  return copy;
}

export function vote(pollId: string, optionIds: string[]): Poll | undefined {
  const polls = loadAll();
  const poll = polls.find((p) => p.id === pollId);
  if (!poll) return undefined;

  const chosen = new Set(optionIds);
  // If not multiple, enforce single
  if (!poll.settings.allowMultiple && chosen.size > 1) {
    const first = optionIds[0];
    optionIds = first ? [first] : [];
  }

  // Handle device votes for allowRevote
  const votesMap: Record<string, string[]> = JSON.parse(localStorage.getItem(VOTES_KEY) || "{}");
  const prev = votesMap[pollId] || [];

  if (!poll.settings.allowRevote && prev.length > 0) {
    return poll; // do nothing
  }

  // Remove previous votes
  if (prev.length > 0) {
    for (const opt of poll.options) {
      if (prev.includes(opt.id)) opt.votes = Math.max(0, opt.votes - 1);
    }
  }

  // Add new votes
  for (const opt of poll.options) {
    if (chosen.has(opt.id)) opt.votes += 1;
  }

  votesMap[pollId] = optionIds;
  localStorage.setItem(VOTES_KEY, JSON.stringify(votesMap));

  upsertPoll(poll);
  return poll;
}

export function totalVotes(poll: Poll): number {
  return poll.options.reduce((a, o) => a + o.votes, 0);
}

export function toCSV(poll: Poll): string {
  const lines = ["Option, Votes"];
  for (const o of poll.options) lines.push(`${escapeCsv(o.text)}, ${o.votes}`);
  return lines.join("\n");
}

function escapeCsv(v: string) {
  if (v.includes(",") || v.includes("\"")) return '"' + v.replaceAll('"', '""') + '"';
  return v;
}

export function exportChartSVGToPNG(svgEl: SVGSVGElement, fileName: string) {
  const serializer = new XMLSerializer();
  const svgStr = serializer.serializeToString(svgEl);
  const svgBlob = new Blob([svgStr], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(svgBlob);

  const img = new Image();
  img.onload = () => {
    const canvas = document.createElement("canvas");
    canvas.width = img.width * 2;
    canvas.height = img.height * 2;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = getComputedStyle(document.body).backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      if (!blob) return;
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = fileName.endsWith('.png') ? fileName : `${fileName}.png`;
      a.click();
      URL.revokeObjectURL(a.href);
      URL.revokeObjectURL(url);
    }, "image/png");
  };
  img.src = url;
}

export function getTrending(limit = 12): Poll[] {
  const polls = loadAll();
  return polls
    .slice()
    .sort((a, b) => totalVotes(b) - totalVotes(a))
    .slice(0, limit);
}

export function simulateStep(pollId: string, intensity = 1) {
  const polls = loadAll();
  const p = polls.find((x) => x.id === pollId);
  if (!p) return;
  // randomly add small number of votes to options
  for (let i = 0; i < intensity; i++) {
    const idx = Math.floor(Math.random() * p.options.length);
    p.options[idx].votes += Math.random() < 0.6 ? 1 : Math.floor(Math.random() * 3);
  }
  upsertPoll(p);
}
