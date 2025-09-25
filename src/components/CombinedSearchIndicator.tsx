import clsx from "clsx";
import styles from "../styles.module.css";
import { extractFileNamesFromResponse } from "../lib/utils";

/**
 * Component for displaying combined search results
 */
export default function CombinedSearchIndicator({
    searchTools,
    totalDocs,
    hasCompleted,
    isExpanded,
    onToggle,
    isCurrentlyLoading,
}: {
    searchTools: any[];
    totalDocs: number;
    hasCompleted: boolean;
    isExpanded: boolean;
    onToggle: () => void;
    isCurrentlyLoading?: boolean;
}) {
    const hasRunningSearches = searchTools.some((tool) => !tool.result);

    // If any searches are still running AND we're currently loading, show loading state
    if (hasRunningSearches && isCurrentlyLoading) {
        return (
            <div className={styles.toolCallContainer}>
                <div className={clsx(styles.toolCall, styles.toolCallShimmer)}>
                    Reading docs...
                </div>
            </div>
        );
    }

    // If all searches are completed
    if (hasCompleted) {
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
                    Read {totalDocs} docs
                </div>
                {isExpanded && (
                    <div className={styles.toolDetails}>
                        {searchTools.map((tool, index) => {
                            const toolPages = tool.result
                                ? extractFileNamesFromResponse(tool.result)
                                : [];
                            return (
                                <div key={index} className={styles.toolDetailSection}>
                                    <div className={styles.toolDetailItem}>
                                        <span className={styles.toolDetailLabel}>Search:</span>
                                        <span className={styles.toolDetailValue}>
                                            "{tool.args?.query || "N/A"}"
                                        </span>
                                    </div>
                                    {toolPages.length > 0 && (
                                        <div className={styles.toolDetailItem}>
                                            <span className={styles.toolDetailLabel}>Pages:</span>
                                            <div className={styles.toolDetailValue}>
                                                {[...new Set(toolPages)].map((pageUrl, pageIndex) => {
                                                    // Extract the page name from the URL for display
                                                    const pageName = new URL(pageUrl).pathname;
                                                    return (
                                                        <div
                                                            key={pageIndex}
                                                            className={styles.foundPageItem}
                                                        >
                                                            <a
                                                                href={pageUrl}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className={styles.foundPageLink}
                                                            >
                                                                {pageName}
                                                            </a>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        );
    }

    return null;
}