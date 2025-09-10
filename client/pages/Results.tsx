import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { exportChartSVGToPNG, getPollById, seedIfEmpty, toCSV, totalVotes, simulateStep } from "@/lib/polls";
import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Line, LineChart } from "recharts";
import ShareModal from "@/components/ShareModal";

export default function Results() {
  const { id } = useParams();
  const chartWrapRef = useRef<HTMLDivElement | null>(null);
  const [tab, setTab] = useState<"bar"|"pie"|"line">("bar");
  const [simulating, setSimulating] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [tick, setTick] = useState(0);
  useEffect(() => { seedIfEmpty(); }, []);

  const poll = useMemo(() => (id ? getPollById(id) : undefined), [id, simulating, tick]);
  if (!poll) {
    return (
      <div className="mx-auto max-w-3xl rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
        <h1 className="text-2xl font-bold">Results not found</h1>
        <p className="mt-2 text-foreground/70">This poll does not exist.</p>
        <div className="mt-4"><Link to="/trending" className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">See trending polls</Link></div>
      </div>
    );
  }

  const total = totalVotes(poll) || 1;
  const data = poll.options.map((o, i) => ({ name: o.text, value: o.votes, id: o.id }));
  const colors = ["hsl(var(--primary))", "hsl(var(--accent))", "hsl(var(--brand-pink))", "#8B5CF6", "#06B6D4", "#EC4899"]; // fallback palette

  const copyLink = async () => { await navigator.clipboard.writeText(window.location.href); };
  const downloadCSV = () => { const blob = new Blob([toCSV(poll)], { type: "text/csv;charset=utf-8;" }); const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = `${poll.title.replace(/[^a-z0-9]+/gi, "-")}.csv`; a.click(); URL.revokeObjectURL(url); };

  const downloadPNG = () => { const wrap = chartWrapRef.current; if (!wrap) return; const svg = wrap.querySelector('svg'); if (!svg) return; exportChartSVGToPNG(svg as SVGSVGElement, `${poll.title.replace(/[^a-z0-9]+/gi, "-")}-chart`); };

  useEffect(()=>{
    let idt: any;
    if(simulating && id){ idt = setInterval(()=>{ simulateStep(id, 1); setTick(t=>t+1); }, 1200); }
    return ()=>clearInterval(idt);
  },[simulating, id]);

  const toggleFullscreen = async () => {
    const el = chartWrapRef.current as any;
    if(!el) return;
    if(!document.fullscreenElement) await el.requestFullscreen(); else await document.exitFullscreen();
  };

  return (
    <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-5">
      <ShareModal open={shareOpen} onClose={()=>setShareOpen(false)} url={window.location.href} title={poll.title} />
      <div className="lg:col-span-3">
        <div className="chart-box">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">{poll.title}</h1>
              <div className="mt-1 text-sm text-foreground/70">{poll.description}</div>
              <div className="mt-3 flex items-center gap-2">
                {(poll.tags || []).map(t=> <span key={t} className="badge">#{t}</span>)}
              </div>
            </div>
            <div className="text-sm text-foreground/70 text-right">
              <div>By <strong>{poll.creator?.name || 'Anon'}</strong></div>
              <div>{new Date(poll.createdAt).toLocaleString()}</div>
              <div className="mt-2 text-xs text-foreground/60">Updated: {new Date().toLocaleTimeString()}</div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="rounded-full p-1 bg-transparent">
              <div className="flex items-center gap-1 rounded-full p-1">
                <button onClick={()=>setTab('bar')} className={`px-3 py-2 text-sm ${tab==='bar' ? 'bg-white/6 rounded-full' : 'hover:bg-white/3'}`}>Bar</button>
                <button onClick={()=>setTab('pie')} className={`px-3 py-2 text-sm ${tab==='pie' ? 'bg-white/6 rounded-full' : 'hover:bg-white/3'}`}>Pie</button>
                <button onClick={()=>setTab('line')} className={`px-3 py-2 text-sm ${tab==='line' ? 'bg-white/6 rounded-full' : 'hover:bg-white/3'}`}>Line</button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button onClick={()=>setSimulating(s=>!s)} className={`rounded-full px-3 py-2 text-sm ${simulating? 'bg-primary text-primary-foreground' : 'border hover:bg-white/3'}`}>{simulating? 'Stop live' : 'Simulate live'}</button>
              <button onClick={toggleFullscreen} className="rounded-full border px-3 py-2 text-sm">Fullscreen</button>
              <button onClick={()=>setShareOpen(true)} className="rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 px-3 py-2 text-sm text-white">Share</button>
            </div>
          </div>

          <div className="mt-6 grid gap-4">
            <div className="rounded-lg chart-box">
              <div className="h-64 w-full" ref={chartWrapRef}>
                <ResponsiveContainer>
                  {tab==='bar' && (
                    <BarChart data={data} barCategoryGap={22}>
                      <XAxis dataKey="name" hide />
                      <YAxis hide />
                      <Tooltip cursor={{ fill: "rgba(0,0,0,0.05)" }} contentStyle={{ background: "transparent", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 8, color: "inherit" }} />
                      <Bar dataKey="value" radius={[8, 8, 8, 8]}>
                        {data.map((entry, index) => (
                          <Cell key={`cell-${entry.id}`} fill={colors[index % colors.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  )}
                  {tab==='pie' && (
                    <PieChart>
                      <Pie data={data} dataKey="value" nameKey="name" innerRadius={56} outerRadius={88} paddingAngle={3} cornerRadius={10}>
                        {data.map((entry, index) => (
                          <Cell key={`cellp-${entry.id}`} fill={colors[index % colors.length]} />
                        ))}
                      </Pie>
                    </PieChart>
                  )}
                  {tab==='line' && (
                    <LineChart data={data}>
                      <XAxis dataKey="name" hide />
                      <YAxis hide />
                      <Tooltip cursor={{ fill: "rgba(0,0,0,0.05)" }} />
                      <Line type="monotone" dataKey="value" stroke={colors[0]} strokeWidth={3} dot={{ r:6 }} />
                    </LineChart>
                  )}
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-lg p-3 card">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">Legend</div>
                <div className="text-sm text-foreground/60">Total {total} votes</div>
              </div>
              <div className="mt-3 grid gap-2">
                {poll.options.map((o,i)=> (
                  <div key={o.id} className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="legend-swatch" style={{background: colors[i%colors.length]}} />
                      <div>
                        <div className="text-sm font-medium">{o.text}</div>
                        <div className="text-xs text-foreground/60">{o.party}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold">{Math.round((o.votes/total)*100)}%</div>
                      <div className="text-xs text-foreground/60">{o.votes} votes</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

      <aside className="space-y-4 lg:col-span-2">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
          <div className="text-sm text-foreground/70">Overview</div>
          <div className="mt-2 grid gap-2 text-sm">
            {poll.options.map((o, i) => {
              const pct = Math.round((o.votes / total) * 100);
              return (
                <div key={o.id} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img src={o.image || '/placeholder.svg'} alt={o.text} className="h-10 w-10 rounded-md object-cover border border-white/10" />
                    <div>
                      <div className="text-sm font-medium">{o.text}</div>
                      <div className="text-xs text-foreground/60">{o.party}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold">{pct}%</div>
                    <div className="text-xs text-foreground/60">{o.votes} votes</div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-3 text-sm text-foreground/70">Total votes: <b>{total}</b></div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
          <div className="text-sm text-foreground/70">Share</div>
          <div className="mt-2 flex items-center gap-2">
            <input readOnly value={window.location.href} className="w-full rounded-xl border border-white/15 bg-background/80 px-3 py-2 text-sm" />
            <button onClick={copyLink} className="rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground">Copy</button>
            <button onClick={()=>setShareOpen(true)} className="rounded-xl border border-white/15 px-3 py-2 text-sm">More</button>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
          <div className="text-sm text-foreground/70">Export</div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button onClick={downloadCSV} className="rounded-xl border border-white/15 px-3 py-2 text-sm hover:bg-white/10">CSV</button>
            <button onClick={downloadPNG} className="rounded-xl border border-white/15 px-3 py-2 text-sm hover:bg-white/10">PNG</button>
          </div>
          <p className="mt-3 text-xs text-foreground/60">PNG exports the visible chart as an image.</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
          <div className="text-sm text-foreground/70">Actions</div>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link to={`/vote/${poll.id}`} className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold backdrop-blur-xl hover:bg-white/10">Back to Vote</Link>
            <Link to="/create" className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground btn-glow">Create Poll</Link>
          </div>
        </div>
      </aside>

    </div>
  );
}
