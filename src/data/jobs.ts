import type { Artifact, GtmJob, SlideCard } from "./types";

export const FOLLOW_UP_SLIDES: SlideCard[] = [
  {
    n: 1,
    kicker: "Call ends",
    voice: "us",
    title: "Decisions",
    body: "List only the decisions confirmed in the meeting.",
  },
  {
    n: 2,
    kicker: "Before follow-up",
    voice: "us",
    title: "Open questions",
    body: "Keep every unanswered item visible with the source or owner it needs.",
  },
  {
    n: 3,
    kicker: "Next meeting",
    voice: "us",
    title: "Owners",
    body: "Name the person responsible for each action and the date it is due.",
  },
  {
    n: 4,
    kicker: "Seller review",
    voice: "us",
    title: "Ready to send",
    body: "The account team checks every line and chooses what leaves the room.",
  },
];

export const CUSTOMER_ANSWER_PACK: Extract<
  Artifact,
  { kind: "redlines" }
> = {
  kind: "redlines",
  title: "Customer answer pack",
  paperTitle: "Questions received",
  from: "Customer team · new email",
  marks: [
    {
      text: "How should our team plan the rollout?",
      note: "Draft from the current implementation guide. Confirm scope and timing with the services owner.",
      take: true,
    },
    {
      text: "Where does the security review begin?",
      note: "Link the approved security material and list the customer requirements that still need review.",
      take: true,
    },
    {
      text: "Which commercial terms apply?",
      note: "Leave pricing and contract choices with the account team.",
      take: false,
    },
  ],
  reply: {
    to: "Customer team",
    subject: "Answers and next steps",
    body: "Thanks for the questions.\n\nI pulled the current product, security, and implementation material into one note. The account team still needs to confirm scope, timing, and commercial terms before this goes out.\n\nI will keep the open items with their owners and send the checked version after review.",
  },
};

export const SAMPLE_OUTBOUND: Extract<Artifact, { kind: "outbound" }> = {
  kind: "outbound",
  title: "Sample account brief",
  account: "Sample CX account",
  hypothesis: [
    {
      k: "Why NiCE",
      body: "Match the public signal to the relevant CXone or Cognigy material. Keep only what the seller can support.",
    },
    {
      k: "Why now",
      body: "Use a dated public signal. If there is no current signal, do not draft outreach.",
    },
    {
      k: "Why this role",
      body: "Start with the role that owns the work. The seller confirms the person before anything sends.",
    },
  ],
  evidence: [
    {
      source: "Company filing · public",
      finding: "Pull the stated customer experience priority and keep the source link.",
    },
    {
      source: "Careers page · public",
      finding: "Look for current hiring that shows where the work sits.",
    },
    {
      source: "Company news · public",
      finding: "Use only dated announcements that connect to the account idea.",
    },
  ],
  targets: [
    {
      name: "CX leader",
      role: "Role to validate",
      why: "Likely owner of the customer experience program. Confirm before outreach.",
    },
    {
      name: "Technology leader",
      role: "Role to validate",
      why: "Likely owner of the platform path. Confirm before outreach.",
    },
  ],
  page: {
    headline: "A sourced point of view for Sample CX account",
    body: "The page keeps each public signal beside the suggested NiCE story. The seller checks both before sharing.",
  },
};

