import { useCallback } from "react";

export const useDelayedCallback = (value: any, callback: (value: any) => void) => {
    return useCallback(() => {
        const timer = setTimeout(() => {
            callback(value);
        }, 1000);

        return () => clearTimeout(timer);
    }, [value, callback]);
};