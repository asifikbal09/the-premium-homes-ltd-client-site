// Predefined Form Templates for TPHL Forms

export const BANGLADESH_UNIVERSITIES: string[] = [
  "Ahsanullah University of Science and Technology",
  "American International University-Bangladesh",
  "Army Institute of Business Administration",
  "Bangladesh Agricultural University",
  "Bangladesh Army University of Science and Technology",
  "Bangladesh University of Business and Technology",
  "Bangladesh University of Engineering and Technology",
  "Bangladesh University of Professionals",
  "Bangladesh University of Textiles",
  "BRAC University",
  "Canadian University of Bangladesh",
  "Chittagong University of Engineering and Technology",
  "Daffodil International University",
  "East West University",
  "Eastern University",
  "European University of Bangladesh",
  "Green University of Bangladesh",
  "Hajee Mohammad Danesh Science and Technology University",
  "Independent University, Bangladesh",
  "Institute of Business Administration, Jahangirnagar University",
  "Institute of Business Administration, University of Dhaka",
  "International Islamic University Chittagong",
  "International University of Business Agriculture and Technology",
  "Islamic University",
  "Islamic University of Technology",
  "Jahangirnagar University",
  "Jashore University of Science and Technology",
  "Khulna University",
  "Khulna University of Engineering and Technology",
  "Mawlana Bhashani Science and Technology University",
  "Noakhali Science and Technology University",
  "North South University",
  "Northern University Bangladesh",
  "Patuakhali Science and Technology University",
  "Premier University",
  "Prime University",
  "Primeasia University",
  "Rajshahi University of Engineering and Technology",
  "Shahjalal University of Science and Technology",
  "Sher-e-Bangla Agricultural University",
  "Southeast University",
  "Stamford University Bangladesh",
  "State University of Bangladesh",
  "United International University",
  "University of Asia Pacific",
  "University of Chittagong",
  "University of Development Alternative",
  "University of Dhaka",
  "University of Information Technology and Sciences",
  "University of Liberal Arts Bangladesh",
  "University of Rajshahi",
  "University of Science and Technology Chittagong",
];

export interface FormFieldItem {
  id: string;
  type: string;
  label: string;
  subtitle?: string;
  required: boolean;
  options: string[];
  hasOtherOption?: boolean;
  isFixed?: boolean;
  fileTypes?: string;
  maxFileSizeMb?: number;
}

