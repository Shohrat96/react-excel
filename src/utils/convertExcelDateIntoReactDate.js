export function excelDateToJSDate(serial) {
    // Base date: December 30, 1899, in UTC
    const excelStartDateUTC = Date.UTC(1899, 11, 30); // UTC "zero" date
    const serialInMilliseconds = serial * 86400000; // Days to milliseconds
    const jsDate = new Date(excelStartDateUTC + serialInMilliseconds); // Add serial to base date
    return jsDate.toISOString().split('T')[0]; // Return the date part in UTC (YYYY-MM-DD)
}