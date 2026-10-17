import type { ReactNode } from "react";
import {
  Activity, ArrowRight, BarChart3, Box, Check, ChartColumn, CircleHelp, ClipboardList, Crown, Database, Eye, FileText,
  GitBranch, Headset, Layers3, Lightbulb, Link, PenLine, Scale, Search, Settings, Shield, ShieldCheck, UserRound, UsersRound, Zap,
  type LucideIcon,
} from "lucide-react";
import { PdmaScenarioExercise } from "../exercise/PdmaScenarioExercise";
import { QrCode } from "./QrCode";

/*
 * Copy is carried over from Jim Markunas's /pdma2026 production deck (portfolio repository,
 * src/app/pdma2026/presentation/pdma2026Content.ts at 3dc6ac3). The layouts are new: they follow
 * PDMA's Innovation in Focus speaker template instead of the original dark PBDS treatment.
 */

export const KIT_URL = "https://github.com/jimmarkunas/agents-enterprise-ai-operating-model";

type SlideApi = { go: (index: number) => void };
export type SlideDefinition = { title: string; footer?: string; layout: "band" | "content"; render: (api: SlideApi) => ReactNode };

function Title({ lead, accent, sub, sameRow = false }: { lead: string; accent: string; sub?: string; sameRow?: boolean }) {
  return <header className={`title${sameRow ? " title--row" : ""}`}>
    <h1><span>{lead}</span> <mark>{accent}</mark></h1>
    {sub && <p>{sub}</p>}
  </header>;
}

function Takeaway({ children, tone = "blue" }: { children: ReactNode; tone?: "blue" | "lime" }) {
  return <p className={`takeaway takeaway--${tone}`}>{children}</p>;
}

function IconBadge({ icon: Icon, tone = "blue" }: { icon: LucideIcon; tone?: "blue" | "lime" | "outline" }) {
  return <span className={`icon-badge icon-badge--${tone}`} aria-hidden="true"><Icon strokeWidth={2.2} /></span>;
}