export const RECRUITMENT_FORM_FIELDS: FormFieldItem[] = [
  {
    id: "rec_name",
    type: "text",
    label: "Name",
    subtitle: "Full Name",
    required: true,
    options: [],
    isFixed: true,
  },
  {
    id: "rec_phone",
    type: "phone",
    label: "Phone",
    subtitle: "Your Phone Number",
    required: true,
    options: [],
    isFixed: true,
  },
  {
    id: "rec_email",
    type: "email",
    label: "Email",
    subtitle: "Your Email Address",
    required: true,
    options: [],
    isFixed: true,
  },
  {
    id: "rec_degree",
    type: "text",
    label: "Highest Educational Degree",
    subtitle: "",
    required: true,
    options: [],
    isFixed: true,
  },
  {
    id: "rec_university",
    type: "checkbox",
    label: "University",
    subtitle: "Please select one from the options",
    required: true,
    options: BANGLADESH_UNIVERSITIES,
    hasOtherOption: true,
    isFixed: true,
  },
  {
    id: "rec_passing_year",
    type: "text",
    label: "Passing Year",
    subtitle: "",
    required: true,
    options: [],
    isFixed: true,
  },
  {
    id: "rec_major",
    type: "text",
    label: "Major",
    subtitle: "",
    required: true,
    options: [],
    isFixed: true,
  },
  {
    id: "rec_cgpa",
    type: "text",
    label: "CGPA",
    subtitle: "(Scale: 4.00)",
    required: true,
    options: [],
    isFixed: true,
  },
  {
    id: "rec_eca",
    type: "checkbox",
    label: "Extracurricular Activities (ECAs)",
    subtitle: "",
    required: true,
    options: [
      "Debate",
      "Case Competition",
      "Business / Finance Club",
      "Research / Academic Society",
      "Model United Nations (MUN)",
      "Entrepreneurship Club",
      "Technology / Programming Club",
      "Science / Engineering Club",
      "Olympiad / Quiz",
      "Career / Professional Development Club",
      "Public Speaking",
      "Volunteering / Social Work",
      "Cultural / Performing Arts",
      "Media / Photography / Publications",
      "Sports",
      "Student Leadership / Executive Committee",
      "Event Management",
    ],
    hasOtherOption: true,
    isFixed: true,
  },
  {
    id: "rec_achievements",
    type: "textarea",
    label: "Achievement(s)",
    subtitle: "Please share 3/4 achievements that defines you",
    required: false,
    options: [],
    hasOtherOption: false,
    isFixed: true,
  },
  {
    id: "rec_experience",
    type: "radio",
    label: "Years of Job Experience",
    subtitle: "",
    required: true,
    options: ["Fresher", "0 - 1 Years", "1 - 2 Years", "2 - 3 Years"],
    hasOtherOption: false,
    isFixed: true,
  },
  {
    id: "rec_last_role",
    type: "text",
    label: "Last Job Role",
    subtitle: "",
    required: false,
    options: [],
    hasOtherOption: false,
    isFixed: true,
  },
  {
    id: "rec_functions",
    type: "checkbox",
    label: "Which function(s) are you interested in?",
    subtitle: "",
    required: true,
    options: [
      "Finance",
      "Marketing",
      "BI/Business Analysis",
      "Sales",
      "Engineering",
      "Investor Relations/International Affairs",
      "Procurement & Supply Chain",
      "Operations",
      "Quality Control",
      "Client Experience",
    ],
    hasOtherOption: true,
    isFixed: true,
  },
  {
    id: "rec_why_join",
    type: "textarea",
    label:
      "Why do you want to join TPHL, and which of your values align with the qualities TPHL looks for in its emerging leaders?",
    subtitle:
      "Why do you want to join TPHL, and which of your values align with the qualities TPHL looks for in its emerging leaders?",
    required: true,
    options: [],
    hasOtherOption: false,
    isFixed: true,
  },
  {
    id: "rec_contribute",
    type: "textarea",
    label: "How do you plan to contribute to TPHL in your chosen function(s)?",
    subtitle:
      "Describe the skills and knowledge you will bring, and area(s) where you believe you can make a measurable impact in your first year. (Maximum 200 words)",
    required: true,
    options: [],
    hasOtherOption: false,
    isFixed: true,
  },
  {
    id: "rec_situation",
    type: "textarea",
    label:
      "Describe a situation where you took the initiative to solve a problem or achieve a goal. What did you do, and what was the result?",
    subtitle:
      "Academic, professional, extracurricular or personal examples are all welcome. (Maximum 300 words)",
    required: true,
    options: [],
    hasOtherOption: false,
    isFixed: true,
  },
  {
    id: "rec_resume",
    type: "file",
    label: "Submit your Resume",
    subtitle: "Upload 1 supported file: PDF. Max 10 MB.",
    required: true,
    options: [],
    hasOtherOption: false,
    fileTypes: "pdf,doc,docx,jpg,jpeg,png",
    maxFileSizeMb: 10,
    isFixed: true,
  },
];

export const FORM_TEMPLATES = [
  {
    id: "custom",
    name: "Blank / Custom Form",
    description: "Start with an empty form and add custom fields manually.",
    badge: "Flexible",
    defaultCampaignName: "",
    defaultDescription: "",
    fields: [] as FormFieldItem[],
  },
  {
    id: "recruitment",
    name: "Recruitment Form",
    description:
      "Pre-built job application form with 17 fixed recruitment fields (Education, Experience, Screening Questions & Resume).",
    badge: "17 Fixed Fields",
    defaultCampaignName: "TPHL Recruitment | Job Application",
    defaultDescription:
      "<p>Thank you for your interest in joining The Premium Homes Ltd. Please fill in all the required details below to submit your application.</p><p><strong>Instructions:</strong> Ensure your contact details and attached resume (PDF) are up to date.</p>",
    fields: RECRUITMENT_FORM_FIELDS,
  },
];

