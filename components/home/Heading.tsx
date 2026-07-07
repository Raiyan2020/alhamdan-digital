import { Reveal } from "@/components/motion/Reveal";
import { RichTextHtml } from "@/lib/cms/rich-text";

type HeadingProps = {
  title: string;
  body: string;
  y?: number;
  /** Use inside inset sections (e.g. products card) instead of full canvas width. */
  contained?: boolean;
};

export function Heading({ title, body, y, contained }: HeadingProps) {
  const isAbsolute = y !== undefined;
  return (
    <Reveal
      as="div"
      variant="section-heading"
      className={
        isAbsolute
          ? `absolute left-0 w-full text-center ${contained ? "" : ""}`
          : `relative w-full text-center ${contained ? "" : ""}`
      }
      style={isAbsolute ? { top: y } : undefined}
    >
      <div className="flex flex-col items-center">
        <h2 className="w-full text-center text-[42px] font-medium leading-[61px] tracking-[-0.02em] text-ink">
          {title}
        </h2>
        <RichTextHtml
          html={body}
          className="mx-auto mt-2 w-full max-w-[710px] text-center text-[15px] leading-[25px] text-ink-muted"
        />
      </div>
    </Reveal>
  );
}
