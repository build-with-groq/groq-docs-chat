import { useChat } from "@ai-sdk/react";
import clsx from "clsx";
import { useCallback, useEffect, useRef, useState } from "react";
import styles from "../styles.module.css";
import { groupToolCalls } from "../lib/utils";
import CombinedSearchIndicator from "./CombinedSearchIndicator";
import ToolCallIndicator from "./ToolCallIndicator";
import { ArrowRight, LoaderCircle } from 'lucide-react'
import ChunkedMarkdown from "./ChunkedMarkdown";
import { WelcomeScreen } from "./WelcomeScreen";

export default function Chat() {
    const { messages, input, handleInputChange, handleSubmit, status, stop } =
        useChat({
            onError: (error) => {
                console.error(error);
            },
        });

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const [expandedToolCalls, setExpandedToolCalls] = useState<Set<string>>(
        new Set()
    );
    const [shouldAutoScroll, setShouldAutoScroll] = useState(true);

    const scrollToBottom = useCallback(() => {
        if (shouldAutoScroll && messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "instant" });
        }
    }, [shouldAutoScroll]);

    const toggleToolCall = useCallback((toolCallId: string) => {
        setExpandedToolCalls((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(toolCallId)) {
                newSet.delete(toolCallId);
            } else {
                newSet.add(toolCallId);
            }
            return newSet;
        });
    }, []);

    const handleButtonClick = useCallback(
        (e: React.MouseEvent) => {
            if (status === "streaming") {
                e.preventDefault();
                stop();
            }
            // If not loading, the form's onSubmit will handle the submission
        },
        [status, stop]
    );

    // Check if user has scrolled up from the bottom
    const handleScroll = useCallback(() => {
        if (messagesContainerRef.current) {
            const { scrollTop, scrollHeight, clientHeight } =
                messagesContainerRef.current;
            const isAtBottom = scrollTop + clientHeight >= scrollHeight - 100; // 100px threshold
            setShouldAutoScroll(isAtBottom);
        }
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, scrollToBottom]);

    return (
        <div className={styles.chatContainer}>
            <div
                className={styles.messagesContainer}
                ref={messagesContainerRef}
                onScroll={handleScroll}
            >
                {messages.length === 0 && <WelcomeScreen />}

                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={clsx(
                            styles.message,
                            message.role === "user"
                                ? styles.userMessage
                                : styles.assistantMessage
                        )}
                    >
                        <div className={styles.messageRole}>
                            {message.role === "user" ? "You" : "Groq"}
                        </div>
                        <div className={styles.messageContent}>
                            {/* Render tool invocations first */}
                            {message.toolInvocations &&
                                (() => {
                                    const {
                                        searchDocs,
                                        otherTools,
                                        totalSearchedDocs,
                                        hasCompletedSearches,
                                    } = groupToolCalls(message.toolInvocations);
                                    const searchId = `${message.id}-search`;
                                    const isLastMessage =
                                        message.id === messages[messages.length - 1]?.id;
                                    const isCurrentlyLoading = isLastMessage && status === "streaming";

                                    return (
                                        <>
                                            {/* Combined search docs indicator */}
                                            {searchDocs.length > 0 && (
                                                <CombinedSearchIndicator
                                                    searchTools={searchDocs}
                                                    totalDocs={totalSearchedDocs}
                                                    hasCompleted={hasCompletedSearches}
                                                    isExpanded={expandedToolCalls.has(searchId)}
                                                    onToggle={() => toggleToolCall(searchId)}
                                                    isCurrentlyLoading={isCurrentlyLoading}
                                                />
                                            )}

                                            {/* Other tool calls */}
                                            {otherTools.map((toolInvocation, i) => {
                                                const toolCallId = `${message.id}-other-${i}`;
                                                return (
                                                    <ToolCallIndicator
                                                        key={`tool-${toolCallId}`}
                                                        toolCall={toolInvocation}
                                                        isExpanded={expandedToolCalls.has(toolCallId)}
                                                        onToggle={() => toggleToolCall(toolCallId)}
                                                        isCurrentlyLoading={isCurrentlyLoading}
                                                    />
                                                );
                                            })}
                                        </>
                                    );
                                })()}

                            {/* Render message parts */}
                            {message.parts?.map((part, i) => {
                                switch (part.type) {
                                    case "text":
                                        const isLastMessage =
                                            message.id === messages[messages.length - 1]?.id;
                                        const isStreamingMessage = isLastMessage && status === "streaming";

                                        return (
                                            <div
                                                key={`${message.id}-${i}`}
                                                className={styles.markdownContent}
                                            >
                                                {message.role === "user" ? (
                                                    <p>{part.text}</p>
                                                ) : (
                                                    <ChunkedMarkdown
                                                        content={part.text}
                                                        isStreaming={isStreamingMessage}
                                                    />
                                                )}
                                            </div>
                                        );
                                    default:
                                        return null;
                                }
                            })}
                        </div>
                    </div>
                ))}

                {status === "streaming" &&
                    messages.length > 0 &&
                    messages[messages.length - 1].role === "user" && (
                        <div className={clsx(styles.message, styles.assistantMessage)}>
                            <div className={styles.messageRole}>Groq</div>
                            <div className={styles.messageContent}>
                                <div className={styles.markdownContent}>
                                    <div className={styles.loadingDots}>
                                        <div className={styles.loadingDot}></div>
                                        <div className={styles.loadingDot}></div>
                                        <div className={styles.loadingDot}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                <div ref={messagesEndRef} />
            </div>

            <div className={styles.inputContainer}>
                <form onSubmit={handleSubmit} className={styles.inputForm}>
                    <input
                        autoFocus
                        className={styles.input}
                        value={input}
                        placeholder="Ask me about Groq..."
                        onChange={handleInputChange}
                        disabled={status === "streaming"}
                    />
                    <button
                        type="submit"
                        className={clsx(
                            styles.sendButton,
                            status === "streaming" && styles.loadingButton
                        )}
                        disabled={status !== "streaming" && !input.trim()}
                        onClick={handleButtonClick}
                    >
                        {status === "streaming" ? (
                            <div className={styles.loadingIndicator}>
                                <LoaderCircle className={styles.spinner} />
                                <div className={styles.stopSquare} />
                            </div>
                        ) : (
                            <ArrowRight />
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}