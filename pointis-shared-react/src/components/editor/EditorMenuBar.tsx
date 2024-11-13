import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { configActions, configSelectors } from "../../redux/config";
import { DEBUG, MSG_NO_DATA } from "../../shared";
import { BiBold, BiItalic, BiRedo, BiStrikethrough, BiUndo } from "react-icons/bi";
import { FaCode, FaListOl } from "react-icons/fa";
import { LuHighlighter } from "react-icons/lu";
import { TbJson } from "react-icons/tb";
import Button from "../basic/Button";
import { FaArrowDownWideShort, FaWandMagicSparkles } from "react-icons/fa6";
import { communication } from "../../abstraction/communication";
import { LlmCmd } from "../../types";
import { addNotification } from "../../redux/notifications";
import { isArray, now } from "lodash";
import { MdFormatClear, MdOutlineSelfImprovement } from "react-icons/md";
import { RxDividerVertical } from "react-icons/rx";
import { BsSpellcheck } from "react-icons/bs";
import { generateAIResponse } from "../../redux/data";
import { CiImageOn } from "react-icons/ci";
import { Editor } from "@tiptap/react";
import { generateJSON } from '@tiptap/core'
import { HISTORY_DELAY } from "./SmartEditor";

interface ButtonProps {
    onClick?: () => void;
    disabled?: boolean;
    className?: string;
    tooltip?: string;
    Icon: React.ComponentType<any>;
    children?: React.ReactNode
}

const EditButton: React.FC<ButtonProps> = ({ onClick, disabled, className, Icon, tooltip, children }) => {
    return (
        <Button Icon={Icon} size='small' onClick={onClick}
            disabled={disabled}
            tooltip={tooltip}
            className={`se-btn ${className}`}
            delayed={false}
        >
            {children}
        </Button>
        // <button
        //     onClick={onClick}
        //     disabled={disabled}
        //     className={className}
        // >
        //     <Icon />
        // </button>

        // <div onClick={onClick} className={className}>
        //     <Icon />
        // </div>
    );
};

interface MenuProps {
    editor: Editor | null;
    floating?: boolean;
    className?: string;
}

