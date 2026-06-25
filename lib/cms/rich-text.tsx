import sanitizeHtml from "sanitize-html";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { BilingualText, CmsRichText } from "./types";

const allowedTags = [
  "p",
  "br",
  "strong",
  "em",
  "u",
  "s",
  "del",
  "strike",
  "a",
  "ul",
  "ol",
  "li",
  "h2",
  "h3",
  "blockquote",
  "hr",
];

const allowedAttributes: sanitizeHtml.IOptions["allowedAttributes"] = {
  a: ["href", "target", "rel"],
  p: ["style"],
  h2: ["style"],
  h3: ["style"],
};

export function sanitizeRichHtml(html: string) {
  return sanitizeHtml(html, {
    allowedTags,
    allowedAttributes,
    allowedStyles: {
      "*": {
        "text-align": [/^left$/, /^right$/, /^center$/, /^justify$/],
      },
    },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", {
        rel: "noopener noreferrer",
      }),
    },
  });
}

export function textToRichHtml(text: string) {
  const paragraphs = text
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph) => `<p>${escapeHtml(paragraph).replace(/\n/g, "<br />")}</p>`);

  return sanitizeRichHtml(paragraphs.join(""));
}

export function makeRichText(text: BilingualText): CmsRichText {
  return {
    json: text,
    html: {
      ar: textToRichHtml(text.ar),
      en: textToRichHtml(text.en),
    },
  };
}

export function localizeRichText(richText: CmsRichText, locale: keyof BilingualText) {
  return richText.html[locale];
}

export function RichTextHtml({
  html,
  className,
  fallback,
}: {
  html: string;
  className?: string;
  fallback?: ReactNode;
}) {
  const safeHtml = sanitizeRichHtml(html);

  if (!safeHtml && fallback) {
    return <>{fallback}</>;
  }

  return (
    <div
      className={cn(
        "[&>p]:mb-4 [&>p:last-child]:mb-0 [&_a]:underline [&_a]:underline-offset-4",
        className,
      )}
      dangerouslySetInnerHTML={{ __html: safeHtml }}
    />
  );
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
