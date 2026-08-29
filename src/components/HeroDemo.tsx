"use client";

import { useState } from "react";
import { HERO_JOBS, type HeroJob } from "@/data/hero-jobs";

function AgentIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="m4 11.2 16-7-6.8 16-2.1-6.6L4 11.2Zm7.1 2.4L20 4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BackIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="m14.5 6-6 6 6 6"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function DesktopIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="4"
        y="5"
        width="16"
        height="11"
        rx="1.8"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M9 20h6M12 16v4"
        stroke="currentColor"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 5v14M5 12h14"
        stroke="currentColor"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function MicIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="9"
        y="3.5"
        width="6"
        height="11"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M6.5 11.5a5.5 5.5 0 0 0 11 0M12 17v3M9 20h6"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}

function JobPills({
  active,
  onSelect,
}: {
  active: HeroJob;
  onSelect: (job: HeroJob) => void;
}) {
  return (
    <div className="hero-phone-jobs" aria-label="Choose a Grok Bot job">
      {HERO_JOBS.map((job) => {
        const selected = job.id === active.id;
        return (
          <button
            key={job.id}
            className={selected ? "is-active" : undefined}
            type="button"
            aria-pressed={selected}
            onClick={() => onSelect(job)}
          >
            {selected ? (
              <span aria-hidden>
                <AgentIcon />
              </span>
            ) : null}
            {job.label}
          </button>
        );
      })}
    </div>
  );
}

function HeroPhone({ job }: { job: HeroJob }) {
  return (
    <aside className="hero-bot-demo" aria-label="Live Grok Bot phone demo">
      <div className="hero-phone">
        <div className="hero-phone-notch" aria-hidden />
        <header className="hero-phone-header">
          <span className="hero-phone-back" aria-hidden>
            <BackIcon />
          </span>
          <span className="hero-phone-agent" aria-hidden>
            <AgentIcon />
          </span>
          <p>
            <strong>{job.label} Agent</strong>
            <small>
              <span aria-hidden />
              Working in the cloud
            </small>
          </p>
          <span className="hero-phone-desktop" aria-hidden>
            <DesktopIcon />
          </span>
        </header>

        <div className="hero-phone-thread" aria-live="polite">
          <article className="hero-phone-work" key={job.id}>
            <p className="hero-phone-work-label">
              <span aria-hidden />
              {job.workLabel}
            </p>
            {job.meta.map((item) => (
              <p className="hero-phone-work-meta" key={item.label}>
                <span>{item.label}</span>
                {item.value}
              </p>
            ))}
            <p className="hero-phone-work-copy">{job.body}</p>
            <strong>{job.result}</strong>
          </article>
          <p className="hero-phone-message is-user" key={`${job.id}-user`}>
            {job.userMessage}
          </p>
          <p className="hero-phone-message is-bot" key={`${job.id}-bot`}>
            {job.botMessage}
          </p>
        </div>

        <footer className="hero-phone-composer">
          <span aria-hidden>
            <PlusIcon />
          </span>
          <p>Message {job.label} Agent</p>
          <span aria-hidden>
            <MicIcon />
          </span>
        </footer>
      </div>
    </aside>
  );
}

export function HeroDemo() {
  const [active, setActive] = useState<HeroJob>(HERO_JOBS[0]);

  return (
    <section className="hero">
      <div className="hero-copy">
        <p className="eyebrow">A proactive agent for every NiCE seller</p>
        <h1>The agents that work while your sellers sell.</h1>
        <p className="hero-intro">
          Grok Bot can follow meetings, check approved sources, and prepare
          drafts in the background. Work can start from a routine or event, not
          only a prompt.
        </p>
        <JobPills active={active} onSelect={setActive} />
      </div>
      <HeroPhone job={active} />
    </section>
  );
}
