import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { useCallback } from 'react';

interface TiptapEditorProps {
  content: string;
  onChange: (html: string) => void;
}

export default function TiptapEditor({ content, onChange }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto',
        },
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[300px] p-4',
        style: 'font-family: Georgia, "Times New Roman", serif; line-height: 1.7;',
      },
    },
  });

  const addLink = useCallback(() => {
    const url = window.prompt('Enter URL:');
    if (url && editor) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  }, [editor]);

  const addImage = useCallback(() => {
    const url = window.prompt('Enter image URL:');
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  if (!editor) {
    return null;
  }

  const MenuButton = ({ onClick, active, disabled, title, children }: {
    onClick: () => void;
    active?: boolean;
    disabled?: boolean;
    title: string;
    children: React.ReactNode;
  }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      type="button"
      style={{
        padding: '0.5rem 0.75rem',
        backgroundColor: active ? 'var(--neutral-200)' : 'var(--white)',
        border: '1px solid var(--neutral-300)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontWeight: active ? '600' : 'normal',
        opacity: disabled ? 0.5 : 1,
        fontSize: '0.875rem'
      }}
    >
      {children}
    </button>
  );

  return (
    <div style={{ border: '1px solid var(--neutral-300)', borderRadius: '6px', overflow: 'hidden' }}>
      {/* Toolbar */}
      <div style={{
        padding: '0.5rem',
        backgroundColor: 'var(--neutral-50)',
        borderBottom: '1px solid var(--neutral-300)',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.25rem'
      }}>
        <MenuButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive('bold')}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          title="Bold (Ctrl+B)"
        >
          <strong>B</strong>
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          title="Italic (Ctrl+I)"
        >
          <em>I</em>
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive('strike')}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          title="Strikethrough"
        >
          <s>S</s>
        </MenuButton>

        <div style={{ width: '1px', backgroundColor: 'var(--neutral-300)', margin: '0 0.25rem' }} />

        <MenuButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          active={editor.isActive('heading', { level: 1 })}
          title="Heading 1"
        >
          H1
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive('heading', { level: 2 })}
          title="Heading 2"
        >
          H2
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive('heading', { level: 3 })}
          title="Heading 3"
        >
          H3
        </MenuButton>

        <div style={{ width: '1px', backgroundColor: 'var(--neutral-300)', margin: '0 0.25rem' }} />

        <MenuButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive('bulletList')}
          title="Bullet List"
        >
          • List
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive('orderedList')}
          title="Ordered List"
        >
          1. List
        </MenuButton>

        <div style={{ width: '1px', backgroundColor: 'var(--neutral-300)', margin: '0 0.25rem' }} />

        <MenuButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive('blockquote')}
          title="Quote"
        >
          &quot;Quote&quot;
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          active={editor.isActive('codeBlock')}
          title="Code Block"
        >
          {'</>'}
        </MenuButton>

        <div style={{ width: '1px', backgroundColor: 'var(--neutral-300)', margin: '0 0.25rem' }} />

        <MenuButton
          onClick={addLink}
          active={editor.isActive('link')}
          title="Add Link"
        >
          🔗 Link
        </MenuButton>
        <MenuButton
          onClick={addImage}
          active={false}
          title="Add Image"
        >
          🖼️ Image
        </MenuButton>

        <div style={{ width: '1px', backgroundColor: 'var(--neutral-300)', margin: '0 0.25rem' }} />

        <MenuButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          active={false}
          title="Horizontal Rule"
        >
          ―
        </MenuButton>

        <div style={{ width: '1px', backgroundColor: 'var(--neutral-300)', margin: '0 0.25rem' }} />

        <MenuButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
          title="Undo (Ctrl+Z)"
        >
          ↶ Undo
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
          title="Redo (Ctrl+Shift+Z)"
        >
          ↷ Redo
        </MenuButton>
      </div>

      {/* Editor Content */}
      <EditorContent
        editor={editor}
        style={{
          backgroundColor: 'var(--white)',
          minHeight: '400px'
        }}
      />

      {/* Character Count */}
      <div style={{
        padding: '0.5rem 1rem',
        backgroundColor: 'var(--neutral-50)',
        borderTop: '1px solid var(--neutral-300)',
        fontSize: '0.75rem',
        color: 'var(--neutral-600)',
        textAlign: 'right'
      }}>
        {editor.storage.characterCount?.characters() || 0} characters • {editor.storage.characterCount?.words() || 0} words
      </div>
    </div>
  );
}
