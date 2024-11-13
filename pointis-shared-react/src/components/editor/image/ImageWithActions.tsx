import { Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import ImageComponent from './ImageComponent';

export const ImageWithActions = Node.create({
    name: 'imageWithActions',
    group: 'block',
    atom: true,

    addAttributes() {
        return {
            src: {
                default: null,
            },
            alt: {
                default: null,
            },
        };
    },

    parseHTML() {
        return [
            {
                tag: 'img[src]',
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return ['img', HTMLAttributes];
    },

    addNodeView() {
        return ReactNodeViewRenderer(ImageComponent);
    },
});