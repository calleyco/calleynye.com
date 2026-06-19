import Link from "next/link";
import { Fragment, type ReactElement } from "react";
import { formatWritingDate } from "@/lib/dates";
import {
  centralThesis,
  resumeEducation,
  resumeItems,
  resumeSkills,
  resumeSummary,
  speakingEvents,
} from "@/lib/site-data";
import { getAllWritingMeta } from "@/lib/writing";
import styles from "./home.module.scss";

const heroRoles = ["DESIGN TECHNOLOGIST", "ACCESSIBILITY SPECIALIST", "REAL-TIME UI ENGINEER"];
const heroTech = ["VUE", "REACT", "NEXT", "TYPESCRIPT", "WEBSOCKETS", "DESIGN SYSTEMS", "WCAG", "PERFORMANCE"];

// One marquee "tile": items separated by accent pipes, with a trailing pipe so the
// loop seam keeps the same rhythm. The track renders two identical tiles, so the
// translateX(-50%) loop lands exactly on the start of the second copy.
function MarqueeTile({ items }: { items: string[] }): ReactElement {
  return (
    <div className="hero-scroll-set">
      {items.map((item) => (
        <Fragment key={item}>
          <span>{item}</span>
          <span className="accent">|</span>
        </Fragment>
      ))}
    </div>
  );
}

