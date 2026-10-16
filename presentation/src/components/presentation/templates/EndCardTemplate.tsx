import type { EndCardTemplateContent } from "@/components/presentation/presentationTypes";
import { DownloadModule } from "@/components/presentation/TemplatePrimitives";
import { TemplateSlide } from "./TemplateSlide";

export function EndCardTemplate({ content }: { content: EndCardTemplateContent }) {
  const { statement, download } = content;
  return <TemplateSlide kind={content.kind} title={content.chrome.title} decorativeVariant={content.decorativeVariant}>
    <section className="pdmat-template pdmat-endcard">
      <div className="pdmat-endcard__statement">
        <i className="pdmat-endcard__rule" aria-hidden="true" />
        <p><span>{statement.lead}</span><em>{statement.emphasis}</em></p>
      </div>
      <DownloadModule download={download} />
    </section>
  </TemplateSlide>;
}
