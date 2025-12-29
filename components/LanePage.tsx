import Link from "next/link";
import type { LaneContent } from "@/data/lanes";

interface LanePageProps {
  content: LaneContent;
}

export default function LanePage({ content }: LanePageProps) {
  const microSignals = content.choiceMicro.split("·").map((signal) => signal.trim()).filter(Boolean);
  const primaryHref = content.ctaHref === `/${content.slug}` ? "/#lanes" : content.ctaHref;

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(37,99,235,0.22),_transparent_65%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(0,0,0,0.8),_transparent_55%)]" />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-5xl flex-col px-6 pb-16 pt-8">
        <header className="flex items-center justify-between text-[11px] uppercase tracking-[0.35em] text-white/45">
          <Link href="/" className="text-sm font-semibold tracking-[0.4em] text-white hover:text-white/80">
            AIPlayLand
          </Link>
          <span className="hidden text-white/50 sm:block">Lane · {content.choiceLabel}</span>
        </header>

        <main className="flex flex-1 flex-col justify-center gap-10 py-12">
          <div className="space-y-6">
            <p className="text-xs uppercase tracking-[0.55em] text-white/45">{content.choiceLabel}</p>
            <h1 className="text-4xl font-semibold leading-tight sm:text-5xl md:text-6xl">{content.heroHeadline}</h1>
            <p className="text-lg text-white/75 md:text-xl">{content.heroSubhead}</p>
            <p className="max-w-3xl text-base text-white/60">{content.summary}</p>
          </div>

          <div className="space-y-3">
            <div className="text-xs uppercase tracking-[0.35em] text-white/55">Signals</div>
            <div className="flex flex-wrap gap-3 text-[11px] uppercase tracking-[0.35em] text-white/60">
              {microSignals.map((signal) => (
                <span key={signal} className="rounded-full border border-white/15 px-4 py-1 text-white/70">
                  {signal}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-4 pt-6">
            <Link
              href={primaryHref}
              className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-xs font-semibold uppercase tracking-[0.35em] text-white/80 transition hover:border-white/40 hover:text-white"
            >
              {content.ctaLabel}
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full bg-white/10 px-6 py-3 text-xs font-semibold uppercase tracking-[0.35em] text-white transition hover:bg-white/20"
            >
              Back to portal
            </Link>
          </div>
        </main>

        <footer className="text-[11px] uppercase tracking-[0.4em] text-white/30">Choose another lane when ready.</footer>
      </div>
    </div>
  );
}
