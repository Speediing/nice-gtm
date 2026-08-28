const TOOLS = [
  "Grok Bot",
  "A chat assistant",
  "A task agent",
  "A research tool",
] as const;

const ROWS: { label: string; values: string[] }[] = [
  {
    label: "What it is",
    values: [
      "A team of agents with their own computers",
      "One conversation",
      "One assigned task",
      "One research request",
    ],
  },
  {
    label: "What starts it",
    values: [
      "A message, routine, or work trigger",
      "You start a chat or task",
      "You assign a task",
      "You ask a question",
    ],
  },
  {
    label: "What you get",
    values: [
      "Work across chat, browser, and files",
      "An answer or draft",
      "A completed task",
      "A sourced research answer",
    ],
  },
];

export function CompareTable() {
  return (
    <section id="compare" className="compare">
      <h2>Grok Bot comparison</h2>
      <p className="section-lede">
        The main difference is the working model. Grok Bot gives each agent a
        computer and lets a fleet share the work.
      </p>
      <div className="compare-wrap">
        <table className="compare-table">
          <thead>
            <tr>
              <th scope="col">
                <span className="sr-only">Capability</span>
              </th>
              {TOOLS.map((tool) => (
                <th key={tool} scope="col">
                  {tool}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => (
              <tr key={row.label}>
                <th scope="row">{row.label}</th>
                {row.values.map((value, index) => (
                  <td key={TOOLS[index]}>
                    {value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
