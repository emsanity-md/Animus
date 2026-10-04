import { Masthead } from "@/components/site/masthead";
import { DemoNotice } from "@/components/site/demo-notice";
import { Hero } from "@/components/site/hero";
import { StatStrip } from "@/components/site/stat-strip";
import { Features } from "@/components/site/features";
import { LibraryShelf } from "@/components/site/library-shelf";
import { HowItWorks } from "@/components/site/how-it-works";
import { WhyFree } from "@/components/site/why-free";
import { Faq } from "@/components/site/faq";
import { ClosingCta } from "@/components/site/closing-cta";
import { SiteFooter } from "@/components/site/site-footer";

/**
 * Band order is the argument order:
 *   notice  → we are a demo, said plainly
 *   hero    → the claim
 *   stats   → the claim as four numbers
 *   features→ what that buys you
 *   library → proof it looks like a catalog
 *   how     → the flow, minus the sign-up
 *   why     → why there's nothing to upgrade to
 *   faq     → the objection, answered
 *   cta     → back to the claim
 *
 * No testimonials: there is no social proof for a project with two commits,
 * and a fabricated review wall would contradict the only thing this page
 * is selling, which is that it can be trusted.
 */
export default function Home() {
  return (
    <>
      <DemoNotice />
      <Masthead />

      <main id="main" className="flex-1">
        <Hero />
        <StatStrip />
        <Features />
        <LibraryShelf />
        <HowItWorks />
        <WhyFree />
        <Faq />
        <ClosingCta />
      </main>

      <SiteFooter />
    </>
  );
}