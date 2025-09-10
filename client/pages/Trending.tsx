import { Link } from "react-router-dom";
import { getTrending } from "@/lib/polls";
import PollCard from "@/components/PollCard";
import { useState, useMemo } from "react";

export default function Trending() {
  const all = getTrending(48);
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState("");

  const polls = useMemo(()=>{
    const q = query.trim().toLowerCase();
    return all.filter(p=>{
      if(tag && !(p.tags||[]).includes(tag)) return false;
      if(!q) return true;
      return p.title.toLowerCase().includes(q) || (p.description||"").toLowerCase().includes(q) || (p.tags||[]).join(' ').toLowerCase().includes(q);
    });
  },[all,query,tag]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Trending Election Polls</h1>
          <p className="text-sm text-foreground/70">Top polls by activity, updated in real-time.</p>
        </div>
        <div className="flex items-center gap-3">
          <input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search polls, parties, tags" className="input-hero rounded-lg px-3 py-2" />
          <select value={tag} onChange={(e)=>setTag(e.target.value)} className="input-hero rounded-lg px-3 py-2">
            <option value="">All</option>
            <option value="election">Election</option>
            <option value="mla">MLA</option>
            <option value="nagar-sevak">Nagar Sevak</option>
            <option value="local">Local</option>
          </select>
          <Link to="/create" className="rounded-md bg-gradient-to-r from-purple-600 to-cyan-500 px-3 py-2 text-sm text-white">Create Poll</Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {polls.map(p=> <PollCard key={p.id} poll={p} />)}
      </div>
    </div>
  );
}
