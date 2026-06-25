import { Reveal } from "@/components/motion/Reveal";
import { RichTextHtml } from "@/lib/cms/rich-text";

type HeadingProps = {
  title: string;
  body: string;
  y: number;
  /** Use inside inset sections (e.g. products card) instead of full canvas width. */
  contained?: boolean;
};

export function Heading({ title, body, y, contained }: HeadingProps) {
  return (
    <Reveal
      as="div"
      variant="section-heading"
      className={
        contained
          ? "absolute left-0 w-full text-center"
          : "absolute left-0 w-[1440px] text-center"
      }
      style={{ top: y }}
    >
      <div data-ar>
        <h2 className="text-[42px] font-medium leading-[61px] tracking-[-0.02em] text-ink">
          {title}
        </h2>
        <RichTextHtml
          html={body}
          className="mx-auto mt-2 w-[710px] text-[15px] leading-[25px] text-ink-muted"
        />
      </div>
    </Reveal>
  );
}
