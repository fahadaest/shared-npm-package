import { Mark, mergeAttributes } from '@tiptap/core';

const SuperscriptHover = Mark.create({
    name: 'superscriptHover',

    addOptions() {
        return {
            HTMLAttributes: {},
        };
    },

    // addAttributes() {
    //     return {
    //         title: {
    //             default: null,
    //             parseHTML: element => element.getAttribute('title'),
    //             renderHTML: attributes => {
    //                 if (!attributes.title) {
    //                     return {};
    //                 }
    //                 return { title: attributes.title };
    //             },
    //         },
    //     };
    // },

    addAttributes() {
        return {
            hoverText: {
                default: null,
                parseHTML: element => element.getAttribute('data-hover-text'),
                renderHTML: attributes => {
                    if (!attributes.hoverText) {
                        return {};
                    }
                    return { 'data-hover-text': attributes.hoverText };
                },
            },
        };
    },

    parseHTML() {
        return [
            {
                tag: 'sup',
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return ['sup', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
    },

    // @ts-ignore
    addCommands() {
        return {
            // @ts-ignore
            setSuperscriptHover: (title: string) => ({ commands }) => {
                return commands.setMark(this.name, { title });
            },
        };
    },
});

export default SuperscriptHover;