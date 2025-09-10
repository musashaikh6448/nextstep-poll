import { useEffect } from "react";

export default function ShareModal({ open, onClose, url, title }:{ open:boolean; onClose:()=>void; url:string; title?:string }){
  useEffect(()=>{
    if(!open) return;
    const onKey=(e:KeyboardEvent)=>{ if(e.key==='Escape') onClose(); };
    window.addEventListener('keydown', onKey); return ()=>window.removeEventListener('keydown', onKey);
  },[open]);

  if(!open) return null;
  const share = (kind:string)=>{
    const txt = encodeURIComponent(title||'');
    const u = encodeURIComponent(url);
    let shareUrl = '';
    if(kind==='twitter') shareUrl = `https://twitter.com/intent/tweet?url=${u}&text=${txt}`;
    if(kind==='facebook') shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${u}`;
    if(kind==='linkedin') shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${u}&title=${txt}`;
    window.open(shareUrl,'_blank');
  };

  return (
    <div className="fixed inset-0 z-[9999] grid place-items-center" role="dialog" aria-modal="true" aria-label="Share poll">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold">Share Poll</h3>
          <button onClick={onClose} className="text-sm">Close</button>
        </div>
        <p className="mt-2 text-sm text-foreground/70">Share your poll with others using the links below or copy a shareable link.</p>
        <div className="mt-4 flex items-center gap-3">
          <button onClick={()=>share('twitter')} className="flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-cyan-400 px-4 py-2 text-sm font-semibold text-white">Twitter</button>
          <button onClick={()=>share('facebook')} className="flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-400 to-pink-500 px-4 py-2 text-sm font-semibold text-white">Facebook</button>
          <button onClick={()=>share('linkedin')} className="flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 px-4 py-2 text-sm font-semibold text-white">LinkedIn</button>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <input readOnly value={url} className="w-full rounded-xl border border-white/15 bg-background/80 px-3 py-2 text-sm" />
          <button onClick={()=>navigator.clipboard.writeText(url)} className="rounded-xl border border-white/15 px-3 py-2 text-sm">Copy</button>
        </div>
      </div>
    </div>
  );
}
