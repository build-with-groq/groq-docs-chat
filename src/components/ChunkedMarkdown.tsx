import { memo } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { splitIntoChunks } from "../lib/utils";
import styles from "../styles.module.css";
import ChunkRenderer from "./ChunkRenderer";

/**
 * Optimized markdown renderer that renders content in chunks to avoid re-processing completed content
 */
const ChunkedMarkdown = memo(function ChunkedMarkdown({
    content,
    isStreaming,
}: {
    content: string;
    isStreaming: boolean;
}) {
    const [processedChunks, setProcessedChunks] = useState<string[]>([]);
    const [pendingContent, setPendingContent] = useState<string>("");

    useEffect(() => {
        if (!content) {
            setProcessedChunks([]);
            setPendingContent("");
            return;
        }

        const chunks = splitIntoChunks(content);

        if (!isStreaming) {
            // When not streaming, process all chunks immediately
            setProcessedChunks(chunks);
            setPendingContent("");
        } else {
            // When streaming, only process complete chunks
            const completeChunks = chunks.slice(0, -1);
            const lastChunk = chunks[chunks.length - 1] || "";

            // Check if we have new complete chunks
            if (completeChunks.length > processedChunks.length) {
                setProcessedChunks(completeChunks);
            }

            // Set pending content (the incomplete last chunk)
            setPendingContent(lastChunk);
        }
    }, [content, isStreaming, processedChunks.length]);

    return (
        <div className={styles.chunkedContent}>
            {/* Render completed chunks (these never re-render) */}
            {processedChunks.map((chunk, index) => (
                <ChunkRenderer key={index} chunk={chunk} index={index} />
            ))}

            {/* Render pending content during streaming */}
            {isStreaming && pendingContent && (
                <div className={styles.pendingChunk}>
                    <span style={{ whiteSpace: "pre-wrap" }}>
                        {pendingContent}
                    </span>
                </div>
            )}
        </div>
    );
});

export default ChunkedMarkdown;