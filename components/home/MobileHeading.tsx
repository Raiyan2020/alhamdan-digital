import { Reveal } from "@/components/motion/Reveal";
import { RichTextHtml } from "@/lib/cms/rich-text";
import { cn } from "@/lib/utils";

type MobileHeadingProps = {
  title: string;
  body: string;
  className?: string;
};

export function MobileHeading({ title, body, className }: MobileHeadingProps) {
  return (
    <Reveal
      variant="section-heading"
      className={cn("mx-auto max-w-2xl px-5 text-center", className)}
    >
      <div className="flex flex-col items-center">
        <h2 className="text-center text-3xl font-semibold leading-tight text-ink sm:text-4xl">
          {title}
        </h2>
        <RichTextHtml html={body} className="mt-4 text-center text-base leading-8 text-ink-neutral" />
      </div>
    </Reveal>
  );
}
