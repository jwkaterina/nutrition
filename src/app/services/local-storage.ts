export const getItemFromLocalStorage = (key: string): any => {
    if (typeof window !== 'undefined') {
        const item = localStorage.getItem(key);
        if (item) {
            return JSON.parse(item);
        }
    }
    return null;
}

export const setToLocalStorage = (key: string, obj: any) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem(key, JSON.stringify(obj))
    }
}
