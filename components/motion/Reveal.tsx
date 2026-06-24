"use client";

import {
  Children,
  cloneElement,
  isValidElement,
  useEffect,
  useState,
  type ComponentPropsWithoutRef,
  type ReactElement,
  type ReactNode,
} from "react";
import {
  motion,
  useReducedMotion,
  type Transition,
} from "motion/react";
import {
  getRevealTransition,
  getStaggerTransition,
  getViewportOptions,
  motionItemVariants,
  staggerContainerVariants,
  type MotionRevealVariant,
} from "@/lib/motion/variants";

export type RevealVariant = MotionRevealVariant;

type MotionRevealTags = keyof Pick<
  typeof motion,
  "div" | "section" | "article" | "ul" | "li" | "span" | "header" | "footer" | "p" | "h1" | "h2" | "h3" | "a"
>;

type RevealProps = {
  as?: MotionRevealTags;
  children?: ReactNode;
  className?: string;
  style?: ComponentPropsWithoutRef<"div">["style"];
  delay?: number;
  variant?: RevealVariant;
  immediate?: boolean;
  id?: string;
};

type RevealMotionProps = {
  id?: string;
  className?: string;
  style?: ComponentPropsWithoutRef<"div">["style"];
  variants?: (typeof motionItemVariants)[RevealVariant];
  initial: false | "hidden";
  animate?: "visible";
  whileInView?: "visible";
  viewport?: ReturnType<typeof getViewportOptions>;
  transition: Transition;
  children?: ReactNode;
};

function RevealMotion({
  as = "div",
  ...props
}: RevealMotionProps & { as?: MotionRevealTags }) {
  switch (as) {
    case "section":
      return <motion.section {...props} />;
    case "article":
      return <motion.article {...props} />;
    case "ul":
      return <motion.ul {...props} />;
    case "li":
      return <motion.li {...props} />;
    case "span":
      return <motion.span {...props} />;
    case "header":
      return <motion.header {...props} />;
    case "footer":
      return <motion.footer {...props} />;
    case "p":
      return <motion.p {...props} />;
    case "h1":
      return <motion.h1 {...props} />;
    case "h2":
      return <motion.h2 {...props} />;
    case "h3":
      return <motion.h3 {...props} />;
    case "a":
      return <motion.a {...props} />;
    default:
      return <motion.div {...props} />;
  }
}

export function Reveal({
  as = "div",
  children,
  className,
  style,
  delay = 0,
  variant = "reveal",
  immediate = false,
  id,
}: RevealProps) {
  const reducedMotion = useReducedMotion();
  const [mobile, setMobile] = useState(false);
  const variants = motionItemVariants[variant];
  const transition = getRevealTransition(variant, delay);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const update = () => setMobile(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  const viewport = getViewportOptions(variant, mobile);

  const motionProps: Omit<RevealMotionProps, "children" | "as"> = reducedMotion
    ? { initial: false, transition }
    : immediate
      ? {
          initial: "hidden",
          animate: "visible",
          transition,
          variants,
        }
      : {
          initial: "hidden",
          whileInView: "visible",
          viewport,
          transition,
          variants,
        };

  return (
    <RevealMotion as={as} id={id} className={className} style={style} {...motionProps}>
      {children}
    </RevealMotion>
  );
}

type StaggerProps = {
  children: ReactNode;
  className?: string;
  staggerMs?: number;
  variant?: RevealVariant;
  as?: Extract<MotionRevealTags, "div" | "section" | "ul">;
  /** -1 = last child first (RTL wave across columns) */
  staggerDirection?: 1 | -1;
  delayChildrenMs?: number;
};

export function Stagger({
  children,
  className,
  staggerMs = 70,
  variant = "fade-up",
  as: Wrapper = "div",
  staggerDirection,
  delayChildrenMs = 0,
}: StaggerProps) {
  const reducedMotion = useReducedMotion();
  const [mobile, setMobile] = useState(false);
  const items = Children.toArray(children);
  const itemVariants = motionItemVariants[variant];
  const viewport = getViewportOptions(variant, mobile);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const update = () => setMobile(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  const containerTransition: Transition = {
    ...getStaggerTransition(staggerMs, { staggerDirection, delayChildrenMs }),
    ...getRevealTransition(variant),
  };

  const containerProps = {
    className,
    variants: reducedMotion ? undefined : staggerContainerVariants,
    initial: reducedMotion ? false : ("hidden" as const),
    whileInView: reducedMotion ? undefined : ("visible" as const),
    viewport,
    transition: containerTransition,
  };

  const wrappedItems = items.map((child, index) => {
    if (!isValidElement(child)) return child;

    return cloneElement(child as ReactElement<Record<string, unknown>>, {
      key: child.key ?? index,
      variants: reducedMotion ? undefined : itemVariants,
      transition: getRevealTransition(variant),
    });
  });

  if (Wrapper === "section") {
    return <motion.section {...containerProps}>{wrappedItems}</motion.section>;
  }

  if (Wrapper === "ul") {
    return <motion.ul {...containerProps}>{wrappedItems}</motion.ul>;
  }

  return <motion.div {...containerProps}>{wrappedItems}</motion.div>;
}
