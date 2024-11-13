import { NodeViewContent, NodeViewWrapper, ReactNodeViewRenderer } from '@tiptap/react'
import { CodeBlockLowlight } from '@tiptap/extension-code-block-lowlight'
import React, { useState } from "react";

// import "./CodeBlock.less"
import Button from '../../basic/Button';
import { FaRegCopy } from "react-icons/fa";
import { addNotification } from "../../../redux/notifications";
import { MSG_IN_CLIPBOARD } from "../../../shared";
import { useDispatch } from "react-redux";
import Select from "../../basic/Select";
import _ from "lodash";
import { copyToClipboard } from "../../../redux/data";

// @ts-ignore
const LanguageSelect = ({ editor, node, updateAttributes }) => {
    const [language, setLanguage] = useState(node.attrs.language);

    const handleLanguageChange = (newLanguage: string) => {
        setLanguage(newLanguage);
        updateAttributes({ language: newLanguage });
    };

    return (
        <Select onChange={(v) => handleLanguageChange(v.value)}
            initialValue={language}
            options={['javascript', 'python', 'java', 'json', 'html', 'ocaml'].map(v => ({ label: _.capitalize(v), value: v }))} />
    );
};


// @ts-ignore
const CodeBlockComponent = ({ node, editor, updateAttributes, ...props }) => {
    const dispatch = useDispatch();

    const copyToClipboard = async () => {
        dispatch(addNotification({ message: MSG_IN_CLIPBOARD }))
        await navigator.clipboard.writeText(code);
    };

    const code = node.textContent.trim();

    if (!code) return null;

    return (
        <NodeViewWrapper className="fl-code-block-wrapper">
            <div className="code-block-header">
                <LanguageSelect editor={editor} node={node} updateAttributes={updateAttributes} />
                <Button Icon={FaRegCopy} onClick={copyToClipboard} />
            </div>
            <pre className="code-block">
                <NodeViewContent as="code" />
            </pre>
        </NodeViewWrapper>
    )
}

const CodeBlock = CodeBlockLowlight.extend({
    addNodeView() {
        return ReactNodeViewRenderer(CodeBlockComponent)
    }
})

export default CodeBlock