import { FiArrowLeft, FiCompass } from "react-icons/fi";
import { Link } from "react-router-dom";
import styles from "./styles.module.css";

const NotFoundPage = () => (
    <section className={styles.page}>
        <span className={styles.icon}><FiCompass aria-hidden="true" /></span>
        <p className={styles.code}>404 · Off the plan</p>
        <h1>This page isn’t on the map.</h1>
        <p className={styles.description}>The link may be out of date, or this page may have moved.</p>
        <Link className={styles.homeLink} to="/"><FiArrowLeft aria-hidden="true" /> Back to portfolio</Link>
    </section>
);

export default NotFoundPage;
