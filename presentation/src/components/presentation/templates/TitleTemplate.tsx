import type { TitleTemplateContent } from "@/components/presentation/presentationTypes";
import { TemplateSlide } from "./TemplateSlide";

export function TitleTemplate({ content }: { content: TitleTemplateContent }) {
  const { speaker } = content;
  return <TemplateSlide kind={content.kind} title={content.chrome.title} decorativeVariant={content.decorativeVariant}>
    <section className="pdmat-template pdmat-title">
      <div className="pdmat-title__speaker">
        <i className="pdmat-title__rule" aria-hidden="true" />
        <strong className="pdmat-title__name">{speaker.name}</strong>
        <span className="pdmat-title__role">{speaker.role}</span>
      </div>
    </section>
  </TemplateSlide>;
}