export default async function Home(): Promise<ReactElement> {
  const posts = await getAllWritingMeta();
  const featuredPosts = posts.slice(0, 4);

  return (
    <main className={styles.homeScope} id="main">
      <section aria-labelledby="hero-head" className="hero">
        <div aria-hidden="true" className="hero-scroll">
          <div className="hero-scroll-track">
            <MarqueeTile items={heroRoles} />
            <MarqueeTile items={heroRoles} />
          </div>
        </div>

        <div className="hero-body">
          <p className="hero-kicker">01 | Hello</p>
          <h1 className="hero-head" id="hero-head">
            <span className="line">
              <span className="w">Hi,</span> <span className="w">I&rsquo;m</span>{" "}
              <span className="italic accent">Calley</span>.
            </span>
            <span className="line">
              <span className="w">I</span> <span className="w">build</span> <span className="w italic">interfaces</span>
            </span>
            <span className="line">
              <span className="w">that</span> <span className="w">behave</span> <span className="w">like</span>
            </span>
            <span className="line">
              <span className="w italic accent">everyone</span> <span className="w">is</span> <span className="w">the</span>{" "}
              <span className="w">default.</span>
            </span>
          </h1>
          <p className="hero-sub">
            Senior frontend engineer with 10+ years in UI engineering, with a focus on accessibility and UX. I design
            systems where shipping fast and shipping inclusively are the same path.
          </p>
          <p className="hero-sub thesis-line">{centralThesis}</p>

          <div className="hero-ctas">
            <Link
              className="cta-primary"
              href="/writing/which-model-of-disability-is-your-ai-product-operating-from"
              prefetch={false}
            >
              Read the essay <span aria-hidden="true">-&gt;</span>
            </Link>
            <a className="cta-secondary" href="/resume.pdf">
              Download resume PDF
            </a>
            <a className="cta-secondary" href="#contact">
              Contact <span aria-hidden="true">-&gt;</span>
            </a>
          </div>
        </div>

        <div aria-hidden="true" className="hero-scroll reverse">
          <div className="hero-scroll-track">
            <MarqueeTile items={heroTech} />
            <MarqueeTile items={heroTech} />
          </div>
        </div>
      </section>

      <section aria-labelledby="manifesto-head" className="manifesto">
        <p className="section-tag">02 | Thesis</p>
        <h2 className="manifesto-head" id="manifesto-head">
          Accessibility is not a feature. It is an architectural decision.
        </h2>
        <div className="manifesto-grid">
          <p>
            I build products from the assumption that disabled users are not edge cases. If the architecture treats
            inclusion as optional, the interface will eventually expose that decision.
          </p>
          <p>
            AI-assisted development is the first meaningful chance to invert accessibility economics. My work focuses on
            making the inclusive implementation the easiest implementation for product teams.
          </p>
        </div>
      </section>

      <section aria-labelledby="writing-head" className="writing" id="writing">
        <div className="section-header">
          <p className="section-tag">03 | Writing</p>
          <h2 className="section-head" id="writing-head">
            Recent essays
          </h2>
          <Link className="section-link" href="/writing" prefetch={false}>
            Full index -&gt;
          </Link>
        </div>
        <ol className="articles">
          {featuredPosts.map((post, index) => (
            <li className="art" key={post.slug}>
              <Link className="art-link" href={`/writing/${post.slug}`} prefetch={false}>
                <span aria-hidden="true" className="art-num">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="art-body">
                  <h3 className="art-title">{post.title}</h3>
                  <p className="art-dek">{post.description}</p>
                  <div className="art-meta">
                    <span>{formatWritingDate(post.date, { year: "numeric", month: "short", day: "numeric" })}</span>
                    <span aria-hidden="true">|</span>
                    <span>{post.readingTime}</span>
                    <span aria-hidden="true">|</span>
                    <span>{post.tags.join(" / ")}</span>
                  </div>
                </div>
                <span aria-hidden="true" className="art-arrow">
                  -&gt;
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="speaking-head" className="speaking" id="speaking">
        <p className="section-tag">04 | Speaking</p>
        <h2 className="section-head" id="speaking-head">
          Talks and workshops
        </h2>
        <ul className="speaking-list">
          {speakingEvents.map((event) => (
            <li className="speaking-item" key={`${event.event}-${event.year}`}>
              <span className="speaking-year">{event.year}</span>
              <div>
                <h3>{event.event}</h3>
                <p>{event.talk}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="resume-head" className="resume" id="resume">
        <div className="section-header">
          <p className="section-tag">05 | Resume</p>
          <h2 className="section-head" id="resume-head">
            Resume
          </h2>
          <a className="section-link" href="/resume.pdf">
            PDF download -&gt;
          </a>
        </div>

        <p className="resume-summary">{resumeSummary}</p>

        <h3 className="resume-subhead" id="resume-experience-head">
          Experience
        </h3>
        <ol aria-labelledby="resume-experience-head" className="resume-list">
          {resumeItems.map((item) => (
            <li className="resume-item" key={`${item.company}-${item.role}`}>
              <div className="resume-item-head">
                <h4 className="resume-role">{item.role}</h4>
                <p className="resume-meta">
                  {item.company} | {item.period}
                </p>
              </div>
              <p className="resume-item-summary">{item.summary}</p>
              <ul className="resume-highlights">
                {item.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>

        <h3 className="resume-subhead" id="resume-skills-head">
          Core skills
        </h3>
        <ul aria-labelledby="resume-skills-head" className="resume-skills">
          {resumeSkills.map((group) => (
            <li className="resume-skill-group" key={group.group}>
              <span className="resume-skill-label">{group.group}</span>
              <span className="resume-skill-items">{group.items.join(" · ")}</span>
            </li>
          ))}
        </ul>

        <h3 className="resume-subhead" id="resume-education-head">
          Education
        </h3>
        <p aria-labelledby="resume-education-head" className="resume-education">
          <span className="resume-education-school">{resumeEducation.school}</span> — {resumeEducation.program}
          <span className="resume-meta"> · {resumeEducation.period}</span>
        </p>
      </section>

      <section aria-labelledby="contact-head" className="contact" id="contact">
        <p className="section-tag">06 | Contact</p>
        <h2 className="contact-head" id="contact-head">
          Say hello.
        </h2>
        <p className="contact-note">Job inquiries and professional conversations only.</p>
        <div className="contact-grid">
          <a className="contact-item" href="mailto:hi@calley.io">
            <span className="ci-label">Email</span>
            <span className="ci-value">hi@calley.io</span>
          </a>
          <a className="contact-item" href="https://linkedin.com/in/calleynye" rel="noreferrer" target="_blank">
            <span className="ci-label">LinkedIn</span>
            <span className="ci-value">/in/calleynye</span>
          </a>
          <a className="contact-item" href="https://github.com/syren" rel="noreferrer" target="_blank">
            <span className="ci-label">GitHub</span>
            <span className="ci-value">/syren</span>
          </a>
        </div>
      </section>
    </main>
  );
}
