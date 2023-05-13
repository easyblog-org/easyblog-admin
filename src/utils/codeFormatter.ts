//json格式化
export default function formatJson(json: any, options?: { newlineAfterColonIfBeforeBraceOrBracket?: boolean; spaceAfterColon?: boolean }): string {
    const PADDING = '    '; // one can also use '\t' or a different number of spaces
    // optional settings
    options = options || {};
    // remove newline where '{' or '[' follows ':'
    const shouldAddNewlineAfterColonIfBeforeBraceOrBracket = options.newlineAfterColonIfBeforeBraceOrBracket === true;
    // use a space after a colon
    const shouldAddSpaceAfterColon = options.spaceAfterColon !== false;

    // begin formatting...

    // make sure we start with the JSON as a string
    if (typeof json !== 'string') {
        json = JSON.stringify(json);
    }
    // parse and stringify in order to remove extra whitespace
    json = JSON.stringify(JSON.parse(json));

    // add newline before and after curly braces and square brackets, and after comma
    json = json.replace(/([\{\}\[\],])/g, '\n$1\n');

    // remove multiple newlines
    json = json.replace(/(\n\n+)/g, '\n');

    // remove newlines before commas
    json = json.replace(/\n,/g, ',');

    // optional formatting...
    if (!shouldAddNewlineAfterColonIfBeforeBraceOrBracket) {
        json = json.replace(/\:\n\{/g, ':{');
        json = json.replace(/\:\n\[/g, ':[');
    }
    if (shouldAddSpaceAfterColon) {
        json = json.replace(/\:/g, ': ');
    }

    // remove first and last empty lines
    json = json.replace(/^\n/, '').replace(/\n$/, '');

    // add indentation
    let pad = 0;
    const lines = json.split('\n');
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        let indent = 0;
        if (line.match(/\{$/) || line.match(/\[$/)) {
            indent = 1;
        } else if (line.match(/\}/) || line.match(/\]/)) {
            pad--;
        } else {
            indent = 0;
        }
        pad += indent;
        if (i === 0) {
            lines[i] = line;
        } else {
            lines[i] = PADDING.repeat(pad) + line;
        }
    }
    return lines.join('\n');
}