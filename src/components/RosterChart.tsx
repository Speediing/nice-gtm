import type { CSSProperties } from "react";
import { FLEET, type FleetBot } from "@/data/fleet";

function AgentComputer({ agent }: { agent: FleetBot }) {
  const style = { "--agent-color": agent.color } as CSSProperties;

  return (
    <li>
      <a className="fleet-computer" href={`#${agent.jobId}`} style={style}>
        <span className="fleet-monitor" aria-hidden>
          <span className="fleet-browser-bar">
            <i />
            <i />
            <i />
            <b>{agent.name}</b>
          </span>
          <span className="fleet-screen">
            <span className="fleet-agent-row">
              <i>{agent.name.slice(0, 1)}</i>
              <b>{agent.status}</b>
            </span>
            <span className="fleet-apps">
              {agent.apps.map((app) => (
                <small key={app}>{app}</small>
              ))}
            </span>
            <span className="fleet-work">
              <i />
              <i />
              <i />
            </span>
          </span>
        </span>
        <strong>{agent.name}</strong>
        <span>{agent.blurb}</span>
      </a>
    </li>
  );
}

export function RosterChart() {
  return (
    <section id="roster" className="roster fleet">
      <div className="fleet-heading">
        <div>
          <p className="eyebrow">A computer for every agent</p>
          <h2>The fleet works across the tools your sellers already use.</h2>
        </div>
        <p className="section-lede">
          Each agent keeps its own browser and working files. The seller can
          open the computer, inspect the work, and approve the next action.
        </p>
      </div>

      <div className="fleet-control">
        <span>
          <i aria-hidden />
          Seller control
        </span>
        <p>Three computers working. No customer action sent.</p>
      </div>

      <ul className="fleet-computers">
        {FLEET.map((agent) => (
          <AgentComputer key={agent.id} agent={agent} />
        ))}
      </ul>
    </section>
  );
}
