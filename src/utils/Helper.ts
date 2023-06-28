function removeNewlinesAndTrim(input: string): string {
    const withoutNewlines = input.replace(/\n/g, '');
    const trimmed = withoutNewlines.trim();
    return trimmed;
}
function replaceSuffixSecond(input: string): string {
    return input.replace("<span class=\"suffix seconds\">s</span>", "s")
}
function capitalizeString(input: string): string {
    return input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
}
function extractCountryName(input: string): string {
    if(!input) return ''
    const countrySlug = input.split('/')[1];
    const countryWords = countrySlug.split('-');
    const countryName = countryWords
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    return countryName;
}
export const Helper = {
    removeNewlinesAndTrim,
    replaceSuffixSecond,
    capitalizeString,
    extractCountryName
}