
function reverseString(source) {
    // Note: does not handle multi-byte strings (e.g. Unicode)
    let result = '';
    for (let i = source.length - 1; i >= 0; i--) {
        result += source[i];
    }
    return result;
}

// Listen for stdin events, transform and write to stdout
process.stdin.on('data', (chunk) => {
    // remove newline chars
    let source = chunk.toString().replace(/\r?\n|\r/g, "");
    let reversed = reverseString(source);
    console.log(reversed);
});