export const EditorMenuBar: React.FC<MenuProps> = ({ editor, floating = false, className }) => {
    if (!editor) return null

    const dispatch = useDispatch();

    const model = useSelector(configSelectors.selectModel);
    const noteHighlightColor = useSelector(configSelectors.selectNoteHighlightColor);

    // const { editor } = useCurrentEditor()

    // const setSuperscriptWithHover = () => {
    //     editor?.chain().focus().setSuperscriptHover('Reference goes here..').run();
    // };

    const handleAiAction = async ({ action, append = false }: { action: string, append?: boolean }) => {
        editor.setEditable(false)
        try {
            dispatch(configActions.setLogoAnimation(true))
            const { state, view } = editor;
            const { doc, tr, selection } = state;

            const { from, to } = selection.empty ? { from: 0, to: doc.content.size } : selection;
            const selectedText = doc.textBetween(from, to);

            const start = now()
            // @ts-ignore
            // const data = 'test'
            const data = await dispatch(generateAIResponse({ op: action, value: selectedText, model: model } as LlmCmd)).unwrap()

            if (data) {
                const value = isArray(data) ? data.join("<br>") : data;
                DEBUG && console.log("EDITOR.. replacing or swapping?", from, to)

                DEBUG && console.log("history.took", now() - start)
                // if((now() - start) > HISTORY_DELAY) {
                //     DEBUG && console.log("history.undo")
                //     editor.commands.undo()
                // }

                if (selection.empty) {
                    editor.commands.setContent(value)
                }
                else {
                    if (append) {
                        editor.chain().insertContentAt(to, value, { updateSelection: true }).setTextSelection({ from, to }).run()

                        // const fragment = editor.state.schema.nodeFromJSON(generateJSON("<br>" + 'New content', []))
                        // editor.view.dispatch(editor.state.tr.insert(to, fragment))
                        // setTimeout(() => {
                        //     editor.chain().insertContentAt(to, "<br>" + "test", { updateSelection: true }).setTextSelection({from, to}).run()
                        // }, 400)
                        // editor.chain().insertContentAt(to, value, { updateSelection: true }).setTextSelection({from, to}).run()
                        // editor.chain().insertContentAt(to, "<br>" + "test", { updateSelection: true }).setTextSelection({from, to}).run()
                        // editor.commands.setTextSelection({ from, to });
                    }
                    else editor.commands.insertContent(value)
                }
                // const transaction = tr.replaceWith(from, to, state.schema.text(value));
                // view.dispatch(transaction);
                // editor.chain().focus().setTextSelection({from, to}).insertContent(value).run();
            }
        }
        catch (error) { }
        finally {
            dispatch(configActions.setLogoAnimation(false))
            editor.setEditable(true)
        }
    }

    const editable = editor.isEditable

    // if (!editor || !editor.can) return null
    DEBUG && console.log("MenuBar.render", editor);

    return (
        <div className={`se-btn-group ${floating ? 'se-btn-group-floating' : ''} ${className ? className : ''}`}>
            {editable && (
                <>
                    <div className="left">
                        <EditButton Icon={BiBold} onClick={() => editor.chain().focus().toggleBold().run()} disabled={!editor.can().chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'is-active' : ''} />
                        <EditButton Icon={BiItalic} onClick={() => editor.chain().focus().toggleItalic().run()} disabled={!editor.can().chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? 'is-active' : ''} />
                        <EditButton Icon={BiStrikethrough} onClick={() => editor.chain().focus().toggleStrike().run()} disabled={!editor.can().chain().focus().toggleStrike().run()} className={editor.isActive('strike') ? 'is-active' : ''} />

                        <EditButton Icon={FaListOl} onClick={() => editor.chain().focus().toggleOrderedList().run()} className={editor.isActive('orderedList') ? 'is-active' : ''} />
                        <EditButton Icon={LuHighlighter} onClick={() => editor.chain().focus().toggleHighlight({ color: noteHighlightColor }).run()} className={editor.isActive('highlight', { color: noteHighlightColor }) ? 'is-active' : ''} />

                        {/*<EditButton onClick={() => console.log(JSON.stringify(editor?.getJSON(), null, 2))} Icon={TbJson} />*/}

                        <EditButton onClick={() => editor.chain().focus().toggleCodeBlock().run()} Icon={FaCode} />
                        <EditButton tooltip="Remove Formatting" onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()} Icon={MdFormatClear} />
                    </div>
                </>
            )}

            <EditButton Icon={RxDividerVertical} disabled={true} />

            <div className="middle">
                <EditButton disabled={!editor.can().undo()} onClick={() => editor.commands.undo()} Icon={BiUndo} />
                <EditButton disabled={!editor.can().redo()} onClick={() => editor.commands.redo()} Icon={BiRedo} />
            </div>

            <EditButton Icon={RxDividerVertical} disabled={true} />

            <div className="right">
                {/*<EditButton onClick={() => handleAiAction('format')} Icon={FaWandMagicSparkles}><span>Format</span></EditButton>*/}
                <EditButton tooltip={"Correct Spelling"} onClick={() => handleAiAction({ action: 'correct' })} Icon={BsSpellcheck} />
                <EditButton tooltip={"Improve"} onClick={() => handleAiAction({ action: 'improve' })} Icon={MdOutlineSelfImprovement} />
                <EditButton tooltip={"Shorten"} onClick={() => handleAiAction({ action: 'shorten' })} Icon={FaArrowDownWideShort} />
                <EditButton tooltip={"Imagify"} onClick={() => handleAiAction({ action: 'txt2img', append: true })} Icon={CiImageOn} />
            </div>

            {/*<EditButton*/}
            {/*    onClick={setSuperscriptWithHover}*/}
            {/*    Icon={FaSuperscript}*/}
            {/*/>*/}

        </div>
    )
}