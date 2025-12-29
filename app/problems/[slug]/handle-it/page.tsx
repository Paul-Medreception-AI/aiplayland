"use client";

import Link from "next/link";
import { use, useMemo } from "react";
import { type AISolution } from "@/data/aiSolutions";
import { getHandleItContent, SOLUTION_LOOKUP } from "@/data/problemHandleIt";
import { PROBLEM_REGISTRY } from "@/data/problemRegistry";

type SolutionSectionConfig = ReturnType<typeof getHandleItContent>["solutionSections"][number];

function humanizeSlug(raw: string) {
  if (!raw) return "Unknown Problem";
  return raw
    .split("-")
    .map((word) => (word ? word[0].toUpperCase() + word.slice(1) : word))
    .join(" ");
}

export default function HandleItPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const problem = PROBLEM_REGISTRY.find((p) => p.slug === slug);
  const label = problem?.label ?? humanizeSlug(slug);
  const content = getHandleItContent(slug, label, problem?.lane);

  const solutionSections = useMemo(() => {
    return content.solutionSections.map((section: SolutionSectionConfig) => ({
      ...section,
      solutions: section.solutionSlugs
        .map((s) => SOLUTION_LOOKUP[s])
        .filter((solution): solution is AISolution => Boolean(solution)),
    }));
  }, [content.solutionSections]);

  return (
    <main className="bg-neutral-950 text-neutral-50">
      <nav className="mx-auto flex max-w-6xl items-center gap-2 px-6 pt-6 text-[11px] uppercase tracking-[0.3em] text-white/50">
        <Link href="/" className="transition hover:text-white">
          Home
        </Link>
        <span className="opacity-60">/</span>
        <Link href="/problems" className="transition hover:text-white">
          Problems
        </Link>
        <span className="opacity-60">/</span>
        <Link href={`/problems/${slug}`} className="transition hover:text-white">
          {label}
        </Link>
        <span className="opacity-60">/</span>
        <span className="text-white">Handle It</span>
      </nav>

      <section className="relative overflow-hidden border-b border-white/5 bg-gradient-to-b from-[#0b1a3a] via-[#0f2352] to-[#091327]">
        <div className="absolute inset-0 opacity-40">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.18),_rgba(9,19,39,0))]" />
        </div>
        <div className="relative mx-auto flex max-w-6xl flex-col gap-10 px-6 py-20 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-6 lg:max-w-3xl">
            <Link href={`/problems/${slug}`} className="inline-flex items-center text-sm text-white/70 transition hover:text-white">
              ← Back to {label}
            </Link>
            <p className="text-sm uppercase tracking-[0.5em] text-white/60">{content.heroEyebrow}</p>
            <h1 className="text-4xl font-semibold leading-tight text-white md:text-5xl">{content.heroTitle}</h1>
            <p className="text-lg text-white/80 md:text-xl">{content.heroDescription}</p>
            <div className="flex flex-wrap gap-3 text-sm">
              {solutionSections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="inline-flex items-center rounded-full border border-white/20 px-4 py-2 text-white/80 transition hover:border-white hover:text-white"
                >
                  {section.label}
                </a>
              ))}
            </div>
          </div>
          <div className="grid gap-4 text-sm text-white/80 md:grid-cols-3">
            {content.responsePillars.map((pillar) => (
              <div key={pillar.title} className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <p className="text-3xl font-semibold text-white">{pillar.metric}</p>
                <p className="mt-2 text-base font-medium text-white">{pillar.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-white/70">{pillar.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="space-y-10">
          {content.flowSteps.map((step) => (
            <div key={step.label} className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-[0_40px_120px_rgba(4,7,20,0.45)]">
              <p className="text-xs uppercase tracking-[0.4em] text-white/60">{step.label}</p>
              <div className="mt-3 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="space-y-4 lg:max-w-3xl">
                  <h2 className="text-3xl font-semibold text-white">{step.title}</h2>
                  <p className="text-base leading-relaxed text-white/80">{step.copy}</p>
                </div>
                <ul className="grid gap-2 text-sm text-white/80 lg:w-64">
                  {step.highlights.map((highlight) => (
                    <li key={highlight} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white/90">
                      {highlight}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-white/5 bg-gradient-to-b from-neutral-950 to-[#080f22]">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-white/60">Playbook</p>
              <h3 className="mt-3 text-3xl font-semibold text-white">Launch sequence (10 business days)</h3>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:border-white hover:bg-white/20"
            >
              Talk through your call volume →
            </Link>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {content.playbookSteps.map((step, index) => (
              <div key={step.title} className="rounded-3xl border border-white/10 bg-white/5 p-6 text-white/80">
                <div className="text-xs uppercase tracking-[0.3em] text-white/50">Step {index + 1}</div>
                <h4 className="mt-3 text-xl font-semibold text-white">{step.title}</h4>
                <p className="mt-2 text-sm leading-relaxed">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {solutionSections.map((section) => (
        <section key={section.id} id={section.id} className="border-t border-white/10 bg-neutral-950">
          <div className="mx-auto max-w-5xl px-6 py-16">
            <div className="flex flex-col gap-4 text-center lg:text-left">
              <p className="text-xs uppercase tracking-[0.4em] text-white/60">{section.eyebrow}</p>
              <h3 className="text-3xl font-semibold text-white">{section.label}</h3>
              <p className="text-sm text-white/70">{section.description}</p>
              {section.externalLink && (
                <Link
                  href={section.externalLink.href}
                  className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-semibold text-white transition hover:border-white hover:bg-white/20 lg:self-start"
                >
                  {section.externalLink.label} →
                </Link>
              )}
            </div>
            {section.solutions.length > 0 && (
              <div className="mt-10 grid gap-6 md:grid-cols-2">
                {section.solutions.map((solution) => (
                  <div
                    key={solution.slug}
                    className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 text-white/80 shadow-[0_30px_80px_rgba(4,7,20,0.45)]"
                  >
                    <div>
                      <p className="text-xs uppercase tracking-[0.35em] text-white/60">
                        {solution.type === "owned" ? "owned" : "curated"}
                      </p>
                      <h4 className="mt-2 text-2xl font-semibold text-white">{solution.name}</h4>
                      <p className="mt-2 text-sm text-white/70">{solution.summary}</p>
                    </div>
                    <p className="text-sm text-white/60">{solution.tagline}</p>
                    <div className="flex flex-wrap gap-2 text-xs text-white/70">
                      {solution.focus.map((tag) => (
                        <span key={tag} className="rounded-full border border-white/15 px-3 py-1">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-white">
                      {solution.stats.map((stat) => (
                        <div key={stat.label} className="rounded-2xl border border-white/10 px-3 py-2 text-center">
                          <p className="text-xl font-semibold text-white">{stat.value}</p>
                          <p className="text-xs uppercase tracking-[0.25em] text-white/60">{stat.label}</p>
                        </div>
                      ))}
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.35em] text-white/50">How it helps</p>
                      <ul className="mt-2 space-y-1 text-sm text-white/70">
                        {solution.howItHelps.map((item) => (
                          <li key={item} className="flex gap-2">
                            <span className="text-white/60">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="text-xs uppercase tracking-[0.35em] text-white/50">Activation steps</div>
                    <ul className="space-y-1 text-sm text-white/70">
                      {solution.steps.map((step) => (
                        <li key={step} className="flex gap-2">
                          <span className="text-white/60">→</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="flex flex-wrap gap-3">
                      {solution.links.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className="inline-flex flex-1 items-center justify-center rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:border-white hover:bg-white/20"
                        >
                          {link.label} →
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {section.solutions.length === 0 && section.externalSolutions && (
              <div className="mt-10 grid gap-6 md:grid-cols-2">
                {section.externalSolutions.map((solution) => (
                  <div
                    key={solution.name}
                    className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 text-white/85 shadow-[0_30px_80px_rgba(4,7,20,0.45)]"
                  >
                    <div>
                      <p className="text-xs uppercase tracking-[0.35em] text-white/60">recommended system</p>
                      <h4 className="mt-2 text-2xl font-semibold text-white">{solution.name}</h4>
                      <p className="mt-2 text-sm text-white/70">{solution.summary}</p>
                    </div>
                    <Link
                      href={solution.href}
                      className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:border-white hover:bg-white/20"
                    >
                      Visit {solution.name} →
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      ))}

      <section className="border-t border-white/10 bg-neutral-950">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 px-6 py-20 text-center">
          <p className="text-sm uppercase tracking-[0.5em] text-white/50">Ready next</p>
          <h4 className="text-3xl font-semibold text-white">Keep the cinematic field engaged or jump straight into another problem.</h4>
          <div className="flex flex-col gap-4 w-full max-w-md">
            <Link
              href={`/problems/${slug}`}
              className="rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:border-white hover:bg-white/20"
            >
              Replay the {label.toLowerCase()} canvas →
            </Link>
            <Link
              href="/problems"
              className="rounded-full border border-white/10 px-6 py-3 text-sm font-semibold text-white/80 transition hover:border-white/60 hover:text-white"
            >
              Explore another problem →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
