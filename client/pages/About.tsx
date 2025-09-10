import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="rounded-2xl p-8 glass">
        <h1 className="text-2xl font-bold">About NextStep — Indian Elections Platform</h1>
        <p className="mt-2 text-foreground/70">NextStep is a frontend-only application showcasing election polling UI and analytics. It uses mock data, candidate images, animated charts, and modern glassmorphic UI. Useful for prototypes, workshops, and civic engagement showcases.</p>
        <div className="mt-4 flex gap-3">
          <Link to="/create" className="rounded-md bg-gradient-to-r from-purple-600 to-cyan-500 px-4 py-2 text-white">Create a Poll</Link>
          <Link to="/trending" className="rounded-md border px-4 py-2">See Trending</Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="rounded-2xl p-6 glass">
          <h3 className="font-semibold">Privacy</h3>
          <p className="mt-2 text-sm text-foreground/70">Data is stored locally for preview purposes. No external servers are used by default unless configured.</p>
        </div>
        <div className="rounded-2xl p-6 glass">
          <h3 className="font-semibold">Use Cases</h3>
          <p className="mt-2 text-sm text-foreground/70">Presentations, civic tech showcases, event demonstrations, or educational tools about elections and polling.</p>
        </div>
      </div>
    </div>
  );
}
