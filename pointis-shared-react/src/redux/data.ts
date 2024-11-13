// // TODO update it later

export const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
};


export const generateAIResponse = (input: string) => {
    console.log("Generating AI response for: ", input);
};
