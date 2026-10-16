"use client";

import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { useGuidedExerciseFlow } from "@/components/exercise/useGuidedExerciseFlow";
import {
  SCENARIO_STEP_COUNT,
  getControlStatusTitle,
  getDecisionFromState,
  getOperatingProfile,
  initialState,
  scenario,
  type FoundationAnswer,
  type ScenarioState,
} from "@/components/exercise/customerOrderExceptionScenario";
import { briefCopy, briefToText, buildProductizationBrief, formatCondition } from "./productizationBrief";
import "./pdmaScenarioExercise.css";

/*
 * PDMA exercise: the exact Secure Carolinas "Customer Order Exception Agent" challenge
 * (9 steps, same data, same rules via customerOrderExceptionScenario) in the PDMA/PBDS skin,
 * plus one post-result productization brief. Bounded app UI only — the host (Slide 15's
 * EmbeddedAppFrame, the template gallery, or /pdma2026/exercise) owns all outer chrome.
 */

// Step identity labels, as shown in the Secure Carolinas working header.
const foundationLabels = [["SYSTEMS", "Inventory", "Enterprise foundation check"], ["OWNERSHIP", "Defined", "Ownership check"], ["VALUE", "Target", "Business value target"]] as const;
const controlDescriptors = ["Decision rights", "Guardrail rules", "Audit trail", "System access", "Escalation path", "Outcome ownership"] as const;
const challenge = {
  eyebrow: "Audience challenge",
  assessment: "Assessment",
  assessmentDetail: "9 steps · guided challenge",
  heading: "The Challenge",
  lead: "Test your agent’s controls + the foundation beneath them.",
  start: "Start Challenge",
  foundationAnswer: "Foundation answer",
  valueTarget: "Value target",
  blocker: "FOUNDATION BLOCKER",
  resultingStatus: "Resulting status",
  back: "Back",
  next: "Next Step",
  continueToAgents: "Continue to A.G.E.N.T.S.",
  seeDecision: "See Production Decision",
  final: "FINAL",
  production: "PRODUCTION",
  decision: "Decision",
  foundationInventory: "Foundation inventory",
  definedOwnership: "Defined ownership",
  selectedValue: "Selected business value",
} as const;

type ResultView = "decision" | "brief";

function StepHeader({ number, label, suffix, descriptor, note }: { number: string; label: string; suffix: string; descriptor: string; note?: string }) {
  return <header className="pdmax__header">
    <div className="pdmax__scenario">
      <p className="pdmax__eyebrow">{challenge.eyebrow} <b>·</b> <span>{scenario.name}</span></p>
      <h2 className="pdmax__title">{scenario.title}</h2>
      <p className="pdmax__subtitle">{scenario.subtitle}</p>
    </div>
    <div className="pdmax__identity">
      <span className="pdmax__step">{number}</span>
      <div>
        <p className="pdmax__identity-name"><em>{label}</em> {suffix}</p>
        <p className="pdmax__identity-descriptor">{descriptor}</p>
        {note && <p className="pdmax__identity-note">{note}</p>}
      </div>
    </div>
  </header>;
}

