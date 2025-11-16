export const sleep = async (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const fullname = (firstName: string, lastName: string) => {
    return [firstName, lastName].filter(Boolean).join(' ');
}