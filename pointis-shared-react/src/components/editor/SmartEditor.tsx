// import './SmartEditor.less'

import { Color } from '@tiptap/extension-color'
import ListItem from '@tiptap/extension-list-item'
import TextStyle from '@tiptap/extension-text-style'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import React, { useEffect, useRef, useState } from 'react'
import { Markdown } from 'tiptap-markdown';
import { DEBUG } from "../../shared";

import { Highlight } from "@tiptap/extension-highlight";
import SuperscriptHover from "./SuperscriptHover";
import { all, createLowlight } from 'lowlight'
import { useDelayedCallback } from "../../utils/useUtils";
import { EditorMenuBar } from "./EditorMenuBar";
import { useSelector } from "react-redux";
import { configSelectors } from "../../redux/config";
import { ImageWithActions } from "./image/ImageWithActions";
import CodeBlock from "./code/CodeBlock";
import { compareDates, truncateLast } from "../../utils/utils";

// import Collaboration from '@tiptap/extension-collaboration'
// import * as Y from 'yjs'
// import {TiptapCollabProvider} from "@hocuspocus/provider";

// create a lowlight instance
const lowlight = createLowlight(all)
// const doc = new Y.Doc() // Initialize Y.Doc for shared editing

export const HISTORY_DELAY = 1000

const extensions = [
    SuperscriptHover,
    Markdown.configure({
        html: true,                  // Allow HTML input/output
        tightLists: true,            // No <p> inside <li> in markdown output
        tightListClass: 'tight',     // Add class to <ul> allowing you to remove <p> margins when tight
        bulletListMarker: '-',       // <li> prefix in markdown output
        linkify: true,              // Create links from "https://..." text
        breaks: true,               // New lines (\n) in markdown input are converted to <br>
        transformPastedText: false,  // Allow to paste markdown text in the editor
        transformCopiedText: false,  // Copied text is transformed to markdown
    }),
    Highlight.configure({ multicolor: true }),
    Color.configure({ types: [TextStyle.name, ListItem.name] }),
    // @ts-ignore
    TextStyle.configure({ types: [ListItem.name] }),
    StarterKit.configure({
        bulletList: { keepMarks: true, keepAttributes: false },
        orderedList: { keepMarks: true, keepAttributes: false },
        history: { newGroupDelay: HISTORY_DELAY },
        codeBlock: false
    }),
    // Collaboration.configure({
    //     document: doc,
    // }),
    ImageWithActions,
    CodeBlock.configure({ lowlight }),

    // Placeholder.configure({
    //     placeholder: 'Write something...',
    // }),
]

interface EditorProps {
    content?: string | null;
    contentTimestamp?: string | null;
    className?: string;
    editing?: boolean;
    noActions?: boolean;
    onContentChange?: (value: string | null, updatedAt: string) => void;
}

