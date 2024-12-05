'use client'

import './styles.css'
import Placeholder from '@tiptap/extension-placeholder'
import { BubbleMenu, EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

type Props = {
	value: string
	onChange: (value: string) => void
	onFocus?: () => void
	onBlur?: () => void
}

export function Editor({ value, onChange, onFocus, onBlur }: Props) {
	const editor = useEditor({
		extensions: [
			StarterKit,
			Placeholder.configure({
				placeholder: 'Type something or select text to add properties …',
			}),
		],
		content: value,
		onUpdate: ({ editor }) => {
			const html = editor.getHTML()
			onChange(html)
		},
		onFocus,
		onBlur,
	})

	return (
		<div>
			{editor && (
				<BubbleMenu className="bubble-menu" tippyOptions={{ duration: 100 }} editor={editor}>
					<button
						type="button"
						onClick={() => editor.chain().focus().toggleBold().run()}
						className={editor.isActive('bold') ? 'is-active' : ''}
					>
						Bold
					</button>
					<button
						type="button"
						onClick={() => editor.chain().focus().toggleItalic().run()}
						className={editor.isActive('italic') ? 'is-active' : ''}
					>
						Italic
					</button>
					<button
						type="button"
						onClick={() => editor.chain().focus().toggleStrike().run()}
						className={editor.isActive('strike') ? 'is-active' : ''}
					>
						Strike
					</button>
				</BubbleMenu>
			)}

			<EditorContent editor={editor} className="[&>.ProseMirror]:outline-none h-full text-base" />
		</div>
	)
}
