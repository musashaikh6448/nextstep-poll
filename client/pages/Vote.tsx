import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getPollById, seedIfEmpty, totalVotes, vote as doVote, duplicatePoll } from "@/lib/polls";
import Confetti from "@/components/Confetti";

export default function Vote() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string[]>([]);
  const [confettiTrigger, setConfettiTrigger] = useState(0);

  useEffect(() => { seedIfEmpty(); }, []);

  const poll = useMemo(() => (id ? getPollById(id) : undefined), [id, confettiTrigger]);

  if (!poll) {
    return (
      <div className="mx-auto max-w-3xl rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
        <h1 className="text-2xl font-bold">Poll not found</h1>
        <p className="mt-2 text-foreground/70">This poll does not exist.</p>
        <div className="mt-4"><Link to="/create" className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Create a new poll</Link></div>
      </div>
    );
  }

  const t = totalVotes(poll) || 1;
  const toggle = (oid: string) => {
    if (poll.settings.allowMultiple) {
      setSelected((s) => (s.includes(oid) ? s.filter((x) => x !== oid) : [...s, oid]));
    } else {
      setSelected([oid]);
    }
  };

  const onVote = () => {
    const res = doVote(poll.id, selected);
    if (res) {
      // trigger confetti
      setConfettiTrigger((t) => t + 1);
      setTimeout(()=>navigate(`/results/${poll.id}`), 900);
    }
  };

  const onDuplicate = () => {
    const copy = duplicatePoll(poll.id);
    if (copy) navigate(`/vote/${copy.id}`);
  };

  return (
    <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-5">
      {confettiTrigger>0 && <Confetti trigger={confettiTrigger} />}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl md:col-span-3">
        <div className="absolute inset-0 -z-10 opacity-60 blur-2xl gradient-aurora" />
        <h1 className="text-2xl font-bold">{poll.title}</h1>
        {poll.description && <p className="mt-1 text-foreground/70">{poll.description}</p>}
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {poll.options.map((o) => {
            const isSelected = selected.includes(o.id);
            return (
              <div key={o.id} onClick={() => toggle(o.id)} className={`cursor-pointer rounded-2xl border p-3 transition-shadow ${isSelected ? 'ring-4 ring-primary/30 shadow-glow' : 'hover:shadow-glow hover:scale-[1.01]'} bg-background/60` }>
                <div className="flex items-center gap-3">
                  <img src={o.image || '/placeholder.svg'} alt={o.text} className="h-16 w-16 rounded-lg object-cover border border-white/10" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{o.text}</div>
                      <div className="text-sm text-foreground/60">{Math.round((o.votes / t) * 100)}%</div>
                    </div>
                    <div className="text-sm text-foreground/70">{o.party}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-6 flex items-center gap-3">
          <button onClick={onVote} disabled={selected.length === 0} className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground btn-glow disabled:opacity-50">Submit Vote</button>
          <Link to={`/results/${poll.id}`} className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold backdrop-blur-xl hover:bg-white/10">View Results</Link>
          <button onClick={onDuplicate} className="rounded-full border border-white/15 px-4 py-2 text-sm hover:bg-white/10">Duplicate</button>
        </div>
      </div>

      <aside className="space-y-4 md:col-span-2">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
          <div className="text-sm text-foreground/70">Settings</div>
          <ul className="mt-2 grid gap-1 text-sm">
            <li>Multiple choice: <b>{poll.settings.allowMultiple ? "Yes" : "No"}</b></li>
            <li>Revote allowed: <b>{poll.settings.allowRevote ? "Yes" : "No"}</b></li>
            <li>Results before vote: <b>{poll.settings.showResultsBeforeVote ? "Yes" : "No"}</b></li>
          </ul>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
          <div className="text-sm text-foreground/70">Share</div>
          <div className="mt-2 flex items-center gap-2">
            <input readOnly value={window.location.href} className="w-full rounded-xl border border-white/15 bg-background/80 px-3 py-2 text-sm" />
            <button onClick={() => navigator.clipboard.writeText(window.location.href)} className="rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground">Copy</button>
          </div>
        </div>
      </aside>
    </div>
  );
}
