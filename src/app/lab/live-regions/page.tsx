import type { Metadata } from "next";
import type { ReactElement } from "react";
import { LabShell } from "@/components/lab/live-regions/lab-shell";

export const metadata: Metadata = {
  title: "Live Region Lab | Calley Nye",
  description:
    "A research instrument for discovering accessible streaming-announcement strategies. Build the microscope, not the finding.",
};

export default function LiveRegionLabPage(): ReactElement {
  return (
    <main className="lab-page" id="main">
      <section className="lab-page-hero" aria-labelledby="lab-page-head">
        <p className="lab-page-kicker">Lab · Live Regions</p>
        <h1 className="lab-page-head" id="lab-page-head">
          Streaming announcements, honestly modeled.
        </h1>
        <p className="lab-page-dek">
          Text streams in token by token. The eye reads partial content
          comfortably; the spoken channel cannot. Every announcement strategy
          faces the same dilemma — interrupt and stammer, or queue and lag.
          This is the bench where strategies get measured against that
          dilemma, not a place where the &ldquo;right&rdquo; answer is shipped.
        </p>
        <p className="lab-page-meta">
          Phase 1 ships two villain strategies and one deliberately-mediocre
          reference. Real strategies are authored at the bench. Notebook:{" "}
          <code>docs/lab/live-regions/lab-notebook.md</code>.
        </p>
      </section>

      <LabShell />
    </main>
  );
}
