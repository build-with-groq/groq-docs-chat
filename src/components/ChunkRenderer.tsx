import { memo, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import CodeBlock from "./CodeBlock";
import CustomLink from "./CustomLink";
import remarkGfm from "remark-gfm";
import styles from "../styles.module.css";

/**
 * Individual chunk renderer that memoizes its content to prevent unnecessary re-renders
 */
const ChunkRenderer = memo(function ChunkRenderer({
    chunk,
    index,
}: {
    chunk: string;
    index: number;
}) {
    const markdownComponents = useMemo(
        () => ({
            code: ({ node, className, children, ...props }: any) => {
                const match = /language-(\w+)/.exec(className || "");
                return match ? (
                    <CodeBlock className={className}>
                        {String(children).replace(/\n$/, "")}
                    </CodeBlock>
                ) : (
                    <code className={className} {...props}>
                        {children}
                    </code>
                );
            },
            a: ({ href, children }: any) => (
                <CustomLink href={href || "#"}>{children}</CustomLink>
            ),
        }),
        []
    );

    return (
        <div key={`chunk-${index}`} className={styles.markdownChunk}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={markdownComponents}
            >
                {chunk}
            </ReactMarkdown>
        </div>
    );
});

export default ChunkRenderer;