export const isRecruitmentForm = (form: any): boolean => {
  if (!form) return false;
  const name = (form.campaign_name || form.title || "").toLowerCase();
  if (
    name.includes("recruitment") ||
    name.includes("career") ||
    name.includes("ascend") ||
    name.includes("job")
  ) {
    return true;
  }
  const fields = form.fields_json || [];
  return Array.isArray(fields) && fields.some(
    (f: any) =>
      (f.id && String(f.id).startsWith("rec_")) ||
      (f.label && f.label.toLowerCase().includes("submit your resume")) ||
      (f.label && f.label.toLowerCase().includes("highest educational degree"))
  );
};

export const extractCandidateData = (item: any) => {
  if (!item) return null;
  const data = item.data_json || {};

  const findEntry = (...terms: string[]) => {
    const keys = Object.keys(data);
    for (const key of keys) {
      const lower = key.toLowerCase();
      for (const term of terms) {
        if (lower.includes(term.toLowerCase())) {
          return { key, val: data[key] };
        }
      }
    }
    return { key: "", val: "" };
  };

  const nameEntry = findEntry("name (q1)", "name");
  const phoneEntry = findEntry("phone");
  const emailEntry = findEntry("email");
  const degreeEntry = findEntry("highest educational degree", "educational degree", "degree");
  const universityEntry = findEntry("university");
  const passingYearEntry = findEntry("passing year", "passing");
  const majorEntry = findEntry("major");
  const cgpaEntry = findEntry("cgpa");
  const ecaEntry = findEntry("extracurricular", "eca");
  const achievementsEntry = findEntry("achievement");
  const experienceEntry = findEntry("years of job experience", "experience");
  const lastRoleEntry = findEntry("last job role", "last role");
  const functionsEntry = findEntry("which function", "function", "interested in");
  const whyJoinEntry = findEntry("why do you want to join", "values align");
  const contributeEntry = findEntry("how do you plan to contribute", "contribute to tphl");
  const situationEntry = findEntry("describe a situation", "took the initiative");
  const resumeEntry = findEntry("submit your resume", "resume", "cv", "file");

  const safeStr = (val: any, fallback = "N/A"): string => {
    if (val === null || val === undefined) return fallback;
    if (typeof val === "string") return val.trim() || fallback;
    if (typeof val === "number" || typeof val === "boolean") return String(val);
    if (Array.isArray(val)) {
      return (
        val
          .map((v) =>
            typeof v === "object" && v !== null
              ? v.label || v.name || v.value || JSON.stringify(v)
              : String(v)
          )
          .filter(Boolean)
          .join(", ") || fallback
      );
    }
    if (typeof val === "object" && val !== null) {
      return val.label || val.name || val.value || fallback;
    }
    return String(val) || fallback;
  };

  const formatList = (val: any): string[] => {
    if (Array.isArray(val)) {
      return val
        .map((v) =>
          typeof v === "object" && v !== null
            ? v.label || v.name || v.value || JSON.stringify(v)
            : String(v)
        )
        .filter(Boolean);
    }
    if (typeof val === "string" && val.trim()) return [val.trim()];
    if (typeof val === "object" && val !== null) {
      const s = val.label || val.name || val.value;
      return s ? [s] : [];
    }
    return [];
  };

  return {
    id: item.id,
    created_at: item.created_at,
    is_exported: item.is_exported,
    name: safeStr(nameEntry.val, "N/A"),
    phone: safeStr(phoneEntry.val, "N/A"),
    email: safeStr(emailEntry.val, "N/A"),
    degree: safeStr(degreeEntry.val, "N/A"),
    university: safeStr(universityEntry.val, "N/A"),
    passingYear: safeStr(passingYearEntry.val, "N/A"),
    major: safeStr(majorEntry.val, "N/A"),
    cgpa: safeStr(cgpaEntry.val, "N/A"),
    ecas: formatList(ecaEntry.val),
    achievements: safeStr(achievementsEntry.val, ""),
    experience: safeStr(experienceEntry.val, "Fresher"),
    lastRole: safeStr(lastRoleEntry.val, "N/A"),
    functions: formatList(functionsEntry.val),
    whyJoin: safeStr(whyJoinEntry.val, ""),
    contribute: safeStr(contributeEntry.val, ""),
    situation: safeStr(situationEntry.val, ""),
    resume: resumeEntry.val || null,
    resumeKey: resumeEntry.key || "Submit your Resume",
    rawData: data,
    rawItem: item,
  };
};

