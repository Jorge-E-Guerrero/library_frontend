export const formatDate = ({date, format = "es-GT", timezone, options = { dateStyle: "medium" }}: {date: Date, format?: string, timezone?: string, options?: Intl.DateTimeFormatOptions}) => {
    try {
        if (!(date instanceof Date)) date = new Date(date);
        return Intl.DateTimeFormat(format, {
            ...options,
            timeZone: timezone,
        }).format(date);
    } catch (error) {
        console.error(error);
        return "";
    }
}