"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import { useTranslations } from "next-intl";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Heading2,
  Heading3,
  Italic,
  Link2,
  List,
  ListOrdered,
  Minus,
  Quote,
  Redo2,
  Strikethrough,
  Underline as UnderlineIcon,
  Undo2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type RichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
  dir?: "rtl" | "ltr";
  className?: string;
  id?: string;
  "aria-describedby"?: string;
  "aria-invalid"?: boolean;
};

type ToolbarButtonProps = {
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
};

function ToolbarButton({ label, active, disabled, onClick, children }: ToolbarButtonProps) {
  return (
    <Button
      type="button"
      variant="outline"
      size="icon-sm"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "size-8 shrink-0",
        active && "border-brand/40 bg-brand/10 text-brand",
      )}
    >
      {children}
    </Button>
  );
}

function ToolbarDivider() {
  return <div className="mx-0.5 hidden h-6 w-px bg-border sm:block" aria-hidden />;
}

export function RichTextEditor({
  value,
  onChange,
  dir = "ltr",
  className,
  id,
  "aria-describedby": ariaDescribedBy,
  "aria-invalid": ariaInvalid,
}: RichTextEditorProps) {
  const t = useTranslations("cms.editor");

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        codeBlock: false,
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        protocols: ["http", "https", "mailto", "tel"],
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Placeholder.configure({
        placeholder: t("placeholder"),
      }),
    ],
    content: value,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "min-h-40 rounded-b-xl border border-t-0 border-input bg-background px-4 py-3 text-sm leading-7 outline-none focus-visible:ring-2 focus-visible:ring-ring/40 prose prose-sm max-w-none dark:prose-invert [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:ps-6 [&_ol]:ps-6 [&_blockquote]:border-s-4 [&_blockquote]:border-border [&_blockquote]:ps-4 [&_blockquote]:text-muted-foreground",
        dir,
      },
    },
    onUpdate({ editor: currentEditor }) {
      onChange(currentEditor.getHTML());
    },
  });

  function setLink() {
    if (!editor) return;
    const previous = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt(t("linkPrompt"), previous ?? "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }

  if (!editor) return null;

  return (
    <div
      id={id}
      data-slot="editor-shell"
      aria-describedby={ariaDescribedBy}
      aria-invalid={ariaInvalid}
      className={cn(
        "overflow-hidden rounded-xl border border-input bg-background transition-colors",
        ariaInvalid && "border-destructive ring-3 ring-destructive/20",
        className,
      )}
    >
      <div className="flex flex-wrap items-center gap-1 border-b border-input bg-muted/30 p-2">
        <ToolbarButton
          label={t("bold")}
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton
          label={t("italic")}
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton
          label={t("underline")}
          active={editor.isActive("underline")}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <UnderlineIcon className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton
          label={t("strike")}
          active={editor.isActive("strike")}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <Strikethrough className="size-3.5" />
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton
          label={t("heading2")}
          active={editor.isActive("heading", { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          <Heading2 className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton
          label={t("heading3")}
          active={editor.isActive("heading", { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          <Heading3 className="size-3.5" />
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton
          label={t("bulletList")}
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton
          label={t("orderedList")}
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton
          label={t("blockquote")}
          active={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <Quote className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton
          label={t("divider")}
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          <Minus className="size-3.5" />
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton label={t("link")} active={editor.isActive("link")} onClick={setLink}>
          <Link2 className="size-3.5" />
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton
          label={t("alignStart")}
          active={editor.isActive({ textAlign: dir === "rtl" ? "right" : "left" })}
          onClick={() =>
            editor.chain().focus().setTextAlign(dir === "rtl" ? "right" : "left").run()
          }
        >
          {dir === "rtl" ? <AlignRight className="size-3.5" /> : <AlignLeft className="size-3.5" />}
        </ToolbarButton>
        <ToolbarButton
          label={t("alignCenter")}
          active={editor.isActive({ textAlign: "center" })}
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
        >
          <AlignCenter className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton
          label={t("alignEnd")}
          active={editor.isActive({ textAlign: dir === "rtl" ? "left" : "right" })}
          onClick={() =>
            editor.chain().focus().setTextAlign(dir === "rtl" ? "left" : "right").run()
          }
        >
          {dir === "rtl" ? <AlignLeft className="size-3.5" /> : <AlignRight className="size-3.5" />}
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton
          label={t("undo")}
          disabled={!editor.can().undo()}
          onClick={() => editor.chain().focus().undo().run()}
        >
          <Undo2 className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton
          label={t("redo")}
          disabled={!editor.can().redo()}
          onClick={() => editor.chain().focus().redo().run()}
        >
          <Redo2 className="size-3.5" />
        </ToolbarButton>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
