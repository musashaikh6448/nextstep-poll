import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getTrending, seedIfEmpty, totalVotes } from "@/lib/polls";
import PollCard from "@/components/PollCard";

export default function Index() {
  useEffect(() => {
    seedIfEmpty();
  }, []);

  const [query, setQuery] = useState("");
  const [filterTag, setFilterTag] = useState<string | null>(null);
  const samples = getTrending(12);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return samples.filter((p) => {
      if (filterTag && !(p.tags || []).includes(filterTag)) return false;
      if (!q) return true;
      return (
        p.title.toLowerCase().includes(q) ||
        (p.description || "").toLowerCase().includes(q) ||
        (p.tags || []).join(" ").toLowerCase().includes(q)
      );
    });
  }, [samples, query, filterTag]);

  const stats = {
    polls: samples.length,
    votes: samples.reduce((acc, p) => acc + totalVotes(p), 0),
    trending: Math.min(8, samples.length),
  };

  return (
    <div className="space-y-12">
      <section className="relative overflow-hidden rounded-3xl border border-white/8 p-1 hero-bg">
        <div className="relative rounded-2xl bg-background/90 p-8 md:p-12 glass">
          <div className="grid gap-8 md:grid-cols-12 items-center">
            <div className="md:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-3">
                <div className="rounded-full bg-white/7 px-3 py-1 text-xs font-semibold text-foreground/80">
                  Verified Preview
                </div>
                <div className="h-7 w-px bg-white/8 opacity-50" />
                <div className="text-sm text-foreground/60">
                  Frontend-only • Indian election scenarios
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold leading-tight tracking-tight hero-heading">
                NextStep — Indian Election Polls
              </h1>
              <p className="text-lg text-foreground/70 max-w-2xl">
                Create, share and analyze election polls with candidate images, party badges, and live animated results — fully frontend-powered for prototypes, presentations, and civic engagement showcases.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <Link
                  to="/create"
                  className="relative inline-flex items-center gap-3 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-500 px-5 py-3 text-sm font-semibold text-white shadow-lg hover:scale-[1.02] transition-transform"
                >
                  Create Election Poll
                </Link>
                <Link
                  to="/trending"
                  className="inline-flex items-center gap-2 rounded-lg border border-white/12 px-4 py-3 text-sm font-medium text-foreground/90 hover:bg-white/5"
                >
                  Explore Trending
                </Link>
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="text-3xl font-extrabold text-foreground">
                    {stats.polls}
                  </div>
                  <div className="text-sm text-foreground/70">Active polls</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-3xl font-extrabold text-foreground">
                    {stats.votes}
                  </div>
                  <div className="text-sm text-foreground/70">Total votes</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-3xl font-extrabold text-foreground">
                    {stats.trending}
                  </div>
                  <div className="text-sm text-foreground/70">Trending polls</div>
                </div>
              </div>
            </div>
            <div className="md:col-span-5">
              <div className="relative w-full max-w-md mx-auto">
                <div className="rounded-2xl border border-white/10 bg-white/6 p-4 backdrop-blur-xl shadow-md">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-sm font-semibold">Live Poll Preview</div>
                    <div className="text-xs text-foreground/60">
                      Updated in real-time
                    </div>
                  </div>
                  <div className="grid gap-3">
                    {samples.slice(0, 3).map((p) => (
                      <div
                        key={p.id}
                        className="rounded-xl overflow-hidden border border-white/6 bg-background/70 p-3 candidate-card"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={p.options[0]?.image || "/placeholder.svg"}
                            alt={p.options[0]?.text}
                            className="h-12 w-12 rounded-lg object-cover border border-white/10"
                          />
                          <div className="flex-1">
                            <div className="text-sm font-semibold">{p.title}</div>
                            <div className="text-xs text-foreground/60">
                              {totalVotes(p)} votes • {p.creator?.name}
                            </div>
                          </div>
                          <div className="text-sm font-medium text-foreground/80">
                            {Math.round(
                              ((p.options[0]?.votes || 0) /
                                Math.max(1, totalVotes(p))) *
                                100,
                            )}
                            %
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-xs text-foreground/60">
                      Preview uses local data only — no real voting records
                    </div>
                    <Link to="/trending" className="text-xs text-primary hover:underline">
                      See all
                    </Link>
                  </div>
                </div>
                <div className="absolute -right-6 -bottom-6 w-44 h-44 rounded-full opacity-8 bg-gradient-to-r from-purple-400/30 to-cyan-300/20 blur-3xl pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="text-2xl font-bold">Trending Now — Election Polls</h2>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search polls, tags or parties"
              className="input-hero rounded-lg px-4 py-2 text-sm w-full sm:w-auto"
            />
            <select
              value={filterTag || ""}
              onChange={(e) => setFilterTag(e.target.value || null)}
              className="input-hero rounded-lg px-3 py-2 text-sm w-full sm:w-auto"
            >
              <option value="">All</option>
              <option value="election">Election</option>
              <option value="mla">MLA</option>
              <option value="nagar-sevak">Nagar Sevak</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <PollCard key={p.id} poll={p} />
          ))}
        </div>
      </section>

      <section className="mt-12 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl p-6 glass">
            <h3 className="text-xl font-semibold">How NextStep Works</h3>
            <ol className="mt-4 list-decimal list-inside space-y-2 text-foreground/70">
              <li>Create an election poll with candidate names, party, and photo.</li>
              <li>
                Share the poll link with participants; all data stays local for
                preview and testing.
              </li>
              <li>
                Watch animated, real-time results with exportable charts and
                images.
              </li>
            </ol>
          </div>
          <div className="rounded-2xl p-6 glass">
            <h3 className="text-xl font-semibold">Features</h3>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2 text-foreground/70">
              <li>Frosted glass UI with neon accents</li>
              <li>Candidate images and party badges</li>
              <li>Animated charts: bar, pie, and line</li>
              <li>Live simulation, sharing, and export (CSV/PNG)</li>
              <li>Light and dark themes with accessible contrast</li>
              <li>Local mock data — no backend required</li>
            </ul>
          </div>
          <div className="rounded-2xl p-6 glass">
            <h3 className="text-xl font-semibold">Testimonials</h3>
            <div className="mt-4 space-y-3">
              <blockquote className="text-foreground/70">
                "Beautiful and clear presentation for election showcases — loved
                the charts." — R. Mehra
              </blockquote>
              <blockquote className="text-foreground/70">
                "Great for workshops and civic outreach." — S. Patel
              </blockquote>
            </div>
          </div>
        </div>
        <aside className="space-y-4">
          <div className="rounded-2xl p-6 glass">
            <h3 className="text-lg font-semibold">Get Started</h3>
            <p className="mt-2 text-foreground/70">
              Create your first poll or explore trending polls to see how
              results are visualized.
            </p>
            <div className="mt-4 flex flex-col gap-2">
              <Link
                to="/create"
                className="rounded-md bg-gradient-to-r from-purple-600 to-cyan-500 px-4 py-2 text-white text-center"
              >
                Create Election Poll
              </Link>
              <Link
                to="/trending"
                className="rounded-md border px-4 py-2 text-center"
              >
                Explore Trending
              </Link>
            </div>
          </div>
          <div className="rounded-2xl p-4 glass">
            <h4 className="text-sm font-medium">Top MLAs / Candidates</h4>
            <ul className="mt-3 space-y-2 text-sm text-foreground/70">
              <li>Suleman Khan — People's Progress Party</li>
              <li>Shaikh Musa — National Unity Front</li>
              <li>Shaikh Shafe — Independent</li>
              <li>Rahul Mehra — People's Progress Party</li>
            </ul>
          </div>
        </aside>
      </section>
    </div>
  );
}
