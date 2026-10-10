import { useMemo, useState } from "react";
import { FiArrowUpRight, FiCalendar, FiEdit2, FiFilter, FiFolder, FiPlus, FiSearch, FiTrash2, FiUsers } from "react-icons/fi";
import { formatDate, projectStatuses } from "../../data.js";
import styles from "./styles.module.css";

const ProjectsPage = ({ projects, tasks, onNewProject, onEditProject, onDeleteProject }) => {
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("All statuses");
    const filteredProjects = useMemo(() => projects.filter((project) => {
        const matchesSearch = `${project.name} ${project.client} ${project.owner}`.toLowerCase().includes(search.toLowerCase());
        return matchesSearch && (status === "All statuses" || project.status === status);
    }), [projects, search, status]);

    return (
        <div className={styles.page}>
            <section className={styles.intro}>
                <div className={styles.headingLine}>
                    <span className={styles.pageIcon}><FiFolder aria-hidden="true" /></span>
                    <div><h1>Projects</h1><p>Keep every brief, owner, and next milestone connected.</p></div>
                </div>
                <button className={styles.primaryButton} onClick={onNewProject} type="button"><FiPlus aria-hidden="true" /> New project</button>
            </section>

            <section className={styles.controlBar}>
                <label className={styles.searchBox}>
                    <FiSearch aria-hidden="true" />
                    <input aria-label="Search projects" onChange={(event) => setSearch(event.target.value)} placeholder="Find a project, client, or lead" value={search} />
                </label>
                <label className={styles.filterBox}>
                    <FiFilter aria-hidden="true" />
                    <select aria-label="Filter projects by status" onChange={(event) => setStatus(event.target.value)} value={status}>
                        <option>All statuses</option>
                        {projectStatuses.map((item) => <option key={item}>{item}</option>)}
                    </select>
                </label>
                <span className={styles.resultCount}>{filteredProjects.length} {filteredProjects.length === 1 ? "project" : "projects"}</span>
            </section>

            {filteredProjects.length ? (
                <section aria-label="Project list" className={styles.projectGrid}>
                    {filteredProjects.map((project, index) => {
                        const projectTasks = tasks.filter((task) => task.projectId === project.id);
                        const complete = projectTasks.filter((task) => task.status === "Done").length;
                        return (
                            <article className={styles.projectCard} key={project.id}>
                                <div className={styles.cover}>
                                    <img alt={`Work in progress for ${project.name}`} src={`${import.meta.env.BASE_URL}assets/${project.cover}`} />
                                    <span className={styles.projectNumber}>{String(index + 1).padStart(2, "0")}</span>
                                    <button aria-label={`Edit ${project.name}`} className={styles.editIcon} onClick={() => onEditProject(project)} type="button"><FiEdit2 aria-hidden="true" /></button>
                                </div>
                                <div className={styles.cardBody}>
                                    <div className={styles.cardMeta}><span>{project.client}</span><span className={styles.status} data-status={project.status}>{project.status}</span></div>
                                    <button className={styles.projectTitle} onClick={() => onEditProject(project)} type="button">{project.name}</button>
                                    <p className={styles.summary}>{project.summary || "A shared plan for the next delivery milestone."}</p>
                                    <div className={styles.progressHeading}><span>Project progress</span><strong>{project.progress}%</strong></div>
                                    <div aria-label={`${project.progress}% complete`} className={styles.progressTrack}><span style={{ width: `${project.progress}%` }} /></div>
                                    <div className={styles.details}>
                                        <span><FiUsers aria-hidden="true" /> {project.owner}</span>
                                        <span><FiCalendar aria-hidden="true" /> Due {formatDate(project.dueDate, { month: "short", day: "numeric", year: "numeric" })}</span>
                                    </div>
                                    <div className={styles.cardFooter}>
                                        <span>{complete} of {projectTasks.length} tasks done</span>
                                        <button aria-label={`Delete ${project.name}`} className={styles.deleteButton} onClick={() => onDeleteProject(project)} type="button"><FiTrash2 aria-hidden="true" /> Remove</button>
                                    </div>
                                </div>
                                <span className={styles.cornerArrow} aria-hidden="true"><FiArrowUpRight /></span>
                            </article>
                        );
                    })}
                </section>
            ) : (
                <section className={styles.emptyState}>
                    <span className={styles.emptyIcon}><FiSearch aria-hidden="true" /></span>
                    <h2>{projects.length ? "No matching projects" : "Your project space is clear"}</h2>
                    <p>{projects.length ? "Try another search or status filter." : "Add a project to make a plan your team can work from."}</p>
                    {projects.length ? <button className={styles.secondaryButton} onClick={() => { setSearch(""); setStatus("All statuses"); }} type="button">Clear filters</button> : <button className={styles.primaryButton} onClick={onNewProject} type="button"><FiPlus aria-hidden="true" /> Create project</button>}
                </section>
            )}
        </div>
    );
};

export default ProjectsPage;