export const slides: SlideDefinition[] = [
  // 01 — Title
  {
    title: "The New PM Operating System",
    layout: "band",
    render: () => <div className="s01">
      <div className="band band--title">
        <p className="band__eyebrow">JUDGMENT <i /> AUTHORITY <i /> ACCOUNTABILITY</p>
        <h1>THE NEW PM OPERATING SYSTEM</h1>
        <p className="band__sub">What stays uniquely human. What shifts to AI.</p>
      </div>
      <div className="s01__speaker">
        <p className="s01__name">Jim Markunas</p>
        <p className="s01__role">Head of Product, Bytalos</p>
      </div>
      <p className="s01__note">HUMAN JUDGMENT COMPOUNDS</p>
    </div>,
  },
  // 02 — What shifts. What stays.
  {
    title: "What shifts. What stays.",
    footer: "Delegated work • Human judgment",
    layout: "content",
    render: () => <div className="s02">
      <Title lead="WHAT SHIFTS." accent="WHAT STAYS." sub="AI automates the grunt work. It does not change who owns the product outcome." sameRow />
      <div className="s02__cols">
        <section className="panel panel--blue">
          <h2>SHIFTS TO AI</h2>
          <ul>{([["Search & synthesis", Search], ["Drafting & analysis", PenLine], ["Monitoring & coordination", Activity]] as const).map(([label, icon]) => <li key={label}><IconBadge icon={icon} tone="lime" />{label}</li>)}</ul>
        </section>
        <section className="panel panel--lime">
          <h2>STAYS HUMAN</h2>
          <ul>{([["Product ownership", Crown], ["Priority & tradeoffs", Scale], ["Authority & escalation", ShieldCheck]] as const).map(([label, icon]) => <li key={label}><IconBadge icon={icon} />{label}</li>)}</ul>
        </section>
      </div>
      <Takeaway>THE BOUNDARY IS NOT <b>HUMAN VS. AI.</b><br />IT’S <b>DELEGATED WORK</b> VS. <b>HUMAN JUDGMENT.</b></Takeaway>
    </div>,
  },
  // 03 — Copilots vs agents
  {
    title: "Copilots generate outputs. Agents take action.",
    footer: "Authority is a product decision",
    layout: "content",
    render: () => <div className="s03">
      <Title lead="COPILOTS GENERATE OUTPUTS." accent="AGENTS TAKE ACTION." sub="When AI can act in enterprise systems, product design must account for authority, consequence, and control." />
      <div className="s03__panels">
        {[
          { heading: "COPILOT", descriptor: "ASSISTS WITH OUTPUTS", steps: [["H", "HUMAN"], ["P", "PROMPT"], ["M", "MODEL"], ["O", "OUTPUT"]], accent: 3, boundary: "Human remains the execution boundary.", tone: "neutral" },
          { heading: "AGENT", descriptor: "ACTS IN THE REAL WORLD", steps: [["G", "GOAL"], ["A", "AGENT"], ["T", "TOOL / SYSTEM"], ["→", "ACTION"]], accent: 1, boundary: "AI can now cross the execution boundary.", tone: "accent", capabilities: ["READ", "WRITE", "SEND", "SPEND"] },
        ].map((panel) => <section key={panel.heading} className={`panel s03__panel ${panel.tone === "accent" ? "panel--blue" : "panel--white"}`}>
          <h2>{panel.heading}</h2>
          <p className="s03__descriptor">{panel.descriptor}</p>
          <ol className="s03__flow">{panel.steps.map(([glyph, label], i) => <li key={label} className={i === panel.accent ? "is-accent" : ""}><span>{glyph}</span><small>{label}</small></li>)}</ol>
          <p className="s03__boundary">{panel.boundary}</p>
          {panel.capabilities && <ul className="s03__caps">{panel.capabilities.map((c) => <li key={c}>{c}</li>)}</ul>}
        </section>)}
      </div>
      <Takeaway>WHEN AI BECOMES AN OPERATOR, <b>AUTHORITY BECOMES A PRODUCT DECISION.</b></Takeaway>
    </div>,
  },
  // 04 — Don't automate everything
  {
    title: "Don't automate everything.",
    footer: "Build the right operating model",
    layout: "content",
    render: () => <div className="s04">
      <Title lead="DON'T AUTOMATE" accent="EVERYTHING." sub="Decide what problem deserves automation, what outcome matters, and what tradeoffs you’re willing to accept." sameRow />
      <ol className="s04__modes">
        {[
          { number: "01", title: "AUTOMATE", body: "AI owns execution of bounded, repeatable work.", label: "EXECUTION" },
          { number: "02", title: "AUGMENT", body: "AI improves speed, synthesis, or quality while a human still decides.", label: "DECISION" },
          { number: "03", title: "HUMAN-OWNED", body: "Judgment, accountability, and authority stays human.", label: "ACCOUNTABILITY" },
        ].map((m) => <li key={m.number}><span className="num">{m.number}</span><h2>{m.title}</h2><p>{m.body}</p><small>{m.label}</small></li>)}
      </ol>
      <div className="s04__scale" aria-hidden="true"><span>AI-OWNED EXECUTION</span><i /><span>HUMAN-OWNED JUDGMENT</span></div>
      <Takeaway>THE GOAL: <b>BUILD THE RIGHT OPERATING MODEL FOR THE WORK.</b></Takeaway>
    </div>,
  },
  // 05 — Don't automate ambiguity
  {
    title: "Don't automate ambiguity.",
    footer: "Confusion at machine speed",
    layout: "band",
    render: () => <div className="s05">
      <div className="band band--hero"><h1>DON'T AUTOMATE AMBIGUITY.</h1></div>
      <div className="s05__equation">
        {["UNCLEAR PROBLEM.", "UNCLEAR OWNER.", "UNCLEAR AUTHORITY."].map((c, i) => <span key={c} className="s05__term">{i > 0 && <b className="s05__op">+</b>}<span>{c}</span></span>)}
        <b className="s05__op">=</b>
        <strong>CONFUSION AT<br />MACHINE SPEED.</strong>
      </div>
    </div>,
  },
  // 06 — Understand the environment
  {
    title: "Understand the environment. Name the owners.",
    footer: "Automation does not erase ownership",
    layout: "content",
    render: () => <div className="s06">
      <Title lead="UNDERSTAND THE ENVIRONMENT." accent="NAME THE OWNERS." sub="Before you automate, inventory the environment and assign human accountability." />
      <div className="s06__grid">
        <section>
          <h2 className="kicker">DO THE INVENTORY</h2>
          <ul className="cards">{([["SYSTEMS", "Applications, infrastructure, tools and integrations.", Layers3], ["DATA", "Sources, types, sensitivity and quality.", Database], ["PEOPLE", "Teams, roles, skills and working models.", UsersRound], ["DEPENDENCIES", "Upstream, downstream and external partners.", Link]] as const).map(([t, b, icon]) => <li key={t} className="card"><IconBadge icon={icon} /><div><h3>{t}</h3><p>{b}</p></div></li>)}</ul>
        </section>
        <div className="s06__hub" aria-label="AI / Automation sits between the inventory and the owners">
          <div className="s06__core"><small>AUTOMATION</small><strong><mark>AI</mark> / AUTOMATION</strong></div>
          <p>MORE AWARENESS<br /><ArrowRight aria-hidden="true" /><br />BETTER AUTONOMY</p>
        </div>
        <section>
          <h2 className="kicker">NAME THE OWNERS</h2>
          <ul className="cards">{([["SYSTEM OWNER", "Accountable for reliability, security and lifecycle.", UserRound], ["DECISION OWNER", "Accountable for policies, trade-offs and approvals.", FileText], ["OUTCOME OWNER", "Accountable for value, results and continuous improvement.", BarChart3]] as const).map(([t, b, icon]) => <li key={t} className="card card--lime"><IconBadge icon={icon} tone="lime" /><div><h3>{t}</h3><p>{b}</p></div></li>)}</ul>
        </section>
      </div>
    </div>,
  },
  // 07 — Prove the value
  {
    title: "Before you build it, prove the value.",
    footer: "Pick one primary value driver",
    layout: "content",
    render: () => <div className="s07">
      <Title lead="BEFORE YOU BUILD IT," accent="PROVE THE VALUE." sub="Every agentic product should have a clear economic reason to exist. Pick one primary value driver." />
      <div className="s07__grid">
        <aside className="panel panel--blue s07__rule">
          <small>DECISION RULE</small>
          <h2>PICK ONE PRIMARY VALUE DRIVER.</h2>
          <p>Use this scorecard to evaluate your concept. A strong product should clearly map to one primary value driver.</p>
        </aside>
        {[
          { title: "INCREASE REVENUE", question: "Does it help us grow top-line value?", rows: ["ACQUIRE", "CONVERT", "RETAIN", "EXPAND"] },
          { title: "DECREASE COST", question: "Does it remove meaningful cost from the system?", rows: ["LABOR", "COST-TO-SERVE", "REWORK", "WASTE"] },
          { title: "STREAMLINE OPERATIONS", question: "Does it make work materially easier to run?", rows: ["FASTER", "SIMPLER", "SCALABLE", "LESS MANUAL"] },
        ].map((col, c) => <section key={col.title} className="panel panel--white s07__col">
          <h3>{col.title}</h3>
          <p>{col.question}</p>
          <ul>{col.rows.map((row, r) => <li key={row} className={c === 0 && r === 0 ? "is-on" : ""}><span className="s07__box">{c === 0 && r === 0 && <Check strokeWidth={3} />}</span>{row}</li>)}</ul>
        </section>)}
      </div>
      <Takeaway tone="lime">IF YOU CAN'T IDENTIFY ONE OF THESE OUTCOMES, <b>YOU DON'T HAVE A PRODUCT.</b></Takeaway>
    </div>,
  },
  // 08 — Authority spectrum
  {
    title: "How much authority should the robots have?",
    footer: "Authority is a product decision",
    layout: "content",
    render: () => <div className="s08">
      <Title lead="HOW MUCH AUTHORITY" accent="SHOULD THE ROBOTS HAVE?" sub="The farther AI moves from observing to acting, the more deliberately the Product Manager has to design the boundary." />
      <ol className="s08__stages">
        {([
          ["01", "OBSERVE", "AI sees the state of the product or process.", Eye],
          ["02", "RECOMMEND", "AI proposes what should happen.", FileText],
          ["03", "PREPARE", "AI stages the action for human review.", Settings],
          ["04", "DECIDE", "AI chooses the action within defined rules.", GitBranch],
          ["05", "EXECUTE", "AI acts within defined limits.", Zap],
        ] as const).map(([n, t, b, icon], i) => <li key={n} className={i >= 3 ? "is-active" : ""} style={{ marginTop: `${(4 - i) * 46}px` }}>
          <IconBadge icon={icon} tone={i >= 3 ? "lime" : "outline"} />
          <span className="num">{n}</span><h2>{t}</h2><p>{b}</p>
        </li>)}
      </ol>
      <div className="s08__axis"><span>MORE AUTONOMY</span><span>MORE CONSEQUENCE</span><span>MORE PRODUCT DESIGN</span></div>
      <Takeaway>THE FARTHER RIGHT YOU GO, <b>THE MORE PRODUCT DESIGN HAS TO ACCOUNT FOR THE CONSEQUENCES.</b></Takeaway>
    </div>,
  },
  // 09 — Live scenario
  {
    title: "Live scenario: Retention agent.",
    footer: "Production-ready enterprise product",
    layout: "content",
    render: () => <div className="s09">
      <Title lead="LIVE SCENARIO:" accent="RETENTION AGENT." sub="A real enterprise business case: detect churn risk across CRM, product-usage, and support data before it is too late to act." sameRow />
      <div className="s09__grid">
        <section className="panel panel--white s09__problem">
          <small>BUSINESS PROBLEM</small>
          <p>Customer retention teams spend too much time manually identifying churn risk across fragmented enterprise systems.</p>
          <small>PRIMARY VALUE DRIVER</small>
          <strong>INCREASE REVENUE</strong>
          <em>+ STREAMLINE OPERATIONS</em>
        </section>
        <ul className="s09__signals">{([["CRM", "Customer data", UsersRound], ["PRODUCT USAGE", "Behavioral data", BarChart3], ["SUPPORT", "Support tickets", Headset], ["ACCOUNT HEALTH", "Billing & health data", Database]] as const).map(([t, b, icon]) => <li key={t} className="card"><IconBadge icon={icon} /><div><h3>{t}</h3><p>{b}</p></div></li>)}</ul>
        <ol className="s09__stages">{([["IDENTIFY", "Detect meaningful churn-risk patterns across enterprise customer data.", ChartColumn], ["RECOMMEND", "Recommend an approved intervention to the responsible team.", Lightbulb]] as const).map(([t, b, icon]) => <li key={t} className="panel panel--blue"><IconBadge icon={icon} tone="lime" /><h3>{t}</h3><p>{b}</p></li>)}</ol>
        <section className="panel panel--lime s09__question">
          <IconBadge icon={CircleHelp} />
          <small>PRODUCT QUESTION</small>
          <h3>How much authority should this agent have?</h3>
        </section>
      </div>
      <Takeaway>HOW DO WE TURN THIS BUSINESS CASE INTO A <b>PRODUCTION-READY ENTERPRISE PRODUCT?</b></Takeaway>
    </div>,
  },
  // 10 — Production readiness
  {
    title: "Design production readiness into the feature.",
    footer: "Production readiness starts in the backlog",
    layout: "content",
    render: () => <div className="s10">
      <Title lead="DESIGN PRODUCTION READINESS" accent="INTO THE FEATURE." sub="Guardrails, human intervention, and success measures belong in the product requirements before development begins." />
      <ol className="s10__reqs">{([["01", "GUARDRAILS", "What must the product prevent or constrain?", Shield, false], ["02", "HUMAN INTERVENTION", "When must a person review, approve, or take over?", UserRound, true], ["03", "SUCCESS METRICS", "What proves the feature creates the intended outcome?", BarChart3, false]] as const).map(([n, t, b, icon, em]) => <li key={n} className={`panel ${em ? "panel--blue" : "panel--white"}`}><IconBadge icon={icon} tone={em ? "lime" : "blue"} /><div><span className="num">{n}</span><h2>{t}</h2><p>{b}</p></div></li>)}</ol>
      <h2 className="kicker s10__label">OPERATIONALIZE IT AS PRODUCT WORK</h2>
      <ol className="rail">{([["01", "BACKLOG", "Capture the requirements.", ClipboardList], ["02", "PRD", "Define behavior and boundaries.", FileText], ["03", "ACCEPTANCE CRITERIA", "Make them testable.", Check], ["04", "PRODUCTION", "Prove they work.", Box]] as const).map(([n, t, b, icon], i) => <li key={n} className={i === 3 ? "is-emphasis" : ""}><IconBadge icon={icon} tone={i === 3 ? "lime" : "outline"} /><div><span className="num">{n}</span><h3>{t}</h3><p>{b}</p></div></li>)}</ol>
      <Takeaway>IF IT MATTERS IN PRODUCTION, <b>IT BELONGS IN THE PRODUCT DEFINITION.</b> <span className="takeaway__aside">REAL FEATURES. REAL OUTCOMES.</span></Takeaway>
    </div>,
  },
  // 11 — A.G.E.N.T.S. reveal
  {
    title: "A.G.E.N.T.S.",
    footer: "6 questions • 1 productization standard",
    layout: "band",
    render: () => <div className="s11">
      <div className="band band--reveal">
        <h1>A.G.E.N.T.S.</h1>
        <p>Six product questions that turn an agentic AI idea into something a team can safely build, test, and operate.</p>
      </div>
      <ol className="s11__questions">{[
        ["A", "AUTHORITY", "What may AI decide and do?"],
        ["G", "GUARDRAILS", "What constraints must be built into the product?"],
        ["E", "EVIDENCE", "What operational record must the product create?"],
        ["N", "NETWORK & INTEGRATIONS", "What systems, data, and permissions may it touch?"],
        ["T", "TRANSFER & ESCALATION", "When must a human intervene?"],
        ["S", "SUCCESS & ACCOUNTABILITY", "What KPI defines success + which human owns the outcome?"],
      ].map(([l, t, q]) => <li key={l}><span className="letter">{l}</span><h2>{t}</h2><p>{q}</p></li>)}</ol>
    </div>,
  },
  // 12 — Framework into product
  {
    title: "Turn the framework into product.",
    footer: "Framework → requirements → buildable product",
    layout: "content",
    render: () => <div className="s12">
      <Title lead="TURN THE FRAMEWORK" accent="INTO PRODUCT." sub="A.G.E.N.T.S. changes how you write your backlog." sameRow />
      <table className="s12__table">
        <thead><tr><th colSpan={2}>A.G.E.N.T.S. FRAMEWORK</th><th aria-hidden="true" /><th>PRODUCT REQUIREMENTS · RETENTION AGENT</th></tr></thead>
        <tbody>{[
          ["A", "Authority", "The agent may recommend a retention intervention, but cannot publish or launch it."],
          ["G", "Guardrails", "Recommendations must stay within approved product surfaces and business rules."],
          ["E", "Evidence", "Keep a clear record of the recommendation, the inputs that drove it, and the final decision."],
          ["N", "Network & Integrations", "Agent has read/write access to Salesforce, but cannot change customer payment data."],
          ["T", "Transfer & Escalation", "CS Lead approval is required before an agent can update a customer’s payment data."],
          ["S", "Success & Accountability", "Measure retention lift, recommendation accuracy, false-positive rate, and human override rate."],
        ].map(([l, label, req]) => <tr key={l}><td className="letter">{l}</td><td className="s12__label">{label}</td><td className="s12__arrow" aria-hidden="true"><ArrowRight /></td><td>{req}</td></tr>)}</tbody>
      </table>
    </div>,
  },
  // 13 — Idea + AI ≠ spec
  {
    title: "An idea + AI ≠ product spec.",
    footer: "Less rework • Faster delivery • Higher confidence",
    layout: "content",
    render: () => <div className="s13">
      <Title lead="AN IDEA + AI" accent="≠ PRODUCT SPEC." sub="Same starting point. Different outcomes." sameRow />
      <div className="s13__grid">
        <section className="panel panel--white s13__card">
          <small className="s13__tag">BEFORE</small>
          <h2>A Vague Prompt</h2>
          <blockquote>“Build an AI agent that helps retain customers and recommend improvements.”</blockquote>
          <ul className="s13__list s13__list--bad">{["Unclear business value", "No operating boundaries", "Missing data and system context", "No success criteria", "High risk of rework"].map((i) => <li key={i}>{i}</li>)}</ul>
        </section>
        <div className="s13__bridge"><ArrowRight aria-hidden="true" /><p>A.G.E.N.T.S. TURNS IDEAS INTO BUILDABLE PRODUCTS.</p></div>
        <section className="panel panel--blue s13__card">
          <small className="s13__tag">AFTER</small>
          <h2>A Production-Ready Spec</h2>
          <blockquote>“Build a Retention Agent that identifies statistically significant retention problems and recommends approved interventions.”</blockquote>
          <ul className="s13__list s13__list--good">{["Clear business value and success metrics", "Defined authority and operating boundaries", "Identified data sources and integrations", "Evidence and decision record requirements", "Ready for build, test, and operationalize"].map((i) => <li key={i}>{i}</li>)}</ul>
        </section>
      </div>
      <div className="s13__outcomes">
        <p className="s13__same">SAME IDEA. <b>COMPLETELY DIFFERENT PRODUCT.</b></p>
        {[["LESS", "REWORK"], ["FASTER", "DELIVERY"], ["HIGHER", "CONFIDENCE"]].map(([v, l]) => <p key={l}><strong>{v}</strong> {l}</p>)}
      </div>
    </div>,
  },
  // 14 — Now you do it
  {
    title: "Now you do it.",
    footer: "Useful PM artifact • Not just a quiz result",
    layout: "content",
    render: ({ go }) => <div className="s14">
      <Title lead="NOW YOU" accent="DO IT." sub="Turn an AI idea into a mini productization brief you can take back to work." sameRow />
      <div className="s14__grid">
        <ol className="s14__rows">{[
          ["01", "VALUE", "Increase revenue, decrease cost, or streamline operations?"],
          ["02", "AUTHORITY", "What may AI observe, recommend, prepare, decide, or execute?"],
          ["03", "A.G.E.N.T.S.", "Define controls, evidence, systems, transfer, and success."],
          ["04", "OUTPUT", "Generate a mini productization brief / backlog-ready artifact."],
        ].map(([n, t, b], i) => <li key={n} className={i === 3 ? "is-emphasis" : ""}><span className="num">{n}</span><div><h2>{t}</h2><p>{b}</p></div></li>)}</ol>
        <button type="button" className="s14__sheet" onClick={() => go(14)} aria-label="Open the live productization exercise on the next slide">
          <span className="s14__sheet-head"><small>AI INITIATIVE</small><small>CONFIDENTIAL • DRAFT</small></span>
          <strong>PRODUCTIZATION BRIEF</strong>
          {["OPPORTUNITY", "VALUE", "AUTHORITY", "A.G.E.N.T.S.", "OUTPUT", "NEXT STEPS"].map((f) => <span key={f} className="s14__field"><small>{f}</small><i /></span>)}
          <span className="s14__cta">START THE LIVE EXERCISE <ArrowRight aria-hidden="true" /></span>
        </button>
      </div>
      <Takeaway tone="lime">ARE YOU READY TO <b>PRODUCTIZE YOUR AI?</b></Takeaway>
    </div>,
  },
  // 15 — Embedded exercise
  {
    title: "Embedded apps. Real work.",
    footer: "Useful PM artifact • Not just a quiz result",
    layout: "content",
    render: () => <div className="s15">
      <Title lead="EMBEDDED APPS." accent="REAL WORK." sub="Put live tools, data, and workflows directly in the presentation." sameRow />
      <section className="s15__frame" aria-label="Live PDMA productization exercise">
        <div className="s15__bar" aria-hidden="true"><i /><i /><i /><span>LIVE EXERCISE · CUSTOMER ORDER EXCEPTION AGENT</span></div>
        <div className="s15__viewport" onKeyDown={(event) => event.stopPropagation()}><PdmaScenarioExercise /></div>
      </section>
    </div>,
  },
  // 16 — End card
  {
    title: "Turn AI capability into product value.",
    footer: "Never automate away accountability",
    layout: "content",
    render: () => <div className="s16">
      <Title lead="TURN AI CAPABILITY" accent="INTO PRODUCT VALUE." sub="Start with the business case. Define the authority. Productize the controls. Measure the outcome." />
      <div className="s16__grid">
        <div className="band band--statement"><p>AUTOMATE THE WORK.</p><p><b>NEVER AUTOMATE AWAY ACCOUNTABILITY.</b></p></div>
        <section className="panel panel--white s16__kit">
          <div className="s16__kit-copy">
            <small>FREE TOOLKIT FOR PDMA ATTENDEES</small>
            <h2>A.G.E.N.T.S. PRODUCTIZATION KIT</h2>
            <p>A free worksheet for operationalizing this approach in your enterprise. Take it back to your team.</p>
            <ul>{["DOWNLOAD IT", "USE IT", "ADAPT IT", "FORK IT"].map((a) => <li key={a}>{a}</li>)}</ul>
            <a className="s16__link" href={KIT_URL} target="_blank" rel="noopener noreferrer">github.com/jimmarkunas/<br />agents-enterprise-ai-operating-model</a>
          </div>
          <a className="s16__qr" href={KIT_URL} target="_blank" rel="noopener noreferrer" aria-label="Open the A.G.E.N.T.S. Enterprise AI Operating Model repository on GitHub"><QrCode value={KIT_URL} /></a>
        </section>
      </div>
      <p className="s16__thanks">THANK YOU · <b>QUESTIONS?</b> <span>Jim Markunas · Head of Product, Bytalos</span></p>
    </div>,
  },
];
