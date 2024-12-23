import React from "react";
import { Button } from "./ui/button";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Code,
  Database,
  Italic,
  List,
  StrikethroughIcon,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Toolbar = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="control-group">
      <div className="button-group">
        <Button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleHeading({ level: 1 }).run();
          }}
          className={
            editor.isActive("heading", { level: 1 }) ? "is-active" : ""
          }
        >
          H1
        </Button>
        <Button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleHeading({ level: 2 }).run();
          }}
          className={
            editor.isActive("heading", { level: 2 }) ? "is-active" : ""
          }
        >
          H2
        </Button>
        <Button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleHeading({ level: 3 }).run();
          }}
          className={
            editor.isActive("heading", { level: 3 }) ? "is-active" : ""
          }
        >
          H3
        </Button>
        <Button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleBold().run();
          }}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={editor.isActive("bold") ? "is-active" : ""}
        >
          <Bold />
        </Button>
        <Button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleItalic().run();
          }}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={`${editor.isActive("italic") ? "is-active" : ""}`}
        >
          <Italic />
        </Button>
        <Button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleStrike().run();
          }}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          className={`${editor.isActive("strike") ? "is-active" : ""}`}
        >
          <StrikethroughIcon />
        </Button>
        <Button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().setTextAlign("left").run();
          }}
          className={editor.isActive({ textAlign: "left" }) ? "is-active" : ""}
        >
          <AlignLeft />
        </Button>
        <Button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().setTextAlign("center").run();
          }}
          className={
            editor.isActive({ textAlign: "center" }) ? "is-active" : ""
          }
        >
          <AlignCenter />
        </Button>
        <Button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().setTextAlign("right").run();
          }}
          className={editor.isActive({ textAlign: "right" }) ? "is-active" : ""}
        >
          <AlignRight />
        </Button>
        <Button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleBulletList().run();
          }}
          className={editor.isActive("bulletList") ? "is-active" : ""}
        >
          <List />
        </Button>
        <Button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleCodeBlock().run();
          }}
          className={editor.isActive("codeBlock") ? "is-active" : ""}
        >
          <Code />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button type="button">
              <Database />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <Button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  editor
                    .chain()
                    .focus()
                    .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                    .run();
                }}
              >
                Insert table
              </Button>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  editor.chain().focus().addColumnBefore().run();
                }}
                disabled={!editor.can().addColumnBefore()}
              >
                Add column before
              </Button>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  editor.chain().focus().addColumnAfter().run();
                }}
                disabled={!editor.can().addColumnAfter()}
              >
                Add column after
              </Button>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  editor.chain().focus().deleteColumn().run();
                }}
                disabled={!editor.can().deleteColumn()}
              >
                Delete column
              </Button>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  editor.chain().focus().addRowBefore().run();
                }}
                disabled={!editor.can().addRowBefore()}
              >
                Add row before
              </Button>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  editor.chain().focus().addRowAfter().run();
                }}
                disabled={!editor.can().addRowAfter()}
              >
                Add row after
              </Button>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  editor.chain().focus().deleteRow().run();
                }}
                disabled={!editor.can().deleteRow()}
              >
                Delete row
              </Button>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  editor.chain().focus().deleteTable().run();
                }}
                disabled={!editor.can().deleteTable()}
              >
                Delete table
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Toolbar;
