// ─────────────────────────────────────────────────────────────
// Question Types
// ─────────────────────────────────────────────────────────────

export type QuestionType =
  | "gpa"
  | "attendance"
  | "teacher"
  | "courses"
  | "student"
  | "student_count"
  | "students_by_semester"
  | "course"
  | "teacher_info"
  | "notice"
  | "unknown";

// ─────────────────────────────────────────────────────────────
// Stopwords
// ─────────────────────────────────────────────────────────────

const STOPWORDS = new Set([
  "the",
  "a",
  "an",
  "my",
  "his",
  "her",
  "their",
  "our",
  "your",

  "this",
  "that",
  "these",
  "those",

  "student",
  "students",

  "gpa",
  "attendance",

  "course",
  "courses",
  "subject",
  "subjects",
  "class",
  "classes",

  "grade",
  "grades",
  "mark",
  "marks",

  "email",
  "roll",
  "number",
  "semester",

  "result",
  "results",

  "who",
  "what",
  "which",
  "when",
  "where",
  "why",
  "how",

  "tell",
  "show",
  "give",
  "get",
  "fetch",
  "find",
  "retrieve",
  "list",
  "display",

  "does",
  "is",
  "has",
  "did",
  "do",
  "are",
  "was",
  "were",

  "teaches",
  "teach",

  "take",
  "takes",
  "study",
  "studies",
  "enrolled",
  "registered",
  "taking",
  "studying",

  "me",
  "about",
  "of",
  "for",
  "to",
  "in",
  "on",
  "at",
  "by",

  "details",
  "information",
  "profile",

  "teacher",
  "professor",
  "faculty",
  "instructor",
]);

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

const clean = (value: string): string => {
  return value
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[?!.,;:]+$/g, "")
    .trim();
};

const isPlausibleName = (name: string): boolean => {
  const value = clean(name);

  if (value.length < 2) {
    return false;
  }

  // Names cannot contain numbers
  if (/\d/.test(value)) {
    return false;
  }

  // Must start with a letter
  if (!/^[A-Za-z]/.test(value)) {
    return false;
  }

  // Maximum 5 words
  if (value.split(" ").length > 5) {
    return false;
  }

  const lower = value.toLowerCase();

  // Entire value is a stopword
  if (STOPWORDS.has(lower)) {
    return false;
  }

  // Every word is a stopword
  if (
    lower
      .split(" ")
      .every((word) => STOPWORDS.has(word))
  ) {
    return false;
  }

  return true;
};

// ─────────────────────────────────────────────────────────────
// extractStudentName
// ─────────────────────────────────────────────────────────────

