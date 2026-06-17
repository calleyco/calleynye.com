/**
 * Live Region Lab — adversarial fixture.
 *
 * This is the canned "LLM response" the simulator streams. It is built to
 * BREAK naive announcement strategies. The brief requires, at minimum:
 *   - multi-sentence prose
 *   - a fenced code block (how do you announce code streaming in?)
 *   - a markdown list
 *   - an em-dash
 *   - at least one mid-word token split
 *
 * Tokens are hand-curated so the operator can see exactly which boundary
 * each token represents — including the deliberate sub-word splits. Edit
 * this array (and only this array) to add new adversarial cases.
 */

export type FixtureToken = {
  /** Raw token text, exactly as the simulator will emit it. */
  text: string;
  /** Optional label shown in the timeline (e.g. "mid-word", "code"). */
  label?: string;
};

export const FIXTURE_TOKENS: ReadonlyArray<FixtureToken> = [
  // — Opening prose with mid-word splits and an em-dash —
  { text: "Streaming" },
  { text: " text" },
  { text: " is" },
  { text: " easy" },
  { text: " for" },
  { text: " the" },
  { text: " eye" },
  { text: "," },
  { text: " hard" },
  { text: " for" },
  { text: " the" },
  { text: " ear" },
  { text: "." },
  { text: " A" },
  { text: " sentence" },
  { text: " takes" },
  { text: " seconds" },
  { text: " to" },
  { text: " say" },
  { text: " \u2014", label: "em-dash" },
  { text: " and" },
  { text: " in" },
  { text: " those" },
  { text: " seconds" },
  { text: "," },
  { text: " more" },
  { text: " tokens" },
  { text: " arrive" },
  { text: "." },

  // — Mid-word split: "accessibility" emitted as four pieces —
  { text: " Accessi", label: "mid-word" },
  { text: "bil", label: "mid-word" },
  { text: "ity" },
  { text: " is" },
  { text: " the" },
  { text: " test" },
  { text: " case" },
  { text: " that" },
  { text: " makes" },
  { text: " the" },
  { text: " hard" },
  { text: "ness" },
  { text: " visible" },
  { text: "." },

  // — Markdown list — three items, each split into multiple tokens —
  { text: "\n\nThree" },
  { text: " failure" },
  { text: " modes" },
  { text: " appear" },
  { text: " immediately" },
  { text: ":" },
  { text: "\n\n- " },
  { text: "Tokens" },
  { text: " arrive" },
  { text: " faster" },
  { text: " than" },
  { text: " speech" },
  { text: "." },
  { text: "\n- " },
  { text: "Mid" },
  { text: "-word" },
  { text: " splits" },
  { text: " confuse" },
  { text: " phon", label: "mid-word" },
  { text: "etic" },
  { text: " parsers" },
  { text: "." },
  { text: "\n- " },
  { text: "Code" },
  { text: " symbols" },
  { text: " get" },
  { text: " spoken" },
  { text: " individually" },
  { text: "." },

  // — Fenced code block — emitted symbol-by-symbol on purpose —
  { text: "\n\n```", label: "code-fence" },
  { text: "ts" },
  { text: "\n" },
  { text: "function" },
  { text: " announce" },
  { text: "(" },
  { text: "text" },
  { text: ":" },
  { text: " string" },
  { text: ")" },
  { text: ":" },
  { text: " void" },
  { text: " {" },
  { text: "\n  " },
  { text: "region" },
  { text: "." },
  { text: "textContent" },
  { text: " =" },
  { text: " text" },
  { text: ";" },
  { text: "\n" },
  { text: "}" },
  { text: "\n```", label: "code-fence" },

  // — Closing prose, a short sentence to test "flush at end of stream" —
  { text: "\n\nThat" },
  { text: "'s" },
  { text: " the" },
  { text: " territory" },
  { text: " the" },
  { text: " lab" },
  { text: " is" },
  { text: " mapping" },
  { text: "." },
];

/** Plain-text reconstruction of the fixture (useful for fixture-view + diffing). */
export const FIXTURE_TEXT: string = FIXTURE_TOKENS.map((t) => t.text).join("");
