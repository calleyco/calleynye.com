"use client";

import { useEffect } from "react";
import { resumeEducation, resumeItems, resumeSkills, resumeSummary } from "@/lib/site-data";

const EMAIL = "hi@calley.io";
const LINKEDIN = "https://linkedin.com/in/calleynye";
const GITHUB = "https://github.com/syren";

type TerminalCommand = () => string;

declare global {
  interface Window {
    __calleyTerminal?: boolean;
    help?: TerminalCommand;
    about?: TerminalCommand;
    resume?: TerminalCommand;
    skills?: TerminalCommand;
    timeline?: TerminalCommand;
    hire?: TerminalCommand;
  }
}

// Console styles, matching the site's dark + hot-pink brand.
const ACCENT = "color:#ff3ea5;font-weight:700";
const HEAD = "color:#ff3ea5;font-weight:700;font-size:13px";
const ITALIC = "color:#ff3ea5;font-style:italic";
const FG = "color:#f4ebf5";
const MUTE = "color:#b8a8bb";

/**
 * Prints a branded terminal banner to the DevTools console and exposes a few
 * playful commands on `window` (help, about, resume, skills, timeline, hire).
 * Renders nothing. Content is sourced from site-data so it never drifts from
 * the rendered site.
 */
export function ConsoleEasterEgg(): null {
  useEffect(() => {
    if (window.__calleyTerminal) return;
    window.__calleyTerminal = true;

    const resumeUrl = `${window.location.origin}/resume.pdf`;

    window.help = () => {
      console.log("%cCALLEY NYE TERMINAL — commands", HEAD);
      const commands: Array<[string, string]> = [
        ["about()", "the person behind the pixels"],
        ["resume()", "the short version, plus the PDF"],
        ["skills()", "the toolkit"],
        ["timeline()", "career, most recent first"],
        ["hire()", "let’s talk"],
        ["help()", "this menu"],
      ];
      for (const [cmd, desc] of commands) {
        console.log(`%c  ${cmd.padEnd(13)}%c${desc}`, ACCENT, MUTE);
      }
      return "Pick a command ↑";
    };

    window.about = () => {
      console.log("%cAbout", HEAD);
      console.log("%cCalley Nye — senior frontend engineer in Los Angeles.", FG);
      console.log("%cI build interfaces that behave like everyone is the default.", ITALIC);
      console.log(`%c${resumeSummary}`, MUTE);
      return "Curious what I’ve built? Try timeline() or resume().";
    };

    window.resume = () => {
      console.log("%cRésumé", HEAD);
      console.log(`%c${resumeSummary}`, FG);
      console.log(`%c${resumeEducation.school} — ${resumeEducation.program} · ${resumeEducation.period}`, MUTE);
      console.log(`%cFull PDF → %c${resumeUrl}`, MUTE, ACCENT);
      return resumeUrl;
    };

    window.skills = () => {
      console.log("%cSkills", HEAD);
      for (const group of resumeSkills) {
        console.log(`%c${group.group}%c  ${group.items.join(" · ")}`, ACCENT, MUTE);
      }
      return "Built to ship fast and ship inclusively.";
    };

    window.timeline = () => {
      console.log("%cTimeline", HEAD);
      for (const role of resumeItems) {
        console.log(`%c${role.period.padEnd(20)}%c${role.role} · ${role.company}`, ACCENT, FG);
      }
      return "Full detail in resume().";
    };

    window.hire = () => {
      console.log("%cLet’s talk.", HEAD);
      console.log("%cI’m happiest where inclusive engineering is the point, not the afterthought.", FG);
      console.log(`%cEmail    %c${EMAIL}`, MUTE, ACCENT);
      console.log(`%cRésumé   %c${resumeUrl}`, MUTE, ACCENT);
      console.log(`%cLinkedIn %c${LINKEDIN}`, MUTE, ACCENT);
      console.log(`%cGitHub   %c${GITHUB}`, MUTE, ACCENT);
      return `mailto:${EMAIL}`;
    };

    // Banner, printed once on load.
    console.log(
      "%c════════════════════════════════════\n CALLEY NYE TERMINAL v1.0\n════════════════════════════════════",
      "color:#ff3ea5;font-weight:700",
    );
    console.log("%c👋 Hello, curious developer.", "color:#f4ebf5;font-size:13px");
    console.log("%cType %chelp()%c to explore. Or %chire()%c if you already know what’s up.", MUTE, ACCENT, MUTE, ACCENT, MUTE);
  }, []);

  return null;
}
