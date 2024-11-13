// TODO update it later


export const isTouch = () => {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};



import { useCallback } from 'react';


export const downloadLink = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
};


// export const compareDates = (date1: Date, date2: Date): number => {
//     return date1.getTime() - date2.getTime();
// };

// export const truncateLast = (str: string, length: number): string => {
//     return str.length > length ? str.slice(0, length) + '...' : str;
// };

export const compareDates = (date1?: Date | null, date2?: Date | null) => new Date(date1 || 0).getTime() - new Date(date2 || 0).getTime();



export function truncateLast(value: string | null | undefined, max = 30, separator = ".."): string | null | undefined {
    const clean = value?.replace(/\s{2,}/g, ' ').trim();

    if ((clean?.length || 0) == 0) return null

    return clean!.length > max
        ? clean!.substring(0, max - 3) + separator
        : clean;
}