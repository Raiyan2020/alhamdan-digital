import { Reveal } from "@/components/motion/Reveal";

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
        <h2 className="text-[42px] font-medium leading-[61px] tracking-[-0.02em] text-[#0d0d0d]">
          {title}
        </h2>
        <p className="mx-auto mt-2 w-[710px] text-[15px] leading-[25px] text-[#777]">
          {body}
        </p>
      </div>
    </Reveal>
  );
}