export const JOBS: GtmJob[] = [
  {
    id: "meeting-follow-up",
    number: 1,
    title: "Turn every customer call into the next move",
    trigger: "A customer call starts",
    backgroundAction: "Following the meeting and preparing follow-up",
    problem:
      "The useful details from a call often end up in separate notes, decks, and inbox threads. The seller has to rebuild the story after the meeting.",
    botJob:
      "Grok Bot follows the meeting, keeps decisions separate from open questions, and drafts the follow-up pack. The seller reviews every customer-facing line.",
    storyboard: [
      {
        when: "Meeting starts",
        label: "The agent joins the working session with no extra prompt.",
        scene: "call",
        visual: {
          kind: "live-call",
          title: "CX planning session",
          people: [
            { initials: "AE", name: "You" },
            { initials: "CX", name: "CX lead" },
            { initials: "IT", name: "IT lead" },
          ],
        },
      },
      {
        when: "During the call",
        label: "It separates decisions, open questions, and owners.",
        scene: "notes",
        visual: {
          kind: "meeting-notes",
          title: "Live meeting notes",
          items: ["Decisions", "Open questions", "Owners"],
          status: "Draft notes only",
        },
      },
      {
        when: "Before the call ends",
        label: "It prepares the follow-up pack in the open workspace.",
        scene: "deck",
        visual: {
          kind: "deck-update",
          eyebrow: "Follow-up pack",
          headline: "Decisions, owners, and next step",
          product: "Approved NiCE material attached",
          status: "4 slides drafted",
        },
      },
      {
        when: "Seller review",
        label: "The last frame is the finished draft, ready for approval.",
        scene: "deck",
        slides: FOLLOW_UP_SLIDES,
      },
    ],
    unlock:
      "The seller leaves the call with a checked structure instead of a blank page.",
    outcome:
      "One meeting becomes a clear follow-up pack while the details are still fresh.",
    demo: {
      title: "Follow-up",
      subtitle: "Meeting notes to a reviewed customer pack",
      participants: [
        { id: "you", name: "You", role: "you" },
        {
          id: "follow-up",
          name: "Follow-up",
          role: "bot",
          persona: "Turns the meeting into decisions, owners, and next steps",
          color: "#2F7FF7",
        },
        {
          id: "sources",
          name: "Sources",
          role: "bot",
          persona: "Checks the approved material attached to each open question",
          color: "#26BFB1",
        },
      ],
      messages: [
        {
          id: "m1",
          from: "follow-up",
          kind: "routine",
          body: "Customer call started. I am following the meeting and sorting confirmed decisions from open questions. Drafts only.",
        },
        {
          id: "m2",
          from: "follow-up",
          kind: "text",
          body: "The working notes now have separate sections for decisions, owners, dates, and questions that still need a source.",
        },
        {
          id: "m3",
          from: "sources",
          kind: "text",
          body: "I linked approved product, security, and implementation material where it applies. Unanswered items still show an owner.",
        },
        {
          id: "m4",
          from: "follow-up",
          kind: "draft",
          draftLabel: "Customer follow-up slides",
          artifact: {
            kind: "slides",
            title: "Meeting next steps",
            cards: FOLLOW_UP_SLIDES,
          },
        },
        {
          id: "m5",
          from: "follow-up",
          kind: "draft",
          draftLabel: "Follow-up email",
          artifact: {
            kind: "gmail",
            title: "Customer follow-up",
            to: "Customer team",
            subject: "Next steps from our CX planning session",
            body: "Thanks for the working session. I organized the confirmed decisions, open questions, owners, and next meeting into one short pack. The account team is checking the final details before anything is sent.",
          },
        },
        {
          id: "m6",
          from: "follow-up",
          kind: "system",
          body: "Nothing sent. The slides and email stay in draft until the seller approves them.",
        },
      ],
    },
  },
  {
    id: "answer-desk",
    number: 2,
    title: "Answer customer questions without the Slack chase",
    trigger: "A customer question arrives",
    backgroundAction: "Checking approved product and company sources",
    problem:
      "A detailed question can send a seller through product, security, services, finance, and legal. The customer waits while the seller finds the right owner.",
    botJob:
      "Grok Bot checks approved sources, marks the choices that still need a person, and drafts one response. The account team keeps control of the answer.",
    storyboard: [
      {
        when: "Question arrives",
        label: "The agent opens the thread and splits it into answerable parts.",
        scene: "notes",
        visual: {
          kind: "procurement-email",
          sender: "Customer team",
          subject: "Platform and rollout questions",
          questions: 3,
        },
      },
      {
        when: "Sources checked",
        label: "Each answer stays beside the approved source it came from.",
        scene: "inspect",
        visual: {
          kind: "answers-found",
          sources: [
            { name: "Product docs", answer: "Current answer found" },
            { name: "Security docs", answer: "Review path found" },
            { name: "Implementation", answer: "Owner still needed" },
          ],
          status: "3 questions checked",
        },
      },
      {
        when: "Seller review",
        label: "The final frame is the sourced reply with open choices marked.",
        scene: "send",
        artifact: CUSTOMER_ANSWER_PACK,
      },
    ],
    unlock:
      "The seller gets one checked draft and a short list of decisions that still need an owner.",
    outcome:
      "One customer thread becomes a sourced response without a week of internal follow-up.",
    demo: {
      title: "Answer desk",
      subtitle: "Customer question to a sourced draft",
      participants: [
        { id: "you", name: "You", role: "you" },
        {
          id: "answers",
          name: "Answer desk",
          role: "bot",
          persona: "Checks approved sources and prepares the customer response",
          color: "#F25F87",
        },
      ],
      messages: [
        {
          id: "m1",
          from: "answers",
          kind: "routine",
          body: "New customer question detected. I split the thread into product, security, implementation, and commercial items. Nothing will send automatically.",
        },
        {
          id: "m2",
          from: "answers",
          kind: "text",
          body: "The product and security answers have current sources. Implementation still needs an owner. Commercial terms stay with the account team.",
        },
        {
          id: "m3",
          from: "answers",
          kind: "draft",
          draftLabel: "Questions and sourced answers",
          artifact: CUSTOMER_ANSWER_PACK,
        },
        {
          id: "m4",
          from: "answers",
          kind: "draft",
          draftLabel: "Email reply",
          artifact: {
            kind: "gmail",
            title: "Customer reply",
            to: CUSTOMER_ANSWER_PACK.reply.to,
            subject: CUSTOMER_ANSWER_PACK.reply.subject,
            body: CUSTOMER_ANSWER_PACK.reply.body,
          },
        },
        {
          id: "m5",
          from: "answers",
          kind: "system",
          body: "Nothing sent. The account team owns the final answer.",
        },
      ],
    },
  },
  {
    id: "account-research",
    number: 3,
    title: "Build a point of view before the first touch",
    trigger: "A target account enters the list",
    backgroundAction: "Reading public signals and drafting outreach",
    problem:
      "A name on a list is not enough for useful outreach. The seller needs a current signal, a reason NiCE may fit, and the role that owns the work.",
    botJob:
      "Grok Bot reads public sources, keeps the evidence beside the account idea, and drafts outreach for seller review. It stops if the signal is weak.",
    storyboard: [
      {
        when: "Account added",
        label: "The agent starts with public sources, not a generic persona.",
        scene: "inspect",
        visual: {
          kind: "account-research",
          account: "Sample CX account",
          sources: ["Company filing", "Careers", "Company news"],
          signal: "Current public signals",
        },
      },
      {
        when: "Research ready",
        label: "It turns the evidence into a short account hypothesis.",
        scene: "notes",
        visual: {
          kind: "three-why",
          items: [
            { label: "Why NiCE", answer: "Relevant CX story" },
            { label: "Why now", answer: "Dated public signal" },
            { label: "Why this role", answer: "Owner to validate" },
          ],
        },
      },
      {
        when: "Drafts ready",
        label: "The likely owner gets a personal draft for seller review.",
        scene: "map",
        visual: {
          kind: "outreach-ready",
          person: "CX leader · role to validate",
          channels: ["LinkedIn", "Email", "Account page"],
          status: "3 drafts · 0 sent",
        },
      },
      {
        when: "Seller review",
        label: "The final frame keeps the evidence and draft together.",
        scene: "send",
        artifact: SAMPLE_OUTBOUND,
      },
    ],
    unlock:
      "The seller sees the evidence, the account idea, and the draft in one place.",
    outcome:
      "One target account becomes a sourced point of view and a set of drafts for review.",
    demo: {
      title: "Account research",
      subtitle: "Public signal to a first-touch draft",
      participants: [
        { id: "you", name: "You", role: "you" },
        {
          id: "research",
          name: "Account research",
          role: "bot",
          persona: "Finds current signals and drafts a sourced account point of view",
          color: "#FF7B55",
        },
      ],
      messages: [
        {
          id: "m1",
          from: "research",
          kind: "routine",
          body: "Sample CX account entered the target list. I am checking public company material, current hiring, and dated company news. Drafts only.",
        },
        {
          id: "m2",
          from: "research",
          kind: "text",
          body: "The research note keeps each account idea beside its public source. Weak or old signals are marked for removal.",
        },
        {
          id: "m3",
          from: "research",
          kind: "draft",
          draftLabel: "Account hypothesis",
          artifact: {
            kind: "packet",
            title: "Sample CX account hypothesis",
            fields: SAMPLE_OUTBOUND.hypothesis.map((item) => ({
              label: item.k,
              value: item.body,
            })),
          },
        },
        {
          id: "m4",
          from: "research",
          kind: "draft",
          draftLabel: "Evidence and roles",
          artifact: {
            kind: "packet",
            title: "Public sources and roles to validate",
            fields: [
              ...SAMPLE_OUTBOUND.evidence.map((item) => ({
                label: item.source,
                value: item.finding,
              })),
              ...SAMPLE_OUTBOUND.targets.map((person) => ({
                label: `${person.name} · ${person.role}`,
                value: person.why,
              })),
            ],
          },
        },
        {
          id: "m5",
          from: "research",
          kind: "draft",
          draftLabel: "LinkedIn message",
          artifact: {
            kind: "linkedin",
            title: "LinkedIn draft",
            to: "CX leader",
            role: "Role to validate",
            body: "I read your public update on customer experience work. I pulled together a short NiCE point of view with the source beside each idea. Would a brief review be useful?",
          },
        },
        {
          id: "m6",
          from: "research",
          kind: "draft",
          draftLabel: "Email",
          artifact: {
            kind: "gmail",
            title: "Email draft",
            to: "CX leader",
            subject: "A question about your CX work",
            body: "I read your public update on customer experience work and built a short point of view around it. Each idea links back to the public source. Would a brief review be useful?",
          },
        },
        {
          id: "m7",
          from: "research",
          kind: "draft",
          draftLabel: "Account page",
          artifact: {
            kind: "one-pager",
            title: SAMPLE_OUTBOUND.page.headline,
            eyebrow: "Draft account page",
            sections: [
              {
                heading: "Public signals",
                body: "Current company material, hiring, and company news stay linked to the note.",
              },
              {
                heading: "NiCE point of view",
                body: SAMPLE_OUTBOUND.page.body,
              },
              {
                heading: "Seller check",
                body: "Confirm the signal, the role, and the message before sharing.",
              },
            ],
          },
        },
        {
          id: "m8",
          from: "research",
          kind: "system",
          body: "Nothing sent. The seller reviews every source and draft.",
        },
      ],
    },
  },
];

export function getJob(id: string): GtmJob | undefined {
  return JOBS.find((job) => job.id === id);
}
