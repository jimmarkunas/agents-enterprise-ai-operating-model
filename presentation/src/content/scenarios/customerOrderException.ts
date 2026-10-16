/** Customer order exception scenario shared by presentation exercise UIs. */
export const customerOrderException = {
      title: "Can You Get This Agent Into Production?",
      name: "Customer Order Exception Agent",
      subtitle: "Redesign the Customer Order Exception Agent and see whether it passes the A.G.E.N.T.S. gate.",
      contextLabel: "Customer Order Exception Agent",
      introLabel: "Foundation Gate",
      introTitle: "Steps 1-3 establish whether the agent can even be evaluated.",
      introBody:
        "The audience is redesigning an eCommerce exception agent that can read order state, change fulfillment, issue customer credits, and notify customers.",
      foundation: {
        systemsQuestion: "Did you inventory your current systems and tools enterprise-wide?",
        systemsNoGoTitle: "NO GO",
        systemsNoGoBody:
          "You cannot evaluate autonomous production controls until the enterprise systems and tools the agent may interact with are understood.",
        ownershipQuestion: "Do these systems and tools have defined owners enterprise-wide?",
        ownershipNoGoTitle: "NO GO",
        ownershipNoGoBody:
          "The systems an agent depends on need accountable owners before autonomous production controls can be evaluated.",
      },
      businessValue: {
        label: "CUSTOMER ORDER EXCEPTION AGENT",
        question: "What is the PRIMARY business value this agent is intended to create?",
        options: ["INCREASE ROI", "DECREASE COST", "INCREASE OPERATIONAL EFFICIENCY"],
        referenceLabel: "REFERENCE CLASSIFICATION",
        referenceValue: "INCREASE OPERATIONAL EFFICIENCY",
        referenceExplanation:
          "Automates high-volume order exceptions and reduces manual intervention in fulfillment resolution.",
        continueLabel: "CONTINUE TO A.G.E.N.T.S.",
      },
      profileLabel: "LIVE DESIGN PROFILE",
      profileFields: ["AUTONOMY", "HUMAN LOAD", "OPERATIONAL RISK"],
      statusLegend: {
        defined: "DEFINED",
        partial: "PARTIAL",
        unclear: "UNCLEAR",
      },
      controls: [
        {
          letter: "A",
          name: "Authority",
          question: "How much authority should the agent have?",
          choices: [
            {
              id: "recommend-only",
              label: "RECOMMEND ONLY",
              description:
                "The agent recommends credits and fulfillment changes. A human executes every action.",
              resultingStatus: "DEFINED",
              tradeoff: "Very controlled, but human execution remains the bottleneck.",
              autonomy: "LOW",
              humanLoad: "HIGH",
              operationalRisk: "LOW",
            },
            {
              id: "bounded-execution",
              label: "BOUNDED EXECUTION",
              description:
                "The agent may issue credits up to $100 and execute approved fulfillment actions. Exceptions above those limits require human approval.",
              resultingStatus: "DEFINED",
              tradeoff: "Autonomous execution exists inside explicit authority limits.",
              autonomy: "HIGH",
              humanLoad: "MODERATE",
              operationalRisk: "LOW",
            },
            {
              id: "broad-execution",
              label: "BROAD EXECUTION",
              description:
                "The agent may execute any customer credit or fulfillment change available through its connected systems, with no transaction limit.",
              resultingStatus: "PARTIAL",
              tradeoff: "Authority is explicit, but material operating bounds are missing.",
              autonomy: "HIGH",
              humanLoad: "LOW",
              operationalRisk: "HIGH",
            },
          ],
        },
        {
          letter: "G",
          name: "Guardrails",
          question: "How should fraud, pricing, and credit rules be enforced?",
          choices: [
            {
              id: "human-approval",
              label: "HUMAN APPROVAL",
              description: "A human approves every action that changes enterprise state.",
              resultingStatus: "DEFINED",
              tradeoff: "Strong control, but much of the automation benefit disappears.",
              autonomy: "LOW",
              humanLoad: "HIGH",
              operationalRisk: "LOW",
            },
            {
              id: "system-enforced-rules",
              label: "SYSTEM-ENFORCED RULES",
              description:
                "Fraud, pricing, and credit limits are enforced outside the model. The agent acts autonomously inside those limits.",
              resultingStatus: "DEFINED",
              tradeoff: "Material rules cannot be bypassed simply by prompting the model differently.",
              autonomy: "HIGH",
              humanLoad: "LOW",
              operationalRisk: "LOW",
            },
            {
              id: "prompt-monitoring",
              label: "PROMPT + MONITORING",
              description:
                "The prompt tells the agent to follow fraud and pricing policy. Violations are reviewed after execution.",
              resultingStatus: "PARTIAL",
              tradeoff: "The policy exists, but the control depends materially on model compliance.",
              autonomy: "HIGH",
              humanLoad: "LOW",
              operationalRisk: "HIGH",
            },
          ],
        },
        {
          letter: "E",
          name: "Evidence",
          question: "What operational record should the agent create?",
          choices: [
            {
              id: "outcome-only",
              label: "OUTCOME ONLY",
              description: "Record only the final customer/order outcome.",
              resultingStatus: "UNCLEAR",
              tradeoff: "The enterprise cannot reconstruct how the autonomous action occurred.",
              operationalRisk: "HIGH",
            },
            {
              id: "action-log",
              label: "ACTION LOG",
              description: "Record tool calls and resulting enterprise state changes.",
              resultingStatus: "PARTIAL",
              tradeoff: "Actions are visible, but the full approval and escalation trail cannot always be reconstructed.",
              operationalRisk: "MODERATE",
            },
            {
              id: "full-record",
              label: "FULL OPERATIONAL RECORD",
              description:
                "Record context, applied rule, decision, tool call, state change, approval or escalation event, and outcome.",
              resultingStatus: "DEFINED",
              tradeoff: "The autonomous operation can be reconstructed without requiring hidden model reasoning.",
              operationalRisk: "LOW",
            },
          ],
        },
        {
          letter: "N",
          name: "Network & Integrations",
          question: "How should the agent access enterprise systems?",
          choices: [
            {
              id: "shared-ops-access",
              label: "SHARED OPERATIONS ACCESS",
              description:
                "The agent uses a shared operations identity with broad CRM, order, billing, and fulfillment permissions.",
              resultingStatus: "PARTIAL",
              tradeoff: "The access path exists, but blast radius and attribution remain too broad.",
              autonomy: "HIGH",
              humanLoad: "LOW",
              operationalRisk: "HIGH",
            },
            {
              id: "dedicated-least-privilege",
              label: "DEDICATED LEAST-PRIVILEGE IDENTITY",
              description:
                "The agent receives its own identity with least-privilege roles in each connected system.",
              resultingStatus: "DEFINED",
              tradeoff: "Access is attributable and bounded by system permissions.",
              autonomy: "HIGH",
              humanLoad: "LOW",
              operationalRisk: "MODERATE",
            },
            {
              id: "scoped-capabilities",
              label: "SCOPED CAPABILITIES",
              description:
                "The agent receives only specific approved capabilities such as Read Order, Issue Credit <= $100, Create Case, and Schedule Shipment.",
              resultingStatus: "DEFINED",
              tradeoff: "The agent receives capabilities rather than blanket system access.",
              autonomy: "HIGH",
              humanLoad: "LOW",
              operationalRisk: "LOW",
            },
          ],
        },
        {
          letter: "T",
          name: "Transfer & Escalation",
          question: "What happens when the agent cannot continue safely?",
          choices: [
            {
              id: "alert-and-restart",
              label: "ALERT AND RESTART",
              description: "The agent stops and alerts a human. The human investigates and restarts the work manually.",
              resultingStatus: "PARTIAL",
              tradeoff: "Escalation exists, but the human inherits the problem rather than the work.",
              humanLoad: "HIGH",
              operationalRisk: "MODERATE",
            },
            {
              id: "stateful-handoff",
              label: "STATEFUL HANDOFF",
              description:
                "The agent creates a handoff containing current state, prior actions, evidence, and escalation reason so the human can continue.",
              resultingStatus: "DEFINED",
              tradeoff: "The human inherits the work instead of reconstructing it.",
              humanLoad: "MODERATE",
              operationalRisk: "LOW",
            },
            {
              id: "routed-handoff",
              label: "ROUTED STATEFUL HANDOFF",
              description:
                "The full handoff package is transferred to the correct owner automatically with defined routing and response expectations.",
              resultingStatus: "DEFINED",
              tradeoff: "Stateful escalation is operationalized rather than merely documented.",
              humanLoad: "LOW",
              operationalRisk: "LOW",
            },
          ],
        },
        {
          letter: "S",
          name: "Success & Accountability",
          question: "Who owns whether this agent should continue operating?",
          choices: [
            {
              id: "engineering-owns-it",
              label: "ENGINEERING OWNS IT",
              description:
                "Engineering owns uptime and technical accuracy. No business or operational owner is named.",
              resultingStatus: "PARTIAL",
              tradeoff: "Technical performance is owned, but the business outcome and operational risk are not.",
              operationalRisk: "MODERATE",
            },
            {
              id: "named-operations-owner",
              label: "NAMED OPERATIONS OWNER",
              description:
                "An Operations Lead owns the agent and monitors outcome, accuracy, risk, and cost.",
              resultingStatus: "DEFINED",
              tradeoff: "Execution can be delegated, but accountability remains explicit.",
              operationalRisk: "LOW",
            },
            {
              id: "product-ops-governance",
              label: "PRODUCT + OPERATIONS GOVERNANCE",
              description:
                "Named Product and Operations owners monitor outcome, risk, cost, and predefined rollback or continuation thresholds.",
              resultingStatus: "DEFINED",
              tradeoff: "Ownership includes explicit conditions for whether the agent should remain in production.",
              operationalRisk: "LOW",
            },
          ],
        },
      ],
      result: {
        titleLabel: "PRODUCTION DECISION",
        decisionLabel: "YOUR OPERATING PROFILE",
        discussionPrompt:
          "DOES THIS OPERATING MODEL ACTUALLY SUPPORT THE BUSINESS VALUE YOU CHOSE?",
        resetLabel: "RESET CHALLENGE",
      },
      rounds: [
        {
          letter: "A",
          name: "Authority",
          evidence:
            "The agent may issue customer credits up to $100. Anything above $100 requires human approval.",
          reference: "DEFINED",
          reason: "Authority is explicitly bounded by a transaction limit and approval threshold.",
        },
        {
          letter: "G",
          name: "Guardrails",
          evidence:
            "Fraud flags and pricing restrictions are enforced outside the model. The agent cannot override them through prompting.",
          reference: "DEFINED",
          reason:
            "Material controls are mechanically enforced by the surrounding system, not merely expressed through prompt instructions.",
        },
        {
          letter: "E",
          name: "Evidence",
          evidence:
            "Tool calls and enterprise state changes are logged, but human approval events are not consistently captured.",
          reference: "PARTIAL",
          reason:
            "The operational record exists, but the approval trail cannot yet be completely reconstructed.",
        },
        {
          letter: "N",
          name: "Network & Integrations",
          evidence:
            "The agent can read order and inventory data. Write access is limited to approved credit and case-management capabilities.",
          reference: "DEFINED",
          reason: "The agent receives scoped capabilities rather than blanket administrative access.",
        },
        {
          letter: "T",
          name: "Transfer & Escalation",
          evidence:
            "The agent can stop and alert a human, but the team has not demonstrated that the human receives the full working state, prior actions, evidence, and escalation reason.",
          reference: "UNCLEAR",
          reason:
            "The escalation path exists, but a stateful handoff has not been demonstrated.",
        },
        {
          letter: "S",
          name: "Success & Accountability",
          evidence:
            "An Operations Lead owns the agent, with outcome, accuracy, risk, and cost used to evaluate continued operation.",
          reference: "DEFINED",
          reason: "Operational ownership and success measures are explicit.",
        },
      ],
} as const;
