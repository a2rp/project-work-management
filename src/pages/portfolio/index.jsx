import { FiArrowRight, FiArrowUpRight, FiCalendar, FiCheckCircle, FiClock, FiPlus, FiTrendingUp } from "react-icons/fi";
import { Link } from "react-router-dom";
import { formatDate } from "../../data.js";
import styles from "./styles.module.css";

const PortfolioPage = ({ projects, tasks, onNewProject, onNewTask, onEditProject, onEditTask, onUpdateTask }) => {
    const activeProjects = projects.filter((project) => project.status !== "Complete");
    const openTasks = tasks.filter((task) => task.status !== "Done");
    const dueSoon = [...openTasks].sort((a, b) => a.dueDate.localeCompare(b.dueDate)).slice(0, 4);
    const blockedTasks = tasks.filter((task) => task.status === "Blocked").length;
    const finishedTasks = tasks.filter((task) => task.status === "Done").length;
    const focusProject = activeProjects[0];

    return (
        <div className={styles.page}>
            <section className={styles.intro}>
                <div>
                    <div className={styles.dateLine}><FiCalendar aria-hidden="true" /> {new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric" }).format(new Date())}</div>
                    <h1>Portfolio</h1>
                    <p>A clear view of the plans, people, and decisions moving work forward.</p>
                </div>
                <div className={styles.actions}>
                    <button className={styles.secondaryButton} onClick={onNewTask} type="button"><FiCheckCircle aria-hidden="true" /> Add work</button>
                    <button className={styles.primaryButton} onClick={onNewProject} type="button"><FiPlus aria-hidden="true" /> New project</button>
                </div>
            </section>

            <section aria-label="Portfolio summary" className={styles.metrics}>
                <article className={styles.metric}>
                    <span className={styles.metricIcon}><FiTrendingUp aria-hidden="true" /></span>
                    <div><span>Active projects</span><strong>{activeProjects.length}</strong><small>Across the portfolio</small></div>
                </article>
                <article className={styles.metric}>
                    <span className={styles.metricIcon} data-tone="blue"><FiCheckCircle aria-hidden="true" /></span>
                    <div><span>Open work items</span><strong>{openTasks.length}</strong><small>{finishedTasks} completed this cycle</small></div>
                </article>
                <article className={styles.metric}>
                    <span className={styles.metricIcon} data-tone="amber"><FiClock aria-hidden="true" /></span>
                    <div><span>Needs attention</span><strong>{blockedTasks}</strong><small>{blockedTasks ? "One decision is holding work" : "No blocked work"}</small></div>
                </article>
            </section>

            <section className={styles.focusSection}>
                {focusProject ? (
                    <article className={styles.focusCard}>
                        <img alt="Design research notes and wireframes for the featured project" className={styles.focusImage} src={`${import.meta.env.BASE_URL}assets/${focusProject.cover}`} />
                        <div className={styles.focusOverlay} />
                        <div className={styles.focusCopy}>
                            <span className={styles.focusLabel}>In focus this week</span>
                            <p className={styles.client}>{focusProject.client}</p>
                            <h2>{focusProject.name}</h2>
                            <p className={styles.summary}>{focusProject.summary}</p>
                            <div className={styles.focusFooter}>
                                <span><FiCalendar aria-hidden="true" /> Target {formatDate(focusProject.dueDate, { month: "long", day: "numeric" })}</span>
                                <button onClick={() => onEditProject(focusProject)} type="button">Open plan <FiArrowUpRight aria-hidden="true" /></button>
                            </div>
                        </div>
                        <div className={styles.progressBadge}><strong>{focusProject.progress}%</strong><span>complete</span></div>
                    </article>
                ) : (
                    <div className={styles.emptyFocus}><h2>Start your first project</h2><p>Set up a project to give the team a shared plan.</p><button className={styles.primaryButton} onClick={onNewProject} type="button"><FiPlus aria-hidden="true" /> Create project</button></div>
                )}

                <aside className={styles.weekPanel}>
                    <div className={styles.panelHeading}><div><span className={styles.label}>This week</span><h2>Work to move</h2></div><Link aria-label="See all work" to="/work"><FiArrowUpRight aria-hidden="true" /></Link></div>
                    <div className={styles.weekList}>
                        {dueSoon.map((task) => {
                            const project = projects.find((item) => item.id === task.projectId);
                            return (
                                <article className={styles.weekItem} key={task.id}>
                                    <button aria-label={`Edit ${task.title}`} className={styles.taskCheck} onClick={() => onUpdateTask(task.id, { status: task.status === "Done" ? "Not started" : "Done" })} type="button">
                                        {task.status === "Done" ? <FiCheckCircle aria-hidden="true" /> : <span />}
                                    </button>
                                    <button className={styles.taskText} onClick={() => onEditTask(task)} type="button">
                                        <strong>{task.title}</strong><span>{project?.name || "Unassigned project"} · {task.owner}</span>
                                    </button>
                                    <span className={styles.dueDate}>{formatDate(task.dueDate)}</span>
                                </article>
                            );
                        })}
                        {!dueSoon.length && <p className={styles.emptyText}>All current work is complete. Add a task when the next item is ready.</p>}
                    </div>
                    <Link className={styles.textLink} to="/work">View work list <FiArrowRight aria-hidden="true" /></Link>
                </aside>
            </section>

            <section className={styles.projectsSection}>
                <div className={styles.sectionHeading}>
                    <div><span className={styles.label}>The whole picture</span><h2>Active project plans</h2><p>Progress and next delivery dates, all in one place.</p></div>
                    <Link className={styles.textLink} to="/projects">All projects <FiArrowRight aria-hidden="true" /></Link>
                </div>
                {activeProjects.length ? (
                    <div className={styles.projectRows}>
                        {activeProjects.map((project) => {
                            const projectTasks = tasks.filter((task) => task.projectId === project.id && task.status !== "Done");
                            return (
                                <article className={styles.projectRow} key={project.id}>
                                    <button aria-label={`Edit ${project.name}`} className={styles.projectImageButton} onClick={() => onEditProject(project)} type="button">
                                        <img alt="" src={`${import.meta.env.BASE_URL}assets/${project.cover}`} />
                                    </button>
                                    <button className={styles.projectNameButton} onClick={() => onEditProject(project)} type="button">
                                        <strong>{project.name}</strong><span>{project.client} · Led by {project.owner}</span>
                                    </button>
                                    <span className={styles.status} data-status={project.status}>{project.status}</span>
                                    <div className={styles.progressTrack} aria-label={`${project.progress}% complete`}><span style={{ width: `${project.progress}%` }} /></div>
                                    <span className={styles.progressValue}>{project.progress}%</span>
                                    <span className={styles.taskCount}>{projectTasks.length} open</span>
                                    <span className={styles.targetDate}>Target {formatDate(project.dueDate)}</span>
                                    <Link aria-label={`View ${project.name} timeline`} className={styles.rowArrow} to="/timeline"><FiArrowUpRight aria-hidden="true" /></Link>
                                </article>
                            );
                        })}
                    </div>
                ) : (
                    <div className={styles.emptyProjects}><p>No projects yet.</p><button onClick={onNewProject} type="button">Create the first one <FiArrowRight aria-hidden="true" /></button></div>
                )}
            </section>
            <div className={styles.bottomNote}><span className={styles.noteDot} /> Portfolio numbers update as work changes.</div>
        </div>
    );
};

export default PortfolioPage;
