// ─────────────────────────────────────────────────────────────
// detectQuestionType
// ─────────────────────────────────────────────────────────────
export const detectQuestionType = (question: string): string => {
  if (!question) return "unknown";
  const text = question.toLowerCase();

  // Order matters: most specific → least specific
  if (/\bgpa\b|\bgrade\s*point\b/i.test(text)) return "gpa";

  if (/\battend(?:ance)?\b/i.test(text)) return "attendance";

  if (
    /\bteacher\b|\bprofessor\b|\bfaculty\b|\binstructor\b|\bwho\s+teaches\b/i.test(
      text
    )
  ) {
    return "teacher";
  }

  if (
    /\bcourses?\b|\bsubjects?\b|\bclasses?\b|\bcurriculum\b|\bsyllabus\b|\benrolled\s+courses?\b/i.test(
      text
    )
  ) {
    return "courses";
  }

  if (
    /\bstudent\b|\bemail\b|\broll\s*number\b|\bsemester\b|\bdetails?\b|\binformation\b|\babout\b|\bprofile\b|\benrollment\b/i.test(
      text
    )
  ) {
    return "student";
  }

  return "unknown";
};

// ─────────────────────────────────────────────────────────────
// Stopwords / false-positive tokens that must never be a name
// ─────────────────────────────────────────────────────────────
const STOPWORDS = new Set([
  "the", "a", "an", "my", "his", "her", "their", "our", "your",
  "this", "that", "these", "those", "student", "students",
  "gpa", "attendance", "course", "courses", "subject", "subjects",
  "class", "classes", "grade", "grades", "mark", "marks",
  "email", "roll", "number", "semester", "result", "results",
  "who", "what", "which", "when", "where", "why", "how",
  "tell", "show", "give", "get", "fetch", "find", "retrieve",
  "does", "is", "has", "did", "do", "are", "was", "were",
  "teaches", "teach", "take", "takes", "study", "studies",
  "enrolled", "registered", "taking", "studying",
  "me", "about", "of", "for", "to", "in", "on", "at", "by",
  "details", "information", "profile", "teacher", "professor",
  "faculty", "instructor",
]);

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

/** Collapse whitespace and strip dangling punctuation. */
const clean = (s: string): string =>
  s.trim().replace(/\s+/g, " ").replace(/[?!.,;:]+$/g, "").trim();

/** Reject obvious non-names (single letters, stopwords, digits, etc.). */
const isPlausibleName = (name: string): boolean => {
  const n = clean(name);
  if (n.length < 2) return false;
  if (/\d/.test(n)) return false;                       // no digits
  if (!/^[A-Za-z]/.test(n)) return false;               // must start with a letter
  if (n.split(" ").length > 5) return false;            // too many words
  const lower = n.toLowerCase();
  if (STOPWORDS.has(lower)) return false;
  if (lower.split(" ").every((w) => STOPWORDS.has(w))) return false;
  return true;
};

// ─────────────────────────────────────────────────────────────
// Vocabulary fragments (single source of truth)
// ─────────────────────────────────────────────────────────────
const FIELD =
  String.raw`(?:gpa|attendance|courses?|subjects?|classes?|email|roll\s*number|semester|grades?|marks?|results?|enrollment|enrolled\s+courses?|details?|information|profile)`;

const NAME = String.raw`([A-Za-z][A-Za-z\s.'-]{0,60}?)`;
const NAME_FULL = String.raw`([A-Za-z][A-Za-z\s.'-]{1,60})`;

// ─────────────────────────────────────────────────────────────
// Pattern bank (ordered: most specific → most generic)
// ─────────────────────────────────────────────────────────────
const PATTERNS: RegExp[] = [
  // ── Possessive forms ──
  new RegExp(String.raw`(?:what\s+is|what's|how\s+is|how's)\s+${NAME}'s\s+${FIELD}`, "i"),
  new RegExp(String.raw`who\s+teaches\s+${NAME}'s\s+(?:courses?|subjects?|classes?)`, "i"),
  new RegExp(String.raw`tell\s+me\s+(?:about\s+)?${NAME}'s\s+${FIELD}`, "i"),
  new RegExp(String.raw`(?:give\s+me|get|fetch|find|retrieve|show\s+me)\s+${NAME}'s\s+${FIELD}`, "i"),
  new RegExp(String.raw`^${NAME}'s\s+${FIELD}`, "i"),

  // ── Verb-based (does/is/did/has) ──
  new RegExp(
    String.raw`(?:what|which)\s+(?:courses?|subjects?|classes?)\s+(?:does|is|did)\s+${NAME}\s+(?:take|study|have|enrolled\s+in|taking|studying|register(?:ed)?\s+for)`,
    "i"
  ),
  new RegExp(
    String.raw`(?:does|is|has|did|do|are|was|were)\s+${NAME}\s+(?:take|study|have|enrolled|taking|studying|registered)`,
    "i"
  ),

  // ── Imperative ──
  new RegExp(String.raw`show\s+(?:me\s+)?${NAME}\s+${FIELD}`, "i"),
  new RegExp(String.raw`(?:give\s+me|get|fetch|find|retrieve)\s+${NAME}\s+${FIELD}`, "i"),

  // ── "X of NAME" ──
  new RegExp(String.raw`(?:what\s+is|what's|how\s+is)\s+(?:the\s+)?${FIELD}\s+of\s+${NAME_FULL}(?:\?|$|\.)`, "i"),
  new RegExp(String.raw`${FIELD}\s+of\s+${NAME_FULL}(?:\?|$|\.)`, "i"),

  // ── No-apostrophe possessive ──
  new RegExp(String.raw`^${NAME}\s+${FIELD}(?:\?|$|\.)`, "i"),

  // ── "for / about NAME" fallback ──
  new RegExp(String.raw`(?:for|about)\s+${NAME_FULL}(?:\?|$|\.)`, "i"),
];

// ─────────────────────────────────────────────────────────────
// extractStudentName
// ─────────────────────────────────────────────────────────────
export const extractStudentName = (question: string): string | null => {
  if (!question) return null;
  const text = clean(question);

  for (const pattern of PATTERNS) {
    const match = text.match(pattern);
    const raw = match?.[1];
    if (!raw) continue;

    // Strip trailing possessive if the pattern didn't already
    const candidate = clean(raw).replace(/'s$/i, "").trim();
    if (isPlausibleName(candidate)) return candidate;
  }

  return null;
};

// ─────────────────────────────────────────────────────────────
// Optional: multi-candidate extractor (debug / ranking)
// ─────────────────────────────────────────────────────────────
export const extractStudentNameCandidates = (question: string): string[] => {
  if (!question) return [];
  const text = clean(question);
  const out = new Set<string>();

  for (const pattern of PATTERNS) {
    const match = text.match(pattern);
    const raw = match?.[1];
    if (!raw) continue;
    const candidate = clean(raw).replace(/'s$/i, "").trim();
    if (isPlausibleName(candidate)) out.add(candidate);
  }

  return [...out];
};