export const SmartEditor: React.FC<EditorProps> = ({ content, contentTimestamp, className, editing = false, noActions = true, onContentChange }) => {

    const [hoverText, setHoverText] = useState<string | null>(null);
    // const [lastContent, setLastContent] = useState<string | null>(content || null);
    // const [lastContentTimestamp, setLastContentTimestamp] = useState<string | null>(contentTimestamp || null);

    const hoverDivRef = useRef<HTMLDivElement>(null);

    const lastContentRef = useRef<string | null>(content || null);
    const lastContentTimestampRef = useRef<string | null>(contentTimestamp || null);

    // const logoAnimation = useSelector(configSelectors.selectLogoAnimation);
    const logoAnimation = null;

    const formattedContent = content || '' // formatForMD(content) // markdownToHTML(content)

    useDelayedCallback(lastContentRef.current, (value) => {
        if (editing && value !== content) {
            DEBUG && console.log(`Autosaving content: ${value}`)
            const ts = new Date().toISOString()
            lastContentTimestampRef.current = ts
            onContentChange?.(value, ts);
        }
    });

    const editor = useEditor({
        extensions: extensions,
        onUpdate({ editor }) {
            const text = editor.getHTML()

            if (text != lastContentRef.current) {
                DEBUG && console.log("editor change detected", text)
                lastContentRef.current = text
            }
        },
        editorProps: {
            // not handled use default behaviour
            handleDrop: (view: any, event: any, slice: any, moved: any) => false
        },
        editable: editing,
        content: formattedContent
    });

    useEffect(() => { editor?.setEditable(editing ?? false) }, [editing]);

    useEffect(() => {
        // DEBUG && console.log("SmartEditor.collab init")
        // const provider = new TiptapCollabProvider({
        //     baseUrl: ' http://0.0.0.0:1234',
        //     token: 'notoken', // Your JWT token
        //     name: 'demo-doc',
        //     document: doc,
        // })
    }, [])

    useEffect(() => {
        if (!lastContentTimestampRef.current || compareDates(contentTimestamp, lastContentTimestampRef.current) > 0) {
            // if(!lastContentTimestamp || (contentTimestamp || 0) > lastContentTimestamp) {
            DEBUG && console.log(`SmartEditor.contentTimestamp: never version found ${contentTimestamp}`)
            const updatedContent = content || ''
            lastContentRef.current = updatedContent
            lastContentTimestampRef.current = contentTimestamp || null

            if (editor) {
                const { from, to } = editor.state.selection;
                DEBUG && console.log("updateContent", from, to)

                // const { doc, tr } = editor.state;
                // tr
                //     .setMeta('preventUpdate', true) // true by default but you can set it to false
                //     .setMeta('addToHistory', false); // Finally we prevent pushing content to the history
                // editor.view.dispatch(tr)

                editor.commands.setContent(updatedContent, true, { preserveWhitespace: "full" });
                editor.commands.setTextSelection({ from, to });

                // editor.unregisterPlugin('history');
                // editor.registerPlugin(History.);
            }
        }
    }, [contentTimestamp]);

    // useEffect(() => { editor?.chain().focus().setContent(formattedContent) }, [formattedContent]);

    useEffect(() => {
        // DEBUG && console.log("useEffect.formattedContent", editable, formattedContent)
        if (editor) {
            const { from, to } = editor.state.selection;
            editor.commands.setContent(formattedContent);
            editor.commands.setTextSelection({ from, to });
        }

        // editor?.commands.setContent(formattedContent);
        // setLastContent(formattedContent);
    }, [formattedContent]);

    // useEffect(() => { editor?.setEditable(editable ?? false) }, [editor.]);

    const handleMouseOver = (event: React.MouseEvent) => {
        const target = event.target as HTMLElement;
        DEBUG && console.log("SmartEditor.handleMouseOver", target.getAttribute('data-hover-text'), target)
        if (target.tagName === 'SUP' && target.getAttribute('data-hover-text')) {
            setHoverText(target.getAttribute('data-hover-text'));
            const rect = target.getBoundingClientRect();
            if (hoverDivRef.current) {
                hoverDivRef.current.style.top = `${rect.bottom + window.scrollY}px`;
                hoverDivRef.current.style.left = `${rect.left + window.scrollX}px`;
            }
        }
    };

    const handleMouseOut = () => setHoverText(null);

    DEBUG && console.log("SmartEditor.render", editing, truncateLast(content?.toString(), 50), truncateLast(lastContentRef?.current?.toString(), 50))

    return (
        // <div key={hashCode(formattedContent || '')}>
        <div className={`fl-smart-editor ${className ? className : ''}`}
        // Foundation for citations highlights on hover
        // onMouseOver={handleMouseOver}
        // onMouseOut={handleMouseOut}
        >
            {!noActions && <EditorMenuBar className="actions" editor={editor} />}
            {/*<BubbleMenu editor={editor}*/}
            {/*            shouldShow={({ editor, from, to }) => {*/}
            {/*                // DEBUG && console.log("BubbleMenu.shouldShow", editor.isEditable, to, from)*/}
            {/*                return editor.isEditable && (to - from) > 0*/}
            {/*            }}*/}
            {/*            tippyOptions={{onCreate: (instance) => {*/}
            {/*                // Deals with Bubble menu flashing on updates when using Icons*/}
            {/*                // Capture the blur event that was added in extension-bubble-menu and stopImmediatePropagation*/}
            {/*                instance.popper.firstChild?.addEventListener('blur', (event) => {*/}
            {/*                    event.preventDefault();*/}
            {/*                    event.stopImmediatePropagation();*/}
            {/*                })}*/}
            {/*            }}*/}
            {/*>*/}
            {/*    <EditorMenuBar editor={editor} />*/}
            {/*</BubbleMenu>*/}
            {hoverText && (
                <div ref={hoverDivRef} style={{ position: 'absolute', background: 'lightgray', padding: '5px', borderRadius: '3px' }}>
                    {hoverText}
                </div>
            )}
            <EditorContent className={`content ${logoAnimation ? 'inactive' : ''}`} editor={editor} onKeyDown={(e) => e.stopPropagation()} onKeyUp={(e) => e.stopPropagation()} />
        </div>
    )

    // const markdownOutput = editor.storage.markdown.getMarkdown();
}

const CONTENT_EXAMPLE = `
<!--<h2>-->
<!--  Hi there,-->
<!--</h2>-->
<!--<p>-->
<!--  this is a <em>basic</em> example of <strong>Tiptap</strong>. Sure, there are all kind of basic text styles you’d probably expect from a text editor. But wait until you see the lists:-->
<!--</p>-->
<!--<ul>-->
<!--  <li>-->
<!--    That’s a bullet list with one …-->
<!--  </li>-->
<!--  <li>-->
<!--    … or two list items.-->
<!--  </li>-->
<!--</ul>-->
<p>Hello <sup data-hover-text="This is hover text">world</sup></p>
<p>
  Isn’t that great? And all of that is editable. But wait, there’s more. Let’s try a code block:
</p>
<pre><code class="language-css">body {
  display: none;
}</code></pre>
<p>
  I know, I know, this is impressive. It’s only the tip of the iceberg though. Give it a try and click a little bit around. Don’t forget to check the other examples too.
</p>
<blockquote>
  Wow, that’s amazing. Good work, boy! 👏
  <br />
  — Mom
</blockquote>
`