import { Reveal } from "@/components/motion/Reveal";
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
      <div data-ar>
        <h2 className="text-3xl font-semibold leading-tight text-[#0d0d0d] sm:text-4xl">
          {title}
        </h2>
        <p className="mt-4 text-base leading-8 text-[#666]">{body}</p>
      </div>
    </Reveal>
  );
}
