export function ResumeButton() {
  return (
    <a
      href="/resume.pdf"
      download
      className="group mt-2 inline-flex items-center gap-2 rounded-lg border border-cyan-400/30 bg-cyan-400/5 px-4 py-2.5 font-mono text-xs uppercase tracking-wider text-cyan-400 transition-all hover:border-cyan-400/60 hover:bg-cyan-400/10 hover:shadow-[0_0_12px_rgba(0,240,255,0.15)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/80"
      aria-label="Download resume as PDF"
    >
      <span className="text-base leading-none transition-transform group-hover:-translate-y-0.5">
        ↓
      </span>
      Download Resume
    </a>
  );
}
