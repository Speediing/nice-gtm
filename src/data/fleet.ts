import type { JobId } from "./types";

export type FleetBot = {
  id: string;
  name: string;
  blurb: string;
  color: string;
  jobId: JobId;
  apps: readonly string[];
  status: string;
};

export const FLEET: FleetBot[] = [
  {
    id: "follow-up",
    name: "Follow-up",
    blurb: "Turns meetings into decisions, owners, and customer-ready drafts.",
    jobId: "meeting-follow-up",
    color: "#2F7FF7",
    apps: ["Granola", "Figma", "Gmail"],
    status: "Meeting in progress",
  },
  {
    id: "answers",
    name: "Answer desk",
    blurb: "Checks approved sources and marks decisions that still need a person.",
    jobId: "answer-desk",
    color: "#F25F87",
    apps: ["Gmail", "Docs", "Slack"],
    status: "Sources checked",
  },
  {
    id: "research",
    name: "Account research",
    blurb: "Builds a sourced account idea and keeps every outreach draft parked.",
    jobId: "account-research",
    color: "#FF7B55",
    apps: ["Web", "Docs", "LinkedIn"],
    status: "Drafts ready",
  },
];
