// // TODO update it later

export const addNotification = (message: string) => {
    return {
        type: 'ADD_NOTIFICATION',
        payload: message,
    };
};

