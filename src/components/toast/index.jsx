import { useEffect } from "react";
import { FiCheckCircle, FiInfo, FiX, FiXCircle } from "react-icons/fi";
import styles from "./styles.module.css";

const icons = {
    success: <FiCheckCircle aria-hidden="true" />,
    error: <FiXCircle aria-hidden="true" />,
    info: <FiInfo aria-hidden="true" />,
};

const Toast = ({ toast, onDismiss }) => {
    useEffect(() => {
        if (!toast) return undefined;
        const timer = window.setTimeout(onDismiss, 3800);
        return () => window.clearTimeout(timer);
    }, [toast, onDismiss]);

    if (!toast) return null;

    return (
        <div aria-live="polite" className={styles.toast} data-tone={toast.tone} key={toast.id} role={toast.tone === "error" ? "alert" : "status"}>
            <span className={styles.icon}>{icons[toast.tone] || icons.info}</span>
            <p>{toast.message}</p>
            <button aria-label="Dismiss notification" className={styles.close} onClick={onDismiss} type="button"><FiX aria-hidden="true" /></button>
        </div>
    );
};

export default Toast;
