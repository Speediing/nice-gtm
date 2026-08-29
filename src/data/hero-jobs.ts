export type HeroJob = {
  id:
    | "sales-outbound"
    | "account-research"
    | "call-follow-up"
    | "deal-desk"
    | "pipeline-health"
    | "renewal-planning"
    | "competitive-intel"
    | "sales-chief-of-staff";
  label: string;
  workLabel: string;
  meta: readonly [
    { label: string; value: string },
    { label: string; value: string },
  ];
  body: string;
  result: string;
  userMessage: string;
  botMessage: string;
};

export const HERO_JOBS = [
  {
    id: "sales-outbound",
    label: "Sales Outbound",
    workLabel: "Draft set ready",
    meta: [
      { label: "Account", value: "Sample account" },
      { label: "Source", value: "Public company material" },
    ],
    body: "I drafted a short email and LinkedIn note from the public source. The account fit and contact still need seller review.",
    result: "Outreach drafts parked",
    userMessage: "keep these in draft while I check the account",
    botMessage: "drafts parked. nothing sent.",
  },
  {
    id: "account-research",
    label: "Account Research",
    workLabel: "Research brief ready",
    meta: [
      { label: "Account", value: "Sample account" },
      { label: "Checked", value: "Public source links" },
    ],
    body: "I put the public facts, source links, and open questions in one brief. I left out any claim I could not source.",
    result: "Research brief ready",
    userMessage: "save the brief and flag the open questions",
    botMessage: "brief saved. open questions stay visible.",
  },
  {
    id: "call-follow-up",
    label: "Call Follow-up",
    workLabel: "Follow-up pack ready",
    meta: [
      { label: "Input", value: "Meeting notes" },
      { label: "Review", value: "Seller approval required" },
    ],
    body: "The draft keeps decisions, open questions, owners, and next steps in separate sections. Customer wording still needs seller review.",
    result: "Slides and email in draft",
    userMessage: "keep the email parked until I review the notes",
    botMessage: "email parked. nothing sent.",
  },
  {
    id: "deal-desk",
    label: "Deal Desk",
    workLabel: "Answer pack ready",
    meta: [
      { label: "Input", value: "Customer question" },
      { label: "Checked", value: "Approved NiCE material" },
    ],
    body: "I matched answerable parts to approved material. Commercial and policy choices remain with the account team.",
    result: "Sourced reply in draft",
    userMessage: "route the open items to the account team",
    botMessage: "open items marked. nothing sent.",
  },
  {
    id: "pipeline-health",
    label: "Pipeline Health",
    workLabel: "Pipeline review ready",
    meta: [
      { label: "Input", value: "CRM records" },
      { label: "Review", value: "Missing next steps" },
    ],
    body: "I grouped records with no dated next step or owner. The seller decides which records need action.",
    result: "Review list ready",
    userMessage: "show me the records with no next step",
    botMessage: "review ready. no records changed.",
  },
  {
    id: "renewal-planning",
    label: "Renewal Planning",
    workLabel: "Renewal workspace ready",
    meta: [
      { label: "Input", value: "Account plan" },
      { label: "Review", value: "Open actions only" },
    ],
    body: "The workspace keeps existing dates and owners. Missing fields stay blank for the account team.",
    result: "Working plan ready",
    userMessage: "keep missing fields blank",
    botMessage: "workspace ready. no fields filled by guesswork.",
  },
  {
    id: "competitive-intel",
    label: "Competitive Intel",
    workLabel: "Public brief ready",
    meta: [
      { label: "Input", value: "Seller-selected company" },
      { label: "Checked", value: "Public sources" },
    ],
    body: "I summarized the source material beside the seller's question. I added no unsupported comparison.",
    result: "Source-linked brief ready",
    userMessage: "save this as a working brief",
    botMessage: "brief saved with its source links.",
  },
  {
    id: "sales-chief-of-staff",
    label: "Sales Chief of Staff",
    workLabel: "Daily plan ready",
    meta: [
      { label: "Input", value: "Seller task list" },
      { label: "Status", value: "Draft plan" },
    ],
    body: "I sorted the seller's open work by date. Every customer-facing action stays in draft.",
    result: "Priority list ready",
    userMessage: "start with the dated items",
    botMessage: "plan ready. customer actions stay in draft.",
  },
] as const satisfies readonly HeroJob[];