export const extractStudentName = (
  question: string
): string | null => {
  if (!question?.trim()) {
    return null;
  }

  const text = clean(question);

  let match: RegExpMatchArray | null;

  // ─────────────────────────────────────────────
  // What is Ajay's GPA?
  // How is Ajay's attendance?
  // ─────────────────────────────────────────────

  match = text.match(
    /(?:what\s+is|what's|how\s+is|how's)\s+([A-Za-z][A-Za-z\s.'-]{0,60}?)'s\s+(?:gpa|attendance|courses?|subjects?|classes?|email|roll\s+number|semester|grades?|marks?|results?|enrollment|details?|information|profile)\b/i
  );

  if (match?.[1]) {
    const candidate = clean(match[1]);

    if (isPlausibleName(candidate)) {
      return candidate;
    }
  }

  // ─────────────────────────────────────────────
  // Who teaches Ajay's courses?
  // ─────────────────────────────────────────────

  match = text.match(
    /who\s+teaches\s+([A-Za-z][A-Za-z\s.'-]{0,60}?)'s\s+(?:courses?|subjects?|classes?)\b/i
  );

  if (match?.[1]) {
    const candidate = clean(match[1]);

    if (isPlausibleName(candidate)) {
      return candidate;
    }
  }

  // ─────────────────────────────────────────────
  // Tell me about Ajay's GPA
  // ─────────────────────────────────────────────

  match = text.match(
    /tell\s+me\s+(?:about\s+)?([A-Za-z][A-Za-z\s.'-]{0,60}?)'s\s+(?:gpa|attendance|courses?|subjects?|classes?|email|roll\s+number|semester|grades?|marks?|results?|enrollment|details?|information|profile)\b/i
  );

  if (match?.[1]) {
    const candidate = clean(match[1]);

    if (isPlausibleName(candidate)) {
      return candidate;
    }
  }

  // ─────────────────────────────────────────────
  // Give me Ajay's GPA
  // Show me Ajay's attendance
  // ─────────────────────────────────────────────

  match = text.match(
    /(?:give\s+me|get|fetch|find|retrieve|show\s+me)\s+([A-Za-z][A-Za-z\s.'-]{0,60}?)'s\s+(?:gpa|attendance|courses?|subjects?|classes?|email|roll\s+number|semester|grades?|marks?|results?|enrollment|details?|information|profile)\b/i
  );

  if (match?.[1]) {
    const candidate = clean(match[1]);

    if (isPlausibleName(candidate)) {
      return candidate;
    }
  }

  // ─────────────────────────────────────────────
  // Ajay's GPA
  // Ajay's attendance
  // ─────────────────────────────────────────────

  match = text.match(
    /^([A-Za-z][A-Za-z\s.'-]{0,60}?)'s\s+(?:gpa|attendance|courses?|subjects?|classes?|email|roll\s+number|semester|grades?|marks?|results?|enrollment|details?|information|profile)\b/i
  );

  if (match?.[1]) {
    const candidate = clean(match[1]);

    if (isPlausibleName(candidate)) {
      return candidate;
    }
  }

  // ─────────────────────────────────────────────
  // What courses does Ajay take?
  // Which subjects does Ajay study?
  // ─────────────────────────────────────────────

  match = text.match(
    /(?:what|which)\s+(?:courses?|subjects?|classes?)\s+(?:does|is|did)\s+([A-Za-z][A-Za-z\s.'-]{0,60}?)\s+(?:take|study|have|enrolled\s+in|taking|studying|registered\s+for)\b/i
  );

  if (match?.[1]) {
    const candidate = clean(match[1]);

    if (isPlausibleName(candidate)) {
      return candidate;
    }
  }

  // ─────────────────────────────────────────────
  // Does Ajay take courses?
  // Is Ajay enrolled?
  // ─────────────────────────────────────────────

  match = text.match(
    /(?:does|is|has|did|do|are|was|were)\s+([A-Za-z][A-Za-z\s.'-]{0,60}?)\s+(?:take|study|have|enrolled|taking|studying|registered)\b/i
  );

  if (match?.[1]) {
    const candidate = clean(match[1]);

    if (isPlausibleName(candidate)) {
      return candidate;
    }
  }

  // ─────────────────────────────────────────────
  // Show Ajay GPA
  // Show me Ajay attendance
  // ─────────────────────────────────────────────

  match = text.match(
    /show\s+(?:me\s+)?([A-Za-z][A-Za-z\s.'-]{0,60}?)\s+(?:gpa|attendance|courses?|subjects?|classes?|email|roll\s+number|semester|grades?|marks?|results?|enrollment|details?|information|profile)\b/i
  );

  if (match?.[1]) {
    const candidate = clean(match[1]);

    if (isPlausibleName(candidate)) {
      return candidate;
    }
  }

  // ─────────────────────────────────────────────
  // Give me Ajay GPA
  // Get Ajay attendance
  // ─────────────────────────────────────────────

  match = text.match(
    /(?:give\s+me|get|fetch|find|retrieve)\s+([A-Za-z][A-Za-z\s.'-]{0,60}?)\s+(?:gpa|attendance|courses?|subjects?|classes?|email|roll\s+number|semester|grades?|marks?|results?|enrollment|details?|information|profile)\b/i
  );

  if (match?.[1]) {
    const candidate = clean(match[1]);

    if (isPlausibleName(candidate)) {
      return candidate;
    }
  }

  // ─────────────────────────────────────────────
  // What is the GPA of Ajay?
  // What is the attendance of Ajay?
  // ─────────────────────────────────────────────

  match = text.match(
    /(?:what\s+is|what's|how\s+is)\s+(?:the\s+)?(?:gpa|attendance|courses?|subjects?|classes?|email|roll\s+number|semester|grades?|marks?|results?|enrollment|details?|information|profile)\s+of\s+([A-Za-z][A-Za-z\s.'-]{1,60})(?:\?|$|\.)/i
  );

  if (match?.[1]) {
    const candidate = clean(match[1]);

    if (isPlausibleName(candidate)) {
      return candidate;
    }
  }

  // ─────────────────────────────────────────────
  // GPA of Ajay
  // Attendance of Ajay
  // ─────────────────────────────────────────────

  match = text.match(
    /(?:gpa|attendance|courses?|subjects?|classes?|email|roll\s+number|semester|grades?|marks?|results?|enrollment|details?|information|profile)\s+of\s+([A-Za-z][A-Za-z\s.'-]{1,60})(?:\?|$|\.)/i
  );

  if (match?.[1]) {
    const candidate = clean(match[1]);

    if (isPlausibleName(candidate)) {
      return candidate;
    }
  }

  // ─────────────────────────────────────────────
  // Ajay GPA
  // Ajay attendance
  // ─────────────────────────────────────────────

  match = text.match(
    /^([A-Za-z][A-Za-z\s.'-]{0,60}?)\s+(?:gpa|attendance|courses?|subjects?|classes?|email|roll\s+number|semester|grades?|marks?|results?|enrollment|details?|information|profile)(?:\?|$|\.)/i
  );

  if (match?.[1]) {
    const candidate = clean(match[1]);

    if (isPlausibleName(candidate)) {
      return candidate;
    }
  }

  // ─────────────────────────────────────────────
  // Tell me about Ajay
  // Information for Ajay
  // ─────────────────────────────────────────────

  match = text.match(
    /(?:for|about)\s+([A-Za-z][A-Za-z\s.'-]{1,60})(?:\?|$|\.)/i
  );

  if (match?.[1]) {
    const candidate = clean(match[1]);

    if (isPlausibleName(candidate)) {
      return candidate;
    }
  }

  return null;
};

// ─────────────────────────────────────────────────────────────
// extractStudentNameCandidates
// ─────────────────────────────────────────────────────────────

export const extractStudentNameCandidates = (
  question: string
): string[] => {
  const name = extractStudentName(question);

  if (!name) {
    return [];
  }

  return [name];
};

// ─────────────────────────────────────────────────────────────
// extractSemester
// ─────────────────────────────────────────────────────────────

export const extractSemester = (
  question: string
): number | null => {
  if (!question?.trim()) {
    return null;
  }

  // Matches:
  // semester 1
  // semester 2
  // semester 3
  // semester    4

  const match = question
    .toLowerCase()
    .match(/\bsemester\s*(\d+)\b/);

  if (!match) {
    return null;
  }

  const semester = Number(match[1]);

  if (!Number.isInteger(semester)) {
    return null;
  }

  if (semester <= 0) {
    return null;
  }

  return semester;
};

// ─────────────────────────────────────────────────────────────
// detectQuestionType
// ─────────────────────────────────────────────────────────────

export const detectQuestionType = (
  question: string
): QuestionType => {
  if (!question?.trim()) {
    return "unknown";
  }

  const text = question.toLowerCase().trim();

  // ─────────────────────────────────────────────
  // Student Count
  // ─────────────────────────────────────────────

  if (
    /\bhow\s+many\s+students?\b/i.test(text)
  ) {
    return "student_count";
  }

  // ─────────────────────────────────────────────
  // Students By Semester
  // ─────────────────────────────────────────────

  if (
    (
      /\b(show|list|display|get|give)\b/i.test(text) &&
      /\bstudents?\b/i.test(text) &&
      /\bsemester\s*\d+\b/i.test(text)
    ) ||
    (
      /\bwho\s+are\s+the\s+students?\b/i.test(text) &&
      /\bsemester\s*\d+\b/i.test(text)
    )
  ) {
    return "students_by_semester";
  }

  // ─────────────────────────────────────────────
  // GPA
  // ─────────────────────────────────────────────

  if (
    /\bgpa\b|\bgrade\s+point\b/i.test(text)
  ) {
    return "gpa";
  }

  // ─────────────────────────────────────────────
  // Attendance
  // ─────────────────────────────────────────────

  if (
    /\battendance\b|\battend\b/i.test(text)
  ) {
    return "attendance";
  }

  // ─────────────────────────────────────────────
  // Teacher
  // ─────────────────────────────────────────────

  if (
    /\bteacher\b|\bprofessor\b|\bfaculty\b|\binstructor\b|\bwho\s+teaches\b/i.test(
      text
    )
  ) {
    return "teacher";
  }

  // ─────────────────────────────────────────────
  // Courses
  // ─────────────────────────────────────────────

  if (
    /\bcourses?\b|\bsubjects?\b|\bclasses?\b|\bcurriculum\b|\bsyllabus\b|\benrolled\s+courses?\b/i.test(
      text
    )
  ) {
    return "courses";
  }

  // ─────────────────────────────────────────────
  // Student Information
  // ─────────────────────────────────────────────

  if (
    /\bstudent\b|\bemail\b|\broll\s+number\b|\bsemester\b|\bdetails?\b|\binformation\b|\babout\b|\bprofile\b|\benrollment\b/i.test(
      text
    )
  ) {
    return "student";
  }

    // Notice
  if (
    /\bnotice\b|\bnotices\b|\bannouncement\b|\bannouncements\b/i.test(
      text,
    )
  ) {
    return "notice";
  }

  

  return "unknown";
};

// ─────────────────────────────────────────────────────────────
// Parsed Question
// ─────────────────────────────────────────────────────────────

export interface ParsedQuestion {
  type: QuestionType;
  studentName?: string;
  semester?: number;
}

// ─────────────────────────────────────────────────────────────
// parseQuestion
// ─────────────────────────────────────────────────────────────

export const parseQuestion = (
  question: string
): ParsedQuestion => {
  if (!question?.trim()) {
    return {
      type: "unknown",
    };
  }

  const type = detectQuestionType(question);

  const studentName = extractStudentName(question);

  const semester = extractSemester(question);

  return {
    type,

    ...(studentName
      ? {
          studentName,
        }
      : {}),

    ...(semester !== null
      ? {
          semester,
        }
      : {}),
  };
};