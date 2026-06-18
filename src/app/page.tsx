import Link from "next/link";
import type { ReactElement } from "react";
import { formatWritingDate } from "@/lib/dates";
import { centralThesis, resumeItems, resumeSkills, resumeSummary, speakingEvents } from "@/lib/site-data";
import { getAllWritingMeta } from "@/lib/writing";
import styles from "./home.module.scss";

export default async function Home(): Promise<ReactElement> {
  const posts = await getAllWritingMeta();
  const featuredPosts = posts.slice(0, 4);

  return (
    <main className={styles.homeScope} id="main">
      <section aria-labelledby="hero-head" className="hero">
        <div className="hero-scroll">
          <span>DESIGN TECHNOLOGIST</span>
          <span className="accent">|</span>
          <span>ACCESSIBILITY SPECIALIST</span>
          <span className="accent">|</span>
          <span>REAL-TIME UI ENGINEER</span>
          <span className="accent">|</span>
          <span>DESIGN TECHNOLOGIST</span>
          <span className="accent">|</span>
          <span>ACCESSIBILITY SPECIALIST</span>
          <span className="accent">|</span>
          <span>REAL-TIME UI ENGINEER</span>
        </div>

        <div className="hero-body">
          <p className="hero-kicker">01 | Hello</p>
          <h1 className="hero-head" id="hero-head">
            <span className="line">
              <span className="w">I</span> <span className="w">build</span> <span className="w italic">interfaces</span>
            </span>
            <span className="line">
              <span className="w">that</span> <span className="w">behave</span> <span className="w">like</span>
            </span>
            <span className="line">
              <span className="w italic accent">everyone</span> <span className="w">is</span> <span className="w">the</span>{" "}
              <span className="w">default</span>.
            </span>
          </h1>
          <p className="hero-sub">
            Senior frontend engineer with 10+ years in UI engineering and 6+ years specializing in accessibility. I
            design systems where shipping fast and shipping inclusively are the same path.
          </p>
          <p className="hero-sub thesis-line">{centralThesis}</p>

          <div className="hero-ctas">
            <Link className="cta-primary" href="/writing/which-model-of-disability-is-your-ai-product-operating-from">
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

        <div className="hero-scroll reverse">
          <span>
            VUE | REACT | NEXT | TYPESCRIPT | WEBSOCKETS | DESIGN SYSTEMS | WCAG | PERFORMANCE | VUE | REACT | NEXT |
            TYPESCRIPT | WEBSOCKETS
          </span>
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
          <Link className="section-link" href="/writing">
            Full index -&gt;
          </Link>
        </div>
        <ol className="articles">
          {featuredPosts.map((post, index) => (
            <li className="art" key={post.slug}>
              <Link className="art-link" href={`/writing/${post.slug}`}>
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

        {/*
          TODO(owner): add an Education / certifications block here if you want it
          on the inline resume — omitted rather than invented. The PDF remains the
          complete record.
        */}

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
      </section>

      <section aria-labelledby="contact-head" className="contact" id="contact">
        <p className="section-tag">06 | Contact</p>
        <h2 className="contact-head" id="contact-head">
          Say hello.
        </h2>
        <p className="contact-note">Job inquiries and professional conversations only.</p>
        <div className="contact-grid">
          <a className="contact-item" href="mailto:calley.nye@gmail.com">
            <span className="ci-label">Email</span>
            <span className="ci-value">calley.nye@gmail.com</span>
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
