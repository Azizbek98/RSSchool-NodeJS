function truncateString(str: string, limit = 50) {
    return str.length > limit ? str.slice(0, limit - 1) + '…' : str;
}

export { truncateString };
