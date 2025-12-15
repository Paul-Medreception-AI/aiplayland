import Link from "next/link";

const highlights = [
  {
    title: "24/7 Concierge AI",
    detail: "Route every message, call, or text to the right workflow without human triage.",
  },
  {
    title: "Operator-Grade Insights",
    detail: "Know what is breaking before customers do with live system telemetry.",
  },
  {
    title: "Conversation Memory",
    detail: "Hand off between humans and AI with zero context lost across channels.",
  },
];

const stats = [
  { label: "Avg. speed-to-response", value: "<5s" },
  { label: "Playbooks shipped", value: "140+" },
  { label: "Teams onboarded", value: "22" },
];

export default function Page() {
  return (
    <div className="min-h-screen bg-[#050B18] text-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-6 py-16 md:py-24">
        <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#0f1f47] to-[#071129] p-10 shadow-[0_30px_120px_rgba(5,11,24,0.75)]">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-center">
            <div className="flex-1 space-y-6">
              <p className="text-sm uppercase tracking-[0.3em] text-white/60">AIPlayLand</p>
              <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl">
                Practical AI systems for teams who need answers, not demo theater.
              </h1>
              <p className="text-base text-white/70 sm:text-lg">
                We design white-glove automations that sit quietly inside your org. No dashboards to babysit, just
                measurable reductions in chaos across phones, inboxes, and frontline workflows.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link
                  href="mailto:paul@aiplayland.com"
                  className="rounded-full bg-white px-6 py-3 text-center text-sm font-semibold text-[#0D1A34] transition hover:-translate-y-0.5"
                >
                  Book a working session
                </Link>
                <Link
                  href="/"
                  className="rounded-full border border-white/30 px-6 py-3 text-center text-sm font-semibold text-white transition hover:-translate-y-0.5"
                >
                  Explore current builds
                </Link>
              </div>
            </div>
            <div className="flex flex-1 flex-col gap-6 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
              <p className="text-sm font-semibold uppercase tracking-wide text-white/70">At a glance</p>
              <div className="grid gap-4 sm:grid-cols-3">
                {stats.map((stat) => (
                  <div key={stat.label} className="rounded-xl bg-white/5 p-4 text-center">
                    <div className="text-2xl font-semibold text-white">{stat.value}</div>
                    <p className="mt-2 text-xs uppercase tracking-wide text-white/60">{stat.label}</p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-white/50">
                We only ship automations we personally monitor. Every engagement includes instrumentation, playbooks, and
                human oversight.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-8">
          <header>
            <p className="text-sm uppercase tracking-[0.3em] text-white/60">What we bring</p>
            <h2 className="mt-2 text-3xl font-semibold text-white">Static-first reliability, AI when it matters.</h2>
            <p className="mt-4 max-w-3xl text-white/70">
              The deployed site stays fast and predictable while we gradually layer cinematic interactions. This version keeps
              routing simple so DNS, caching, and Vercel builds remain deterministic.
            </p>
          </header>
          <div className="grid gap-6 md:grid-cols-3">
            {highlights.map((item) => (
              <div key={item.title} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                <p className="mt-3 text-sm text-white/70">{item.detail}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-[#0b1a3a] p-10 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-white/60">Ready when you are</p>
          <h3 className="mt-4 text-3xl font-semibold text-white">Connect to the operators behind AIPlayLand.</h3>
          <p className="mt-4 text-white/70">
            We work like a strike team: diagnose, design, deploy, keep watching. Send us your toughest workflow and we will
            show you what ruthless clarity looks like.
          </p>
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="mailto:paul@aiplayland.com"
              className="rounded-full bg-white px-8 py-3 text-sm font-semibold text-[#0D1A34] transition hover:-translate-y-0.5"
            >
              Start a project
            </Link>
            <Link href="/" className="text-sm font-semibold text-white/70 hover:text-white">
              Download latest study →
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