export function PdmaScenarioExercise() {
  const [state, setState] = useState<ScenarioState>(initialState);
  const [resultView, setResultView] = useState<ResultView>("decision");
  const [copyStatus, setCopyStatus] = useState<string>(briefCopy.copyAction);
  const flow = useGuidedExerciseFlow({ stepCount: SCENARIO_STEP_COUNT, onReset: () => { setState(initialState); setResultView("decision"); setCopyStatus(briefCopy.copyAction); } });
  const { view, stepIndex } = flow;
  const currentControl = stepIndex >= 3 ? scenario.controls[stepIndex - 3] : undefined;
  const currentControlSelection = currentControl ? state.selections[currentControl.letter] : undefined;
  const decision = getDecisionFromState(state);
  const operatingProfile = getOperatingProfile(state);
  const brief = useMemo(() => buildProductizationBrief(state), [state]);
  // Frame changes unmount the pressed button; keep focus in the app so deck arrow keys stay isolated.
  const rootRef = useRef<HTMLElement>(null);
  const frameKey = view === "intro" ? "intro" : view === "result" ? resultView : `step-${stepIndex}`;
  useLayoutEffect(() => {
    const root = rootRef.current;
    const active = document.activeElement;
    if (root && (!active || active === document.body) && root.dataset.engaged) root.focus({ preventScroll: true });
  }, [frameKey]);
  const rootProps = { ref: rootRef, tabIndex: -1, onPointerDown: () => { if (rootRef.current) rootRef.current.dataset.engaged = "true"; }, onKeyDown: () => { if (rootRef.current) rootRef.current.dataset.engaged = "true"; } };
  const readyForCurrentStep = stepIndex === 0
    ? state.systemsInventory !== null
    : stepIndex === 1
      ? state.ownershipDefined !== null
      : stepIndex === 2
        ? state.businessValue !== null
        : Boolean(currentControlSelection);
  const isFoundationBlocked = (stepIndex === 0 && state.systemsInventory === "NO") || (stepIndex === 1 && state.ownershipDefined === "NO");
  const canGoNext = readyForCurrentStep && !isFoundationBlocked;
  const foundationAnswer = stepIndex === 0 ? state.systemsInventory : state.ownershipDefined;

  const updateFoundation = (answer: Exclude<FoundationAnswer, null>) => {
    if (stepIndex === 0) setState((current) => ({ ...current, systemsInventory: answer }));
    if (stepIndex === 1) setState((current) => ({ ...current, ownershipDefined: answer }));
  };

  const copyBrief = async () => {
    try {
      await navigator.clipboard.writeText(briefToText(brief));
      setCopyStatus(briefCopy.copied);
      window.setTimeout(() => setCopyStatus(briefCopy.copyAction), 1600);
    } catch {
      setCopyStatus(briefCopy.copyUnavailable);
    }
  };

  if (view === "intro") {
    return <section {...rootProps} className="pdmax pdmax--intro" aria-labelledby="pdmax-title" data-frame="intro">
      <header className="pdmax__intro-head">
        <div>
          <p className="pdmax__eyebrow">{challenge.eyebrow}</p>
          <h2 id="pdmax-title" className="pdmax__intro-title">{scenario.title}</h2>
          <p className="pdmax__intro-name">{scenario.name}</p>
          <p className="pdmax__subtitle">{scenario.subtitle}</p>
        </div>
        <div className="pdmax__badge"><span>{challenge.assessment}</span><strong>{challenge.assessmentDetail}</strong></div>
      </header>
      <div className="pdmax__intro-body">
        <p className="pdmax__intro-kicker">{challenge.heading}</p>
        <p className="pdmax__intro-lead">{challenge.lead}</p>
        <button type="button" className="pdmax__button is-primary pdmax__start" onClick={flow.start}>{challenge.start} <span aria-hidden="true">→</span></button>
      </div>
    </section>;
  }

  if (view === "result" && resultView === "brief") {
    return <section {...rootProps} className="pdmax pdmax--brief" aria-labelledby="pdmax-brief-title" data-frame="brief" data-decision={brief.decision}>
      <header className="pdmax__brief-head">
        <div>
          <p className="pdmax__eyebrow">PDMA 2026 <b>·</b> <span aria-label={`${briefCopy.sections.agent}: ${brief.agent}`}>{brief.agent}</span></p>
          <h2 id="pdmax-brief-title" className="pdmax__title">{briefCopy.title}</h2>
        </div>
        <p className="pdmax__decision-chip" data-decision={brief.decision} aria-label={`${briefCopy.sections.decision}: ${brief.decision}`}>{brief.decision}</p>
      </header>
      <div className="pdmax__brief-body">
        <dl className="pdmax__brief-rail">
          <div><dt>{briefCopy.sections.foundation}</dt><dd className="pdmax__pairs">{brief.foundation.map(({ label, answer }) => <span key={label}>{label}<b>{answer}</b></span>)}</dd></div>
          <div><dt>{briefCopy.sections.value}</dt><dd>{brief.businessValue}</dd></div>
          <div><dt>{briefCopy.sections.profile}</dt><dd className="pdmax__profile-inline">{brief.profile.map(({ field, value }) => <span key={field}><small>{field}</small><b>{value}</b></span>)}</dd></div>
          <div><dt>{briefCopy.sections.conditions}</dt><dd><ul className="pdmax__conditions">{brief.conditions.length ? brief.conditions.map((condition) => <li key={condition.item} data-status={condition.status}>{formatCondition(condition)}</li>) : <li>{briefCopy.allClear}</li>}</ul></dd></div>
          <div><dt>{briefCopy.sections.nextStep}</dt><dd className="pdmax__next-step">{brief.nextStep}</dd></div>
        </dl>
        <section className="pdmax__brief-controls" aria-label={briefCopy.sections.controls}>
          <p className="pdmax__label">{briefCopy.sections.controls}</p>
          <ol>{brief.controls.map((control) => <li key={control.letter} data-status={control.status}>
            <b className="pdmax__brief-letter">{control.letter}</b>
            <span className="pdmax__brief-choice"><small>{control.name}</small><strong>{control.choice}</strong></span>
            <span className="pdmax__status">{control.status}</span>
            <p className="pdmax__brief-text">{control.description} <span>{control.tradeoff}</span></p>
          </li>)}</ol>
        </section>
      </div>
      <footer className="pdmax__footer">
        <button type="button" className="pdmax__button" onClick={() => setResultView("decision")}>← {briefCopy.backToDecision}</button>
        <button type="button" className="pdmax__button" onClick={flow.reset}>{scenario.result.resetLabel}</button>
        <button type="button" className="pdmax__button is-primary" onClick={copyBrief}>{copyStatus}</button>
      </footer>
    </section>;
  }

  if (view === "result") {
    return <section {...rootProps} className="pdmax pdmax--result" aria-labelledby="pdmax-title" data-frame="decision" data-decision={decision}>
      <StepHeader number={challenge.final} label={challenge.production} suffix={challenge.decision} descriptor={decision} />
      <div className="pdmax__stage pdmax__result">
        <div className="pdmax__facts">
          <div><p className="pdmax__label">{challenge.foundationInventory}</p><p className="pdmax__fact">{state.systemsInventory}</p></div>
          <div><p className="pdmax__label">{challenge.definedOwnership}</p><p className="pdmax__fact">{state.ownershipDefined}</p></div>
          <div><p className="pdmax__label">{challenge.selectedValue}</p><p className="pdmax__fact">{state.businessValue ?? "—"}</p></div>
        </div>
        <div className="pdmax__result-grid">
          <ul className="pdmax__statuses">{scenario.controls.map((control) => {
            const status = state.selections[control.letter]?.resultingStatus ?? "UNCLEAR";
            return <li key={control.letter} data-status={status}><p className="pdmax__label">{control.letter} · {control.name}</p><p className="pdmax__tile-value">{getControlStatusTitle(status)}</p></li>;
          })}</ul>
          <ul className="pdmax__profile">{operatingProfile.map((item) => <li key={item.field}><p className="pdmax__label">{item.field}</p><p className="pdmax__tile-value">{item.value}</p></li>)}</ul>
        </div>
      </div>
      <footer className="pdmax__footer">
        <button type="button" className="pdmax__button" onClick={flow.reset}>{scenario.result.resetLabel}</button>
        <button type="button" className="pdmax__button is-primary" onClick={() => setResultView("brief")}>{briefCopy.buildAction} <span aria-hidden="true">→</span></button>
      </footer>
    </section>;
  }

  const [label, suffix, descriptor] = stepIndex < 3 ? foundationLabels[stepIndex] : [currentControl?.letter ?? "", currentControl?.name ?? "", controlDescriptors[stepIndex - 3]];
  const question = stepIndex === 0 ? scenario.foundation.systemsQuestion : stepIndex === 1 ? scenario.foundation.ownershipQuestion : stepIndex === 2 ? scenario.businessValue.question : currentControl?.question ?? "";
  return <section {...rootProps} className={`pdmax pdmax--step${stepIndex >= 3 ? " pdmax--control" : ""}`} aria-labelledby="pdmax-question" data-frame={`step-${stepIndex + 1}`}>
    <StepHeader number={String(stepIndex + 1).padStart(2, "0")} label={label} suffix={suffix} descriptor={descriptor} note={stepIndex >= 3 ? scenario.profileLabel : undefined} />
    <div className="pdmax__stage">
      <p id="pdmax-question" className="pdmax__question">{question}</p>
      {stepIndex <= 1 ? <fieldset className="pdmax__fieldset">
        <legend className="pdmax__sr">{stepIndex === 0 ? "Systems inventory answer" : "Ownership answer"}</legend>
        <div className="pdmax__choices pdmax__choices--2">
          {(["YES", "NO"] as const).map((answer) => <button key={answer} type="button" aria-pressed={foundationAnswer === answer} className="pdmax__choice pdmax__choice--answer" onClick={() => updateFoundation(answer)}>
            <span className="pdmax__label">{challenge.foundationAnswer}</span><strong>{answer}</strong>
          </button>)}
        </div>
        {foundationAnswer === "NO" && <div className="pdmax__blocker" role="status">
          <p className="pdmax__blocker-label">{challenge.blocker}</p>
          <p className="pdmax__blocker-decision">{stepIndex === 0 ? scenario.foundation.systemsNoGoTitle : scenario.foundation.ownershipNoGoTitle}</p>
          <p className="pdmax__blocker-body">{stepIndex === 0 ? scenario.foundation.systemsNoGoBody : scenario.foundation.ownershipNoGoBody}</p>
        </div>}
      </fieldset> : stepIndex === 2 ? <fieldset className="pdmax__fieldset">
        <legend className="pdmax__sr">Business value targets</legend>
        <div className="pdmax__choices pdmax__choices--3">
          {scenario.businessValue.options.map((value) => <button key={value} type="button" aria-pressed={state.businessValue === value} className="pdmax__choice pdmax__choice--answer" onClick={() => setState((current) => ({ ...current, businessValue: value }))}>
            <span className="pdmax__label">{challenge.valueTarget}</span><strong>{value}</strong>
          </button>)}
        </div>
      </fieldset> : currentControl ? <fieldset className="pdmax__fieldset">
        <legend className="pdmax__sr">{`${currentControl.name} choices`}</legend>
        <div className="pdmax__choices pdmax__choices--3">
          {currentControl.choices.map((choice) => <button key={choice.id} type="button" aria-pressed={currentControlSelection?.id === choice.id} className="pdmax__choice pdmax__choice--control" onClick={() => setState((current) => ({ ...current, selections: { ...current.selections, [currentControl.letter]: choice } }))}>
            <strong>{choice.label}</strong><span>{choice.description}</span>
          </button>)}
        </div>
        {currentControlSelection && <div className="pdmax__status-panel" role="status" data-status={currentControlSelection.resultingStatus}>
          <p className="pdmax__label">{challenge.resultingStatus}</p>
          <p className="pdmax__status-value">{currentControlSelection.resultingStatus}</p>
          <p className="pdmax__tradeoff">{currentControlSelection.tradeoff}</p>
        </div>}
      </fieldset> : null}
    </div>
    <footer className="pdmax__footer">
      <button type="button" className="pdmax__button" onClick={flow.back} disabled={flow.isFirstStep}>{challenge.back}</button>
      <button type="button" className="pdmax__button is-primary" onClick={flow.next} disabled={!canGoNext}>{isFoundationBlocked ? challenge.blocker : stepIndex === 2 ? challenge.continueToAgents : flow.isLastStep ? challenge.seeDecision : challenge.next}</button>
    </footer>
  </section>;
}
