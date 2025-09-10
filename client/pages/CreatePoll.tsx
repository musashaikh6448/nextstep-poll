import { useState } from "react";
import { createPoll } from "@/lib/polls";
import type { PollOption, PollSettings } from "@/types/poll";
import { useNavigate } from "react-router-dom";

const emptyOption = () => ({ id: crypto.randomUUID(), text: "", votes: 0, image: "", party: "Independent" });

export default function CreatePoll() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [options, setOptions] = useState<PollOption[]>([emptyOption(), emptyOption()]);
  const [settings, setSettings] = useState<PollSettings>({
    allowMultiple: false,
    allowRevote: false,
    showResultsBeforeVote: true,
  });
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [tags, setTags] = useState("");
  const [errors, setErrors] = useState<string | null>(null);

  const validOptionsCount = options.filter((o) => o.text.trim()).length;
  const disabled = title.trim().length < 6 || validOptionsCount < 2;

  const addOption = () => setOptions((opts) => [...opts, emptyOption()]);
  const removeOption = (id: string) => setOptions((opts) => (opts.length > 2 ? opts.filter((o) => o.id !== id) : opts));
  const moveOption = (index: number, dir: number) => {
    setOptions((prev) => {
      const copy = [...prev];
      const i = index; const j = index + dir;
      if (j < 0 || j >= copy.length) return prev;
      const tmp = copy[i]; copy[i] = copy[j]; copy[j] = tmp; return copy;
    });
  };

  const onImageChange = (id: string, url: string) => setOptions((prev) => prev.map((o) => (o.id === id ? { ...o, image: url } : o)));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors(null);
    if (disabled) { setErrors("Please provide a title (6+ chars) and at least two candidate names."); return; }
    const clean = options.map((o) => ({ ...o, text: o.text.trim() })).filter((o) => o.text);
    const parsedTags = tags.split(",").map(t=>t.trim()).filter(Boolean);
    const payload: any = { title: title.trim(), description: description.trim(), options: clean, settings, tags: parsedTags, creator: { id: 'me', name: 'You', avatarColor: '276 86% 36%' } };
    if (expiresAt) payload.expiresAt = new Date(expiresAt).getTime();
    const poll = createPoll(payload);
    navigate(`/vote/${poll.id}`);
  };

  const reset = () => { setTitle(""); setDescription(""); setOptions([emptyOption(), emptyOption()]); setSettings({ allowMultiple:false, allowRevote:false, showResultsBeforeVote:true }); setExpiresAt(null); setTags(""); setErrors(null); };

  return (
    <form onSubmit={submit} className="mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <section className="rounded-2xl p-6 glass">
          <h1 className="text-2xl font-bold">Create Election Poll</h1>
          <p className="mt-2 text-foreground/70">Professional poll creation form for MLA / Nagar Sevak elections. Add candidate photos, parties, and settings.</p>

          <fieldset className="mt-6 grid gap-4">
            <label className="grid gap-2">
              <span className="text-sm font-medium">Poll Title</span>
              <input aria-label="Poll title" value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="e.g. Ward 12 - MLA Candidate" className="input-hero rounded-lg px-4 py-3" />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-medium">Description</span>
              <textarea aria-label="Poll description" value={description} onChange={(e)=>setDescription(e.target.value)} placeholder="Optional explanation or context" rows={4} className="input-hero rounded-lg px-4 py-3" />
            </label>

            <div className="grid sm:grid-cols-2 gap-4">
              <label className="grid gap-2">
                <span className="text-sm font-medium">Expires at</span>
                <input aria-label="Expiration" type="datetime-local" value={expiresAt||""} onChange={(e)=>setExpiresAt(e.target.value||null)} className="input-hero rounded-lg px-3 py-2" />
              </label>
              <label className="grid gap-2">
                <span className="text-sm font-medium">Tags</span>
                <input aria-label="Tags" value={tags} onChange={(e)=>setTags(e.target.value)} placeholder="comma separated, e.g. mla, election" className="input-hero rounded-lg px-3 py-2" />
              </label>
            </div>

          </fieldset>
        </section>

        <section className="rounded-2xl p-6 glass">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Candidates</h2>
            <div className="flex items-center gap-2">
              <button type="button" onClick={addOption} className="rounded-md bg-gradient-to-r from-purple-600 to-cyan-500 px-3 py-2 text-sm text-white">Add Candidate</button>
              <button type="button" onClick={reset} className="rounded-md border px-3 py-2 text-sm">Reset</button>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {options.map((o, idx)=> (
              <div key={o.id} className="grid grid-cols-12 gap-3 items-center">
                <div className="col-span-2">
                  <div className="h-20 w-20 rounded-lg overflow-hidden border border-white/10">
                    <img src={o.image||'/placeholder.svg'} alt={o.text||'candidate'} onError={(e:any)=>e.currentTarget.src='/placeholder.svg'} className="h-full w-full object-cover" />
                  </div>
                </div>
                <div className="col-span-7 grid gap-2">
                  <input aria-label={`Candidate name ${idx+1}`} value={o.text} onChange={(e)=>setOptions(prev=>prev.map(x=>x.id===o.id?{...x,text:e.target.value}:x))} placeholder="Candidate full name" className="input-hero rounded-lg px-3 py-2" />
                  <div className="grid grid-cols-2 gap-2">
                    <input aria-label={`Party ${idx+1}`} value={o.party||''} onChange={(e)=>setOptions(prev=>prev.map(x=>x.id===o.id?{...x,party:e.target.value}:x))} placeholder="Party name" className="input-hero rounded-lg px-3 py-2" />
                    <input aria-label={`Image URL ${idx+1}`} value={o.image||''} onChange={(e)=>onImageChange(o.id, e.target.value)} placeholder="Image URL" className="input-hero rounded-lg px-3 py-2" />
                  </div>
                </div>
                <div className="col-span-3 flex items-center justify-end gap-2">
                  <div className="flex gap-1">
                    <button type="button" onClick={()=>moveOption(idx,-1)} aria-label="Move up" className="rounded-md border px-2 py-1">↑</button>
                    <button type="button" onClick={()=>moveOption(idx,1)} aria-label="Move down" className="rounded-md border px-2 py-1">↓</button>
                  </div>
                  <button type="button" onClick={()=>removeOption(o.id)} disabled={options.length<=2} className="rounded-md border px-3 py-2 disabled:opacity-40">Remove</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl p-6 glass">
          <h2 className="text-lg font-semibold">Voting Settings</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className="flex items-center justify-between gap-3 rounded-lg p-3 border">
              <div>
                <div className="font-medium">Allow multiple choices</div>
                <div className="text-sm text-foreground/70">Users can select more than one candidate.</div>
              </div>
              <input type="checkbox" checked={settings.allowMultiple} onChange={(e)=>setSettings(s=>({...s,allowMultiple:e.target.checked}))} className="h-5 w-5" />
            </label>

            <label className="flex items-center justify-between gap-3 rounded-lg p-3 border">
              <div>
                <div className="font-medium">Allow revote</div>
                <div className="text-sm text-foreground/70">Users can change their choice later.</div>
              </div>
              <input type="checkbox" checked={settings.allowRevote} onChange={(e)=>setSettings(s=>({...s,allowRevote:e.target.checked}))} className="h-5 w-5" />
            </label>

            <label className="flex items-center justify-between gap-3 rounded-lg p-3 border col-span-2">
              <div>
                <div className="font-medium">Show results before voting</div>
                <div className="text-sm text-foreground/70">Results visible without voting.</div>
              </div>
              <input type="checkbox" checked={settings.showResultsBeforeVote} onChange={(e)=>setSettings(s=>({...s,showResultsBeforeVote:e.target.checked}))} className="h-5 w-5" />
            </label>
          </div>
        </section>

        <div className="flex items-center justify-end gap-3">
          {errors && <div className="text-sm text-destructive mr-auto">{errors}</div>}
          <button type="button" onClick={reset} className="rounded-full border px-5 py-2.5 text-sm">Reset</button>
          <button type="submit" disabled={disabled} className="rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 px-6 py-3 text-sm font-semibold text-white">Create Poll</button>
        </div>
      </div>

      <aside className="space-y-6">
        <div className="rounded-2xl p-4 glass">
          <h3 className="text-sm font-medium">Live Preview</h3>
          <div className="mt-4">
            <div className="rounded-xl p-3 border bg-background/80">
              <h4 className="font-semibold">{title || 'Untitled Poll'}</h4>
              {description && <p className="text-sm text-foreground/70">{description}</p>}
              <div className="mt-3 space-y-2">
                {options.slice(0,4).map(o=> (
                  <div key={o.id} className="flex items-center gap-3">
                    <img src={o.image||'/placeholder.svg'} alt={o.text||'candidate'} onError={(e:any)=>e.currentTarget.src='/placeholder.svg'} className="h-10 w-10 rounded-md object-cover" />
                    <div>
                      <div className="text-sm font-medium">{o.text || 'Candidate'}</div>
                      <div className="text-xs text-foreground/60">{o.party}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-lg p-3 border text-sm text-foreground/70">Preview uses local data only — no server requests will be made.</div>
        </div>
      </aside>
    </form>
  );
}
