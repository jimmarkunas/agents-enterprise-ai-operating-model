import type { HubCard, HubEcosystemTemplateContent } from "@/components/presentation/presentationTypes";
import type { DecorItem } from "./DecorativeLayer";
import { FanConnector } from "@/components/presentation/TemplatePrimitives";
import { ContentCard } from "@/components/presentation/TemplatePrimitives";
import { IconCircle } from "@/components/presentation/TemplatePrimitives";
import { TemplateSlide } from "./TemplateSlide";

/** Row centers for a bank of equal-height rows (row gap lives inside each row). */
const rowCenters = (count: number) => Array.from({ length: count }, (_, index) => ((index + 0.5) / count) * 100);
/** Ports spread evenly around the core's vertical center. */
const portSpread = (count: number, spacing: number) => Array.from({ length: count }, (_, index) => 50 + (index - (count - 1) / 2) * spacing);

function Bank({ cards, tone }: { cards: readonly HubCard[]; tone: "inventory" | "owners" }) {
  return <ul className={`pdmat-hub__bank pdmat-hub__bank--${tone}`}>
    {cards.map((card) => <li key={card.title}>
      <ContentCard tone={tone === "owners" ? "accent" : "neutral"} className="pdmat-hub__card">
        <IconCircle source={card} size={62} iconSize={30} tone={tone === "owners" ? "accent" : "light"} />
        <div><h3>{card.title}</h3><p>{card.body}</p></div>
      </ContentCard>
    </li>)}
  </ul>;
}

/** Inventory bank → native AI / Automation core → owner bank, joined by straight connectors. */
export function HubEcosystemTemplate({ content, decorItems }: { content: HubEcosystemTemplateContent; decorItems?: readonly DecorItem[] }) {
  const { inventory, core, owners, caption } = content;
  const [emphasis, ...rest] = core.label.split(" ");
  return <TemplateSlide kind={content.kind} title={content.chrome.title} decorativeVariant={content.decorativeVariant} decorItems={decorItems}>
    <section className="pdmat-template pdmat-hub">
      <h2 className="pdmat-hub__heading pdmat-hub__heading--inventory">{inventory.heading}</h2>
      <h2 className="pdmat-hub__heading pdmat-hub__heading--core">{core.heading}</h2>
      <h2 className="pdmat-hub__heading pdmat-hub__heading--owners">{owners.heading}</h2>
      <Bank cards={inventory.cards} tone="inventory" />
      <FanConnector side="into-right" from={rowCenters(inventory.cards.length)} to={portSpread(inventory.cards.length, 6)} className="pdmat-hub__fan pdmat-hub__fan--in" />
      <div className="pdmat-hub__core" role="group" aria-label={core.label}>
        <p className="pdmat-hub__core-label">{emphasis === core.emphasis ? <><b>{emphasis}</b> {rest.join(" ")}</> : core.label}</p>
      </div>
      <FanConnector side="out-of-left" from={rowCenters(owners.cards.length)} to={portSpread(owners.cards.length, 0)} className="pdmat-hub__fan pdmat-hub__fan--out" />
      <Bank cards={owners.cards} tone="owners" />
      <p className="pdmat-hub__caption"><span>{caption[0]}</span><b aria-hidden="true">→</b><span>{caption[1]}</span></p>
    </section>
  </TemplateSlide>;
}
