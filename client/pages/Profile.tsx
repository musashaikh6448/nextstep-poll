import { Link } from "react-router-dom";

export default function Profile(){
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="rounded-2xl p-6 glass flex items-center gap-4">
        <div className="h-20 w-20 rounded-lg bg-gradient-to-br from-purple-600 to-cyan-400 flex items-center justify-center text-white font-bold">U</div>
        <div>
          <div className="text-lg font-semibold">User</div>
          <div className="text-sm text-foreground/70">Participant • Test Account</div>
        </div>
      </div>
      <div className="rounded-2xl p-6 glass">
        <h3 className="font-semibold">Your Polls</h3>
        <p className="mt-2 text-sm text-foreground/70">No polls created yet. Try creating a new election poll.</p>
        <div className="mt-4"><Link to="/create" className="rounded-md bg-gradient-to-r from-purple-600 to-cyan-500 px-4 py-2 text-white">Create Poll</Link></div>
      </div>
    </div>
  );
}
