"use client";

import React, { useRef, useEffect, useCallback } from "react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Link as LinkIcon,
  Table as TableIcon,
  Upload,
  Image as ImageIcon,
  RotateCcw,
  RotateCw,
} from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Please provide details, instructions, tables, or images for this form...",
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync value from props to contentEditable element
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      // Only update if fundamentally different to avoid moving cursor
      if (document.activeElement !== editorRef.current) {
        editorRef.current.innerHTML = value || "";
      }
    }
  }, [value]);

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  const exec = (command: string, arg: string | undefined = undefined) => {
    document.execCommand(command, false, arg);
    handleInput();
  };

  const insertLink = () => {
    const url = prompt("Enter URL (e.g. https://example.com):");
    if (url) {
      exec("createLink", url);
    }
  };

  const insertImageUrl = () => {
    const url = prompt("Enter image URL:");
    if (url) {
      exec("insertImage", url);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        if (dataUrl) {
          exec("insertImage", dataUrl);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const insertTable = () => {
    const tableHtml = `
      <table style="width:100%; border-collapse:collapse; margin:12px 0; border:1px solid #d1d5db;">
        <thead>
          <tr style="background-color:#f9fafb;">
            <th style="border:1px solid #d1d5db; padding:8px; font-weight:600;">Header 1</th>
            <th style="border:1px solid #d1d5db; padding:8px; font-weight:600;">Header 2</th>
            <th style="border:1px solid #d1d5db; padding:8px; font-weight:600;">Header 3</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="border:1px solid #d1d5db; padding:8px;">Row 1 Col 1</td>
            <td style="border:1px solid #d1d5db; padding:8px;">Row 1 Col 2</td>
            <td style="border:1px solid #d1d5db; padding:8px;">Row 1 Col 3</td>
          </tr>
          <tr>
            <td style="border:1px solid #d1d5db; padding:8px;">Row 2 Col 1</td>
            <td style="border:1px solid #d1d5db; padding:8px;">Row 2 Col 2</td>
            <td style="border:1px solid #d1d5db; padding:8px;">Row 2 Col 3</td>
          </tr>
        </tbody>
      </table><p><br></p>
    `;
    exec("insertHTML", tableHtml);
  };

  return (
    <div className="border border-stone-200 rounded-xl overflow-hidden bg-white shadow-xs focus-within:border-emerald-600 focus-within:ring-1 focus-within:ring-emerald-600/20 transition-all">
      {/* Toolbar */}
      <div className="bg-stone-50/80 border-b border-stone-200/80 p-2 flex flex-wrap items-center gap-1 text-stone-600 select-none">
        {/* Undo / Redo */}
        <button
          type="button"
          onClick={() => exec("undo")}
          className="p-1.5 hover:bg-stone-200/70 rounded transition-colors"
          title="Undo"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => exec("redo")}
          className="p-1.5 hover:bg-stone-200/70 rounded transition-colors"
          title="Redo"
        >
          <RotateCw className="w-3.5 h-3.5" />
        </button>

        <div className="h-4 w-px bg-stone-300 mx-1" />

        {/* Headings */}
        <button
          type="button"
          onClick={() => exec("formatBlock", "<h1>")}
          className="p-1.5 hover:bg-stone-200/70 rounded font-bold text-xs"
          title="Heading 1"
        >
          <Heading1 className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => exec("formatBlock", "<h2>")}
          className="p-1.5 hover:bg-stone-200/70 rounded font-bold text-xs"
          title="Heading 2"
        >
          <Heading2 className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => exec("formatBlock", "<h3>")}
          className="p-1.5 hover:bg-stone-200/70 rounded font-bold text-xs"
          title="Heading 3"
        >
          <Heading3 className="w-3.5 h-3.5" />
        </button>

        <div className="h-4 w-px bg-stone-300 mx-1" />

        {/* Text Styling */}
        <button
          type="button"
          onClick={() => exec("bold")}
          className="p-1.5 hover:bg-stone-200/70 rounded font-bold"
          title="Bold"
        >
          <Bold className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => exec("italic")}
          className="p-1.5 hover:bg-stone-200/70 rounded italic"
          title="Italic"
        >
          <Italic className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => exec("underline")}
          className="p-1.5 hover:bg-stone-200/70 rounded underline"
          title="Underline"
        >
          <Underline className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => exec("strikeThrough")}
          className="p-1.5 hover:bg-stone-200/70 rounded"
          title="Strike-through"
        >
          <Strikethrough className="w-3.5 h-3.5" />
        </button>

        <div className="h-4 w-px bg-stone-300 mx-1" />

        {/* Alignments */}
        <button
          type="button"
          onClick={() => exec("justifyLeft")}
          className="p-1.5 hover:bg-stone-200/70 rounded"
          title="Align Left"
        >
          <AlignLeft className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => exec("justifyCenter")}
          className="p-1.5 hover:bg-stone-200/70 rounded"
          title="Align Center"
        >
          <AlignCenter className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => exec("justifyRight")}
          className="p-1.5 hover:bg-stone-200/70 rounded"
          title="Align Right"
        >
          <AlignRight className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => exec("justifyFull")}
          className="p-1.5 hover:bg-stone-200/70 rounded"
          title="Justify"
        >
          <AlignJustify className="w-3.5 h-3.5" />
        </button>

        <div className="h-4 w-px bg-stone-300 mx-1" />

        {/* Lists */}
        <button
          type="button"
          onClick={() => exec("insertUnorderedList")}
          className="p-1.5 hover:bg-stone-200/70 rounded"
          title="Bullet List"
        >
          <List className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => exec("insertOrderedList")}
          className="p-1.5 hover:bg-stone-200/70 rounded"
          title="Numbered List"
        >
          <ListOrdered className="w-3.5 h-3.5" />
        </button>

        <div className="h-4 w-px bg-stone-300 mx-1" />

        {/* Link */}
        <button
          type="button"
          onClick={insertLink}
          className="p-1.5 hover:bg-stone-200/70 rounded"
          title="Insert Link"
        >
          <LinkIcon className="w-3.5 h-3.5" />
        </button>

        <div className="h-4 w-px bg-stone-300 mx-1" />

        {/* Table & Images */}
        <button
          type="button"
          onClick={insertTable}
          className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded hover:bg-stone-200/70 text-stone-700"
          title="Insert Table"
        >
          <TableIcon className="w-3.5 h-3.5" />
          <span>Table</span>
        </button>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded hover:bg-stone-200/70 text-stone-700"
          title="Upload Image"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Upload Img</span>
        </button>

        <button
          type="button"
          onClick={insertImageUrl}
          className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded hover:bg-stone-200/70 text-stone-700"
          title="Insert Image URL"
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>Img URL</span>
        </button>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageUpload}
          accept="image/*"
          className="hidden"
        />
      </div>

      {/* Editable Area */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onBlur={handleInput}
        data-placeholder={placeholder}
        className="min-h-[140px] max-h-[400px] overflow-y-auto p-4 text-xs sm:text-sm text-stone-800 leading-relaxed outline-none prose prose-sm max-w-none focus:outline-none empty:before:content-[attr(data-placeholder)] empty:before:text-stone-400 empty:before:pointer-events-none"
      />
    </div>
  );
}
