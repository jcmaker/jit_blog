"use client";
import React from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Color } from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";
import ListItem from "@tiptap/extension-list-item";
import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import Toolbar from "./Toolbar"; // Import the toolbar component

const Tiptap = ({ value, onChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure(),
      Color.configure({ types: [TextStyle.name, ListItem.name] }),
      TextStyle.configure({ types: [ListItem.name] }),
      Table.configure(),
      TableCell.configure(),
      TableHeader.configure(),
      TableRow.configure(),
    ],
    content: value, // Initialize with empty or provided content
    onUpdate({ editor }) {
      onChange(editor.getHTML()); // Pass content to the parent
    },
    editorProps: {
      attributes: {
        class: "rounded-md border min-h-[300px] border-input bg-back mt-1 p-2",
      },
    },
  });
  if (!editor) return null;
  return (
    <div>
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};
export default Tiptap;
