import React from 'react';
import { NodeViewWrapper } from '@tiptap/react';
import Button from '../../basic/Button';
import { MdContentCopy, MdDeleteOutline, MdDownload } from 'react-icons/md';
// import "./ImageComponent.less"
import { addNotification } from "../../../redux/notifications";
import { useDispatch } from "react-redux";
import { MSG_IN_CLIPBOARD } from "../../../shared";
import { downloadLink } from "../../../utils/utils";

// @ts-ignore
const ImageComponent = ({ editor, node, updateAttributes, deleteNode }) => {
    // const dispatch = useDispatch();

    const { src, alt } = node.attrs;

    const copyToClipboard = async () => {
        // await copyImageToClipboard(src)
        dispatch(addNotification({ message: MSG_IN_CLIPBOARD }))
        await navigator.clipboard.writeText(src);
    };

    return (
        <NodeViewWrapper className="fl-sme-img-wrapper">
            {/*<figure>*/}
            <img src={src} alt={alt} />
            <div className="actions">
                <Button visible={editor.isEditable} Icon={MdDeleteOutline} onClick={deleteNode} />
                <Button Icon={MdContentCopy} onClick={copyToClipboard} />
                <Button Icon={MdDownload} onClick={() => downloadLink(src, alt || 'image' + '.jpg')} />
            </div>
            {/*    <figcaption>Fancy Image</figcaption>*/}
            {/*</figure>*/}
        </NodeViewWrapper>
    );
};

export default ImageComponent;