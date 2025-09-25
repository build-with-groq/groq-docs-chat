import clsx from "clsx";
import styles from "../styles.module.css";



/**
 * Renders a tool call indicator for non-search tools
 */
export default function ToolCallIndicator({
    toolCall,
    isExpanded,
    onToggle,
    isCurrentlyLoading,
}: {
    toolCall: any;
    isExpanded: boolean;
    onToggle: () => void;
    isCurrentlyLoading?: boolean;
}) {
    // For other tool calls, show a generic indicator
    if (toolCall.result) {
        return (
            <div className={styles.toolCallContainer}>
                <div
                    className={clsx(styles.toolCall, styles.toolCallCompleted)}
                    onClick={onToggle}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                            onToggle();
                        }
                    }}
                >
                    Completed {toolCall.toolName} {isExpanded ? "▼" : "▶"}
                </div>
                {isExpanded && (
                    <div className={styles.toolDetails}>
                        <div className={styles.toolDetailItem}>
                            <span className={styles.toolDetailLabel}>Tool:</span>
                            <span className={styles.toolDetailValue}>
                                {toolCall.toolName}
                            </span>
                        </div>
                        <div className={styles.toolDetailItem}>
                            <span className={styles.toolDetailLabel}>Status:</span>
                            <span className={styles.toolDetailValue}>Completed</span>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // Only show "Running..." indicator if we're currently loading
    if (isCurrentlyLoading) {
        return (
            <div className={clsx(styles.toolCall, styles.toolCallShimmer)}>
                Running {toolCall.toolName}...
            </div>
        );
    }

    // If not loading and no result, don't show anything
    return null;
}