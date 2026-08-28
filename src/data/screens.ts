import type { JobId } from "./types";

export type SiteKind =
  | "granola"
  | "figma"
  | "gmail"
  | "gdoc"
  | "linkedin"
  | "research"
  | "page";

export type ChromeTab = {
  id: string;
  host: string;
  label: string;
};

export type ComputerBeat = {
  pill: string;
  host: string;
  path?: string;
  title: string;
  site: SiteKind;
  tabs: ChromeTab[];
};

const granola = { id: "granola", host: "granola.app", label: "Granola" };
const figma = { id: "figma", host: "figma.com", label: "Figma" };
const gmail = { id: "gmail", host: "mail.google.com", label: "Gmail" };
const gdoc = { id: "gdoc", host: "docs.google.com", label: "Docs" };
const linkedin = {
  id: "linkedin",
  host: "www.linkedin.com",
  label: "LinkedIn",
};
const web = {
  id: "web",
  host: "sample-account.example",
  label: "Public sources",
};

export const SCREENS: Record<JobId, Record<string, ComputerBeat>> = {
  "meeting-follow-up": {
    m1: {
      pill: "Opening the meeting notes",
      host: "granola.app",
      path: "/notes/cx-planning-session",
      title: "CX planning session",
      site: "granola",
      tabs: [granola, gdoc, figma, gmail],
    },
    m2: {
      pill: "Sorting decisions and open questions",
      host: "granola.app",
      path: "/notes/cx-planning-session",
      title: "CX planning session",
      site: "granola",
      tabs: [granola, gdoc, figma, gmail],
    },
    m3: {
      pill: "Checking approved sources",
      host: "docs.google.com",
      path: "/document/d/follow-up-sources",
      title: "Follow-up sources",
      site: "gdoc",
      tabs: [granola, gdoc, figma, gmail],
    },
    m4: {
      pill: "Drafting the follow-up slides",
      host: "figma.com",
      path: "/file/customer-follow-up",
      title: "Meeting next steps",
      site: "figma",
      tabs: [granola, gdoc, figma, gmail],
    },
    m5: {
      pill: "Drafting the follow-up email",
      host: "mail.google.com",
      path: "/mail/u/0/#drafts",
      title: "Drafts",
      site: "gmail",
      tabs: [granola, gdoc, figma, gmail],
    },
    m6: {
      pill: "Drafts parked for seller review",
      host: "mail.google.com",
      path: "/mail/u/0/#drafts",
      title: "Drafts",
      site: "gmail",
      tabs: [granola, gdoc, figma, gmail],
    },
  },
  "answer-desk": {
    m1: {
      pill: "Opening the customer thread",
      host: "mail.google.com",
      path: "/mail/u/0/#inbox",
      title: "Inbox",
      site: "gmail",
      tabs: [gmail, gdoc],
    },
    m2: {
      pill: "Checking approved sources",
      host: "docs.google.com",
      path: "/document/d/customer-answer-pack",
      title: "Customer answer pack",
      site: "gdoc",
      tabs: [gmail, gdoc],
    },
    m3: {
      pill: "Marking answers and open decisions",
      host: "docs.google.com",
      path: "/document/d/customer-answer-pack",
      title: "Customer answer pack",
      site: "gdoc",
      tabs: [gmail, gdoc],
    },
    m4: {
      pill: "Drafting the reply",
      host: "mail.google.com",
      path: "/mail/u/0/#drafts",
      title: "Drafts",
      site: "gmail",
      tabs: [gmail, gdoc],
    },
    m5: {
      pill: "Reply parked for account-team review",
      host: "mail.google.com",
      path: "/mail/u/0/#drafts",
      title: "Drafts",
      site: "gmail",
      tabs: [gmail, gdoc],
    },
  },
  "account-research": {
    m1: {
      pill: "Reading public account sources",
      host: "sample-account.example",
      path: "/company",
      title: "Sample CX account",
      site: "research",
      tabs: [web, gdoc, linkedin, gmail],
    },
    m2: {
      pill: "Keeping each signal beside its source",
      host: "sample-account.example",
      path: "/company/news",
      title: "Public account signals",
      site: "research",
      tabs: [web, gdoc, linkedin, gmail],
    },
    m3: {
      pill: "Writing the account hypothesis",
      host: "docs.google.com",
      path: "/document/d/account-hypothesis",
      title: "Account hypothesis",
      site: "gdoc",
      tabs: [web, gdoc, linkedin, gmail],
    },
    m4: {
      pill: "Listing sources and roles to validate",
      host: "docs.google.com",
      path: "/document/d/account-hypothesis",
      title: "Sources and roles",
      site: "gdoc",
      tabs: [web, gdoc, linkedin, gmail],
    },
    m5: {
      pill: "Drafting LinkedIn",
      host: "www.linkedin.com",
      path: "/messaging/compose",
      title: "Message",
      site: "linkedin",
      tabs: [web, gdoc, linkedin, gmail],
    },
    m6: {
      pill: "Drafting the email",
      host: "mail.google.com",
      path: "/mail/u/0/#drafts",
      title: "Drafts",
      site: "gmail",
      tabs: [web, gdoc, linkedin, gmail],
    },
    m7: {
      pill: "Building the account page",
      host: "account-page.example",
      path: "/sample-cx-account",
      title: "Sample account page",
      site: "page",
      tabs: [web, gdoc, linkedin, gmail],
    },
    m8: {
      pill: "Drafts parked for seller review",
      host: "mail.google.com",
      path: "/mail/u/0/#drafts",
      title: "Drafts",
      site: "gmail",
      tabs: [web, gdoc, linkedin, gmail],
    },
  },
};

export function beatFor(
  jobId: JobId,
  messageId: string | undefined,
): ComputerBeat | undefined {
  if (!messageId) return undefined;
  return SCREENS[jobId]?.[messageId];
}
