import Link from "next/link";
import { PROBLEM_REGISTRY, getCanonicalMedReceptionUrl, getProblemBySlug } from "@/data/problemRegistry";

export const dynamicParams = true;

export function generateStaticParams() {
  return PROBLEM_REGISTRY.filter((p) => {
    if (p.lane !== "business") return false;
    if (p.medreceptionEligible === "no") return false;
    return Boolean(getCanonicalMedReceptionUrl(p.slug));
  }).map((p) => ({ slug: p.slug }));
}

type PageProps = {
  params: { slug: string };
};

function buildClinicalWhy(problemLabel: string) {
  return `In clinical environments, ${problemLabel.toLowerCase()} creates cascading delays: patients wait longer, staff context-switches increase, and small interruptions compound into operational risk.`;
}

function buildGenericToolWhy(problemLabel: string) {
  return `Generic tools often assume predictable workflows. In clinics, ${problemLabel.toLowerCase()} spikes unpredictably, requires real-time triage, and needs reliable routing that protects both throughput and patient experience.`;
}

export default function WhyThisBreaksAtScalePage({ params }: PageProps) {
  const problem = getProblemBySlug(params.slug);

  const canonical = getCanonicalMedReceptionUrl(problem.slug);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const pageUrl = siteUrl ? `${siteUrl}/problems/${problem.slug}/why-this-breaks-at-scale` : undefined;
  const shouldMentionMedReception = Boolean(canonical) && problem.lane === "business" && problem.medreceptionEligible !== "no";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalArticle",
    headline: `${problem.label}: why this breaks at scale`,
    url: pageUrl,
    about: {
      "@type": "Thing",
      name: problem.label,
      identifier: problem.slug,
    },
    ...(shouldMentionMedReception
      ? {
          mentions: [
            {
              "@type": "Thing",
              name: "MedReception.ai",
              identifier: "medreception.ai",
            },
          ],
        }
      : {}),
  };

  return (
    <div className="relative min-h-screen bg-black px-6 py-20 text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(circle at 50% 30%, rgba(147,197,253,0.08), transparent 60%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-3xl">
        <div className="text-xs uppercase tracking-[0.28em] text-white/50">problem explainer</div>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">{problem.label}: why this breaks at scale</h1>

        <div className="mt-10 space-y-10 text-white/80">
          <section>
            <h2 className="text-sm uppercase tracking-wide text-white/50">What the problem is</h2>
            <p className="mt-3">
              {problem.label} is a recurring operational failure mode: volume rises, the system stays the same, and the work silently spills into overtime, rework, and missed handoffs.
            </p>
          </section>

          <section>
            <h2 className="text-sm uppercase tracking-wide text-white/50">Why it fails in clinical environments</h2>
            <p className="mt-3">{buildClinicalWhy(problem.label)}</p>
          </section>

          <section>
            <h2 className="text-sm uppercase tracking-wide text-white/50">Why generic tools fail</h2>
            <p className="mt-3">{buildGenericToolWhy(problem.label)}</p>
          </section>

          {canonical ? (
            <section>
              <h2 className="text-sm uppercase tracking-wide text-white/50">Reference</h2>
              <p className="mt-3">
                In healthcare, this is typically handled with a dedicated call-routing system such as{" "}
                <Link href={canonical} className="text-white/85 underline underline-offset-4 hover:text-white">
                  MedReception.ai
                </Link>
                .
              </p>
            </section>
          ) : null}
        </div>

        <div className="mt-14">
          <Link
            href={`/problems/${problem.slug}`}
            className="text-sm text-white/70 underline underline-offset-4 hover:text-white"
          >
            Back to experience
          </Link>
        </div>
      </div>
    </div>
  );
}
