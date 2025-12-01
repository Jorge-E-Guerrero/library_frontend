export const formatDate = ({date, format = "es-GT", timezone = "UTC", options = { dateStyle: "medium" }}: {date: Date, format?: string, timezone?: string, options?: Intl.DateTimeFormatOptions}) => {
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

export const getDaysDifference = (startDate: Date, endDate: Date) => {
    const start = startDate instanceof Date ? startDate : new Date(startDate);
    const end = endDate instanceof Date ? endDate : new Date(endDate);
    const timeDifference = end.getTime() - start.getTime();
    const daysDifference = parseInt((timeDifference / (1000 * 3600 * 24)).toString());
    return daysDifference;
}