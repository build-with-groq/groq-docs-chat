import { memo } from "react";
import styles from "../styles.module.css";

/**
 * A styled anchor element that opens https links in a new tab.
 */
const CustomLink = memo(function CustomLink({
    href,
    children,
}: {
    href?: string;
    children: React.ReactNode;
}) {
    const isHttps = href?.startsWith("https");

    return (
        <a
            href={href}
            target={isHttps ? "_blank" : undefined}
            rel={isHttps ? "noopener noreferrer" : undefined}
            className={styles.markdownLink}
        >
            {children}
        </a>
    );
});

export default CustomLink;