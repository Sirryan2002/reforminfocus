import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import { useCallback } from 'react';

interface TiptapEditorProps {
  content: string;
  onChange: (html: string) => void;
}

export default function TiptapEditor({ content, onChange }: TiptapEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'editor-link',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'editor-image',
        },
      }),
      Placeholder.configure({
        placeholder: 'Start writing your article content here...',
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  const addLink = useCallback(() => {
    if (!editor) return;

    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Enter URL:', previousUrl || 'https://');

    // cancelled
    if (url === null) {
      return;
    }

    // empty
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    // update link
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  const removeLink = useCallback(() => {
    if (!editor) return;
    editor.chain().focus().unsetLink().run();
  }, [editor]);

  const addImage = useCallback(() => {
    if (!editor) return;

    const url = window.prompt('Enter image URL:', 'https://');

    if (url === null || url === '') {
      return;
    }

    // Add image with default width constraint
    editor.chain().focus().setImage({ src: url }).run();
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
        backgroundColor: active ? 'var(--primary-blue)' : 'var(--white)',
        color: active ? 'var(--white)' : 'var(--neutral-700)',
        border: '1px solid var(--neutral-300)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontWeight: active ? '600' : 'normal',
        opacity: disabled ? 0.5 : 1,
        fontSize: '0.875rem',
        transition: 'all 0.2s',
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
        <MenuButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          active={editor.isActive('code')}
          title="Inline Code"
        >
          {'<code>'}
        </MenuButton>

        <div style={{ width: '1px', backgroundColor: 'var(--neutral-300)', margin: '0 0.25rem' }} />

        <MenuButton
          onClick={addLink}
          active={editor.isActive('link')}
          title="Add/Edit Link"
        >
          🔗 Link
        </MenuButton>
        {editor.isActive('link') && (
          <MenuButton
            onClick={removeLink}
            active={false}
            title="Remove Link"
          >
            🚫 Unlink
          </MenuButton>
        )}
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

      {/* Status Bar */}
      <div style={{
        padding: '0.5rem 1rem',
        backgroundColor: 'var(--neutral-50)',
        borderTop: '1px solid var(--neutral-300)',
        fontSize: '0.75rem',
        color: 'var(--neutral-600)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          {editor.storage.characterCount?.characters() || 0} characters • {editor.storage.characterCount?.words() || 0} words
        </div>
        {editor.isActive('link') && (
          <div style={{ color: 'var(--primary-blue)', fontSize: '0.75rem' }}>
            Link active - Click &quot;Unlink&quot; to remove or &quot;Link&quot; to edit
          </div>
        )}
      </div>
    </div>
  );
}
