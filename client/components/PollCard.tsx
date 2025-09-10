import { Link } from "react-router-dom";
import Avatar from "@/components/Avatar";
import { duplicatePoll, totalVotes } from "@/lib/polls";
import type { Poll } from "@/types/poll";

export default function PollCard({ poll, onDuplicate }: { poll: Poll; onDuplicate?: (p: Poll) => void }) {
  const total = totalVotes(poll) || 1;
  const expiresIn = poll.expiresAt ? Math.max(0, poll.expiresAt - Date.now()) : null;

  const top = poll.options[0];

  const doDuplicate = () => {
    const copy = duplicatePoll(poll.id);
    if (copy && onDuplicate) onDuplicate(copy);
  };

  return (
    <article className="card p-4 transition-transform hover:-translate-y-2 hover:shadow-xl">
      <div className="flex items-start gap-4">
        <img src={top.image || '/placeholder.svg'} alt={top.text} className="h-24 w-24 rounded-lg object-cover border" />
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold leading-tight line-clamp-2">{poll.title}</h3>
          <p className="mt-1 text-sm text-foreground/70 line-clamp-2">{poll.description}</p>

          <div className="mt-3 flex items-center gap-3">
            <div className="flex items-center gap-3">
              <div className="flex flex-col">
                <span className="text-sm font-medium">{top.text}</span>
                <span className="text-xs text-foreground/60">{top.party}</span>
              </div>
            </div>
            <div className="ml-auto text-sm text-foreground/70">{total} votes</div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <Link to={`/vote/${poll.id}`} className="inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-purple-600 to-cyan-500 px-4 py-2 text-sm font-semibold text-white shadow-sm">Vote</Link>
        <Link to={`/results/${poll.id}`} className="inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-semibold text-foreground">Results</Link>
        <button onClick={doDuplicate} className="ml-auto rounded-md border px-3 py-2 text-sm">Duplicate</button>
      </div>
    </article>
  );
}

function formatRemaining(ms: number) {
  if (ms <= 0) return "Expired";
  const s = Math.floor(ms / 1000);
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  if (d > 0) return `${d}d ${h}h`;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m`;
  return `${s}s`;
}
