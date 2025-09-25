
/**
 * Splits text into logical chunks for incremental rendering
 */
export function splitIntoChunks(text: string): string[] {
    if (!text) return [];

    // Split by double newlines (paragraphs) and code blocks
    const chunks = [];
    let currentChunk = "";
    let inCodeBlock = false;

    const lines = text.split("\n");

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // Detect code block boundaries
        if (line.trim().startsWith("```")) {
            inCodeBlock = !inCodeBlock;
            currentChunk += line + "\n";

            // If we're ending a code block, complete this chunk
            if (!inCodeBlock) {
                chunks.push(currentChunk.trim());
                currentChunk = "";
            }
            continue;
        }

        currentChunk += line + "\n";

        // If not in code block and we hit an empty line or end, complete chunk
        if (!inCodeBlock && (line.trim() === "" || i === lines.length - 1)) {
            if (currentChunk.trim()) {
                chunks.push(currentChunk.trim());
                currentChunk = "";
            }
        }
    }

    // Add any remaining content
    if (currentChunk.trim()) {
        chunks.push(currentChunk.trim());
    }

    return chunks;
}


/**
 * Counts the number of file references in a tool response
 */
export function countFilesInResponse(response: string): number {
    const matches = response.match(/<file/g);
    return matches ? matches.length : 0;
}


/**
 * Extracts file names from a tool response and converts them to documentation URLs
 */
export function extractFileNamesFromResponse(response: string): string[] {
    if (!response) return [];

    const fileNameRegex = /<file name="([^"]+)"/g;
    const fileNames: string[] = [];
    let match;

    while ((match = fileNameRegex.exec(response)) !== null) {
        fileNames.push(match[1]);
    }

    return fileNames;
}


/**
 * Groups tool calls by type and calculates total file counts
 */
export function groupToolCalls(toolInvocations: any[]) {
    const searchDocs = toolInvocations.filter(
        (tool) => tool.toolName === "search_docs"
    );
    const otherTools = toolInvocations.filter(
        (tool) => tool.toolName !== "search_docs"
    );

    const totalSearchedDocs = searchDocs.reduce((total, tool) => {
        return total + (tool.result ? countFilesInResponse(tool.result) : 0);
    }, 0);

    return {
        searchDocs,
        otherTools,
        totalSearchedDocs,
        hasCompletedSearches: searchDocs.some((tool) => tool.result),
    };
}
