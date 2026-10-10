import { useEffect, useRef, useState } from "react";
import { FiArrowUpRight, FiCheckSquare, FiCompass, FiGithub, FiMenu, FiPlus, FiX } from "react-icons/fi";
import { NavLink } from "react-router-dom";
import styles from "./styles.module.css";

const links = [
    { label: "Portfolio", to: "/", end: true },
    { label: "Projects", to: "/projects" },
    { label: "Timeline", to: "/timeline" },
    { label: "Work", to: "/work" },
    { label: "Team", to: "/team" },
];

const Header = ({ onNewTask }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [headerHidden, setHeaderHidden] = useState(false);
    const headerRef = useRef(null);

    useEffect(() => {
        if (!menuOpen) return undefined;
        const closeIfOutside = (event) => {
            if (!headerRef.current?.contains(event.target)) setMenuOpen(false);
        };
        const closeOnEscape = (event) => {
            if (event.key === "Escape") setMenuOpen(false);
        };
        document.addEventListener("pointerdown", closeIfOutside);
        document.addEventListener("keydown", closeOnEscape);
        return () => {
            document.removeEventListener("pointerdown", closeIfOutside);
            document.removeEventListener("keydown", closeOnEscape);
        };
    }, [menuOpen]);

    useEffect(() => {
        let previousY = window.scrollY;
        const updateVisibility = () => {
            const currentY = window.scrollY;
            if (menuOpen || currentY <= 8) setHeaderHidden(false);
            else if (currentY > previousY) setHeaderHidden(true);
            else if (currentY < previousY) setHeaderHidden(false);
            previousY = currentY;
        };
        window.addEventListener("scroll", updateVisibility, { passive: true });
        return () => window.removeEventListener("scroll", updateVisibility);
    }, [menuOpen]);

    const closeMenu = () => setMenuOpen(false);

    return (
        <header className={styles.header} data-hidden={headerHidden} ref={headerRef}>
            <div className={styles.inner}>
                <NavLink aria-label="Waypoint portfolio" className={styles.brand} onClick={closeMenu} to="/" end>
                    <span aria-hidden="true" className={styles.brandMark}><FiCompass /></span>
                    <span>waypoint<span className={styles.brandDot}>.</span></span>
                </NavLink>
                <button
                    aria-controls="primary-navigation"
                    aria-expanded={menuOpen}
                    aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
                    className={styles.menuButton}
                    onClick={() => setMenuOpen((open) => !open)}
                    type="button"
                >
                    {menuOpen ? <FiX /> : <FiMenu />}
                </button>
                <nav aria-label="Main navigation" className={menuOpen ? styles.navigationOpen : styles.navigation} id="primary-navigation">
                    {links.map((item) => (
                        <NavLink
                            className={({ isActive }) => isActive ? styles.activeLink : styles.link}
                            end={item.end}
                            key={item.to}
                            onClick={closeMenu}
                            to={item.to}
                        >
                            {item.label}
                        </NavLink>
                    ))}
                    <button className={styles.quickAction} onClick={() => { closeMenu(); onNewTask(); }} type="button">
                        <FiPlus aria-hidden="true" /> <span>New task</span>
                    </button>
                    <a className={styles.repository} href="https://github.com/a2rp/project-work-management" rel="noreferrer" target="_blank">
                        <FiGithub aria-hidden="true" /> <span>Repository</span><FiArrowUpRight aria-hidden="true" className={styles.externalIcon} />
                    </a>
                </nav>
                <button className={styles.mobileAction} onClick={onNewTask} type="button">
                    <FiCheckSquare aria-hidden="true" /> <span>New task</span>
                </button>
            </div>
        </header>
    );
};

export default Header;
