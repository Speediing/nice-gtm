import type { Artifact, DemoMessage } from "@/data/types";
import type { ComputerBeat } from "@/data/screens";
import { FOLLOW_UP_SLIDES } from "@/data/jobs";
import { SlideArtifact } from "./SlideArtifact";

function asSlides(artifact?: Artifact) {
  return artifact?.kind === "slides" ? artifact : null;
}

function asGmail(artifact?: Artifact) {
  return artifact?.kind === "gmail" ? artifact : null;
}

function asOnePager(artifact?: Artifact) {
  return artifact?.kind === "one-pager" ? artifact : null;
}

function asPacket(artifact?: Artifact) {
  return artifact?.kind === "packet" ? artifact : null;
}

function asLinkedin(artifact?: Artifact) {
  return artifact?.kind === "linkedin" ? artifact : null;
}

function asOutbound(artifact?: Artifact) {
  return artifact?.kind === "outbound" ? artifact : null;
}

export function SiteScreen({
  beat,
  message,
  account,
  sent,
}: {
  beat: ComputerBeat;
  message?: DemoMessage;
  account: string;
  sent: boolean;
}) {
  const artifact = message?.artifact;

  switch (beat.site) {
    case "granola":
      return <GranolaScreen />;
    case "figma":
      return <FigmaScreen account={account} artifact={artifact} />;
    case "gmail":
      return (
        <GmailScreen account={account} artifact={asGmail(artifact)} sent={sent} />
      );
    case "gdoc":
      return (
        <GdocScreen
          account={account}
          onePager={asOnePager(artifact)}
          packet={asPacket(artifact)}
        />
      );
    case "linkedin":
      return (
        <LinkedInScreen
          account={account}
          artifact={asLinkedin(artifact)}
          sent={sent}
        />
      );
    case "research":
      return <ResearchScreen account={account} />;
    case "page":
      return (
        <PageScreen
          account={account}
          onePager={asOnePager(artifact)}
          outbound={asOutbound(artifact)}
        />
      );
    default: {
      const exhaustiveSite: never = beat.site;
      return exhaustiveSite;
    }
  }
}

function GranolaScreen() {
  return (
    <div className="site site-granola">
      <header>
        <strong>Granola</strong>
        <span>Live meeting notes</span>
      </header>
      <p className="site-time">CX planning session · draft notes</p>
      <ul>
        <li>
          <span>09:12</span> Decision recorded. Account team must confirm the
          wording.
        </li>
        <li>
          <span>09:18</span> Open question linked to the security owner.
        </li>
        <li>
          <span>09:24</span> Implementation question needs the current guide.
        </li>
        <li>
          <span>09:31</span> Next meeting needs an owner and a date.
        </li>
      </ul>
    </div>
  );
}

function FigmaScreen({
  account,
  artifact,
}: {
  account: string;
  artifact?: Artifact;
}) {
  const slides = asSlides(artifact);

  return (
    <div className="site site-figma">
      <header>
        <span className="figma-logo">F</span>
        <strong>{slides?.title || `${account} follow-up`}</strong>
        <em>Draft</em>
      </header>
      <div className="figma-board">
        <SlideArtifact slides={slides?.cards ?? FOLLOW_UP_SLIDES} size="sm" />
      </div>
    </div>
  );
}

function GmailScreen({
  account,
  artifact,
  sent,
}: {
  account: string;
  artifact: ReturnType<typeof asGmail>;
  sent: boolean;
}) {
  return (
    <div className="site site-gmail">
      <header>
        <strong>Gmail</strong>
        <em>{sent ? "Sent" : "Draft · not sent"}</em>
      </header>
      <p>
        <span>To</span>
        {artifact?.to || `${account} contact`}
      </p>
      <p>
        <span>Subject</span>
        {artifact?.subject || "Customer follow-up"}
      </p>
      <div>{artifact?.body || "Draft parked for seller review."}</div>
    </div>
  );
}

function GdocScreen({
  account,
  onePager,
  packet,
}: {
  account: string;
  onePager: ReturnType<typeof asOnePager>;
  packet: ReturnType<typeof asPacket>;
}) {
  return (
    <div className="site site-gdoc">
      <header>
        <strong>Docs</strong>
        <span>{packet?.title || onePager?.title || `${account} working note`}</span>
      </header>
      <article>
        {packet ? (
          packet.fields.map((field) => (
            <p key={field.label}>
              <b>{field.label}.</b> {field.value}
            </p>
          ))
        ) : onePager ? (
          onePager.sections.map((section) => (
            <p key={section.heading}>
              <b>{section.heading}.</b> {section.body}
            </p>
          ))
        ) : (
          <>
            <p>
              <b>Product material.</b> Current source linked for seller review.
            </p>
            <p>
              <b>Security material.</b> Current source linked for seller review.
            </p>
            <p>
              <b>Implementation.</b> Owner still needs to confirm the answer.
            </p>
          </>
        )}
      </article>
    </div>
  );
}

function ResearchScreen({ account }: { account: string }) {
  return (
    <div className="site site-research">
      <header>
        <strong>{account}</strong>
        <span>Public sources</span>
      </header>
      <p className="site-time">Research note · seller must validate</p>
      <ul>
        <li>
          <span>Filing</span> Pull the stated customer experience priority and
          keep the source link.
        </li>
        <li>
          <span>Careers</span> Check current hiring to see where the work sits.
        </li>
        <li>
          <span>News</span> Keep only dated company announcements that support
          the account idea.
        </li>
      </ul>
    </div>
  );
}

function LinkedInScreen({
  account,
  artifact,
  sent,
}: {
  account: string;
  artifact: ReturnType<typeof asLinkedin>;
  sent: boolean;
}) {
  return (
    <div className="site site-linkedin">
      <header>
        <strong>LinkedIn</strong>
        <em>{sent ? "Sent" : "Draft · not sent"}</em>
      </header>
      <p>
        <span>To</span>
        {artifact?.to || `${account} CX leader`}
        {artifact?.role ? ` · ${artifact.role}` : ""}
      </p>
      <div>{artifact?.body || "Message parked for seller review."}</div>
    </div>
  );
}

function PageScreen({
  account,
  onePager,
  outbound,
}: {
  account: string;
  onePager: ReturnType<typeof asOnePager>;
  outbound: ReturnType<typeof asOutbound>;
}) {
  const headline =
    outbound?.page.headline || onePager?.title || `For ${account}`;
  const body =
    outbound?.page.body ||
    onePager?.sections.map((section) => section.body).join(" ") ||
    `Draft page for ${account}.`;

  return (
    <div className="site site-page">
      <header>
        <strong>Account page</strong>
        <em>Not live</em>
      </header>
      <h4>{headline}</h4>
      {onePager ? (
        onePager.sections.map((section) => (
          <p key={section.heading}>
            <b>{section.heading}.</b> {section.body}
          </p>
        ))
      ) : (
        <p>{body}</p>
      )}
    </div>
  );
}
