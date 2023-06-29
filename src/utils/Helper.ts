function removeNewlinesAndTrim(input: string): string {
    const withoutNewlines = input.replace(/\n/g, '');
    const trimmed = withoutNewlines.trim();
    return trimmed;
}
function replaceSuffixSecond(input: string): string {
    input = input.replace("<span class=\"suffix seconds\">s</span>", "s")
    input = input.replace("<span class=\"suffix\"> lap</span>", " lap")
    input = input.replace("<span class=\"suffix\"> laps</span>", " laps")
    return input
}
function capitalizeString(input: string): string {
    return input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
}
function extractCountryName(input: string): string {
    if (!input) return ''
    const countrySlug = input.split('/')[1];
    const countryWords = countrySlug.split('-');
    const countryName = countryWords
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    return countryName;
}
function setTableColumnFromEmptyModel(obj: any) {
    const extractedColumn = Object.keys(obj).map((key) => ({
        title: Helper.capitalizeString(key),
        key,
        dataIndex: key,
    }));
    sessionStorage.setItem("tableColumns", JSON.stringify(extractedColumn))
    return extractedColumn

}
function subStringUrl(input: string) {
    // Extract "apiType"
    const inputSplit = input.split("/")
    const apiType = inputSplit[4];
    // Extract last filter
    let lastFilter = inputSplit[5]
    if (inputSplit.length > 6) {
        lastFilter = `${lastFilter}/${inputSplit[6]}`
    }
    lastFilter = lastFilter.replace('.html', "")
    return { apiType: apiType, lastFilter: lastFilter }
}
function customHeadingTrim(input: string, trimSpecificValue: string): string {
    input = input.trim();
    const pattern = new RegExp(`${trimSpecificValue}\\s+-`, 'g');
    const trimmedStr = input.replace(pattern, `${trimSpecificValue}-`);
    return trimmedStr
}
function convertToRealSponserImageUrl(input: string): string {
    if (input) {
        return `https://www.formula1.com/${input}`
    }
    return ""
}
function isIterable(obj: any) {
    if (obj == null) {
        return false;
    }
    return typeof obj[Symbol.iterator] === 'function';
}
export const Helper = {
    removeNewlinesAndTrim,
    replaceSuffixSecond,
    capitalizeString,
    extractCountryName,
    setTableColumnFromEmptyModel,
    subStringUrl,
    customHeadingTrim,
    convertToRealSponserImageUrl,
    isIterable
}