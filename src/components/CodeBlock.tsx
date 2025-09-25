import { Highlight, themes } from "prism-react-renderer";
import { useState } from "react";
import styles from "../styles.module.css";
import { Check, Copy } from "lucide-react";


/**
 * Renders a syntax-highlighted code block using Prism.
 * Accepts content and a className like `language-lua`.
 */
export default function CodeBlock({
    children,
    className,
}: {
    children: string;
    className?: string;
}) {
    const language = className?.replace(/language-/, "") || "text";
    const [copied, setCopied] = useState(false);

    // Map common language aliases to Prism language names
    const languageMap: { [key: string]: string } = {
        js: "javascript",
        ts: "typescript",
        python: "python",
        sh: "bash",
        html: "html",
        css: "css",
        json: "json",
        yaml: "yaml",
        markdown: "markdown",
        txt: "text",
    };

    const prismLanguage = languageMap[language.toLowerCase()] || "text";

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(children.trim());
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy text: ", err);
        }
    };

    return (
        <div className={styles.codeBlockContainer}>
            <Highlight
                code={children.trim()}
                language={prismLanguage}
                theme={themes.vsDark}
            >
                {({ className, style, tokens, getLineProps, getTokenProps }) => (
                    <pre className={className} style={style}>
                        {tokens.map((line, i) => (
                            <div key={i} {...getLineProps({ line })}>
                                {line.map((token, key) => (
                                    <span key={key} {...getTokenProps({ token })} />
                                ))}
                            </div>
                        ))}
                    </pre>
                )}
            </Highlight>
            <button
                className={styles.copyButton}
                onClick={handleCopy}
                title={copied ? "Copied!" : "Copy code"}
            >
                {copied ? <Check size={16} /> : <Copy size={16} />}
            </button>
        </div>
    );
}