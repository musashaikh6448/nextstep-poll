import { useMemo } from "react";
import { getTrending } from "@/lib/polls";

export default function Candidates(){
  const polls = getTrending(24);
  const candidates = useMemo(()=>{
    const map: Record<string, any> = {};
    for(const p of polls){
      for(const o of p.options){ map[o.text] = { name: o.text, party: o.party, image: o.image, votes: (map[o.text]?.votes||0)+o.votes } }
    }
    return Object.values(map).sort((a,b)=>b.votes-a.votes);
  },[polls]);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <h1 className="text-2xl font-bold">Candidates</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {candidates.map((c:any)=> (
          <div key={c.name} className="rounded-2xl p-4 glass flex items-center gap-3">
            <img src={c.image||'/placeholder.svg'} alt={c.name} className="h-16 w-16 rounded-md object-cover" />
            <div>
              <div className="font-semibold">{c.name}</div>
              <div className="text-sm text-foreground/60">{c.party}</div>
              <div className="text-xs text-foreground/60">{c.votes} votes</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
