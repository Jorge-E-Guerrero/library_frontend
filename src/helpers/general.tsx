export const fullname = (firstName: string, lastName: string) => {
    return [firstName, lastName].filter(Boolean).join(' ');
}