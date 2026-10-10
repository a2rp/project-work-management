import { useMemo, useState } from "react";
import { FiArrowUpRight, FiCalendar, FiChevronDown, FiClock, FiFlag, FiPlus, FiZoomIn, FiZoomOut } from "react-icons/fi";
import { Link } from "react-router-dom";
import { formatDate } from "../../data.js";
import styles from "./styles.module.css";

const timelineStart = new Date("2026-10-05T12:00:00");
const dayOffset = (dateValue) => Math.round((new Date(`${dateValue}T12:00:00`) - timelineStart) / 86400000);

const TimelinePage = ({ projects, tasks, onNewProject, onEditProject, onEditTask }) => {
    const [ownerFilter, setOwnerFilter] = useState("Everyone");
    const [weeks, setWeeks] = useState(5);
    const owners = [...new Set(projects.map((project) => project.owner))];
    const filteredProjects = useMemo(() => projects
        .filter((project) => ownerFilter === "Everyone" || project.owner === ownerFilter)
        .sort((a, b) => a.startDate.localeCompare(b.startDate)), [projects, ownerFilter]);
    const weekDays = Array.from({ length: weeks }, (_, week) => {
        const start = new Date(timelineStart);
        start.setDate(start.getDate() + week * 7);
        return start;
    });
    const rangeDays = weeks * 7;

    return (
        <div className={styles.page}>
            <section className={styles.intro}>
                <div>
                    <div className={styles.path}><span>Planning</span><span>/</span><strong>Timeline</strong></div>
                    <h1>Timeline</h1>
                    <p>See how project dates overlap before they become delivery pressure.</p>
                </div>
                <div className={styles.actions}>
                    <button className={styles.secondaryButton} onClick={() => setWeeks((current) => current === 5 ? 4 : 5)} type="button">
                        {weeks === 5 ? <FiZoomOut aria-hidden="true" /> : <FiZoomIn aria-hidden="true" />}
                        {weeks === 5 ? "4 weeks" : "5 weeks"}
                    </button>
                    <button className={styles.primaryButton} onClick={onNewProject} type="button"><FiPlus aria-hidden="true" /> Add project</button>
                </div>
            </section>

            <section className={styles.filters}>
                <div className={styles.rangePill}><FiCalendar aria-hidden="true" /><span>Oct 5 - Nov {weeks === 5 ? "8" : "1"}, 2026</span><FiChevronDown aria-hidden="true" /></div>
                <label className={styles.ownerSelect}><span>Project lead</span><select aria-label="Filter by project lead" onChange={(event) => setOwnerFilter(event.target.value)} value={ownerFilter}><option>Everyone</option>{owners.map((owner) => <option key={owner}>{owner}</option>)}</select></label>
                <span className={styles.projectCount}>{filteredProjects.length} projects in view</span>
            </section>

            <section aria-label="Project schedule" className={styles.timelineCard}>
                <div className={styles.timelineHeader}>
                    <div className={styles.projectLabel}><FiFlag aria-hidden="true" /><span>Project</span></div>
                    <div className={styles.weekHeader} style={{ "--week-count": weeks }}>
                        {weekDays.map((date, index) => <div className={styles.weekCell} key={date.toISOString()}><strong>Week {index + 1}</strong><span>{formatDate(date.toISOString().slice(0, 10))}</span></div>)}
                    </div>
                </div>
                {filteredProjects.length ? filteredProjects.map((project) => {
                    const start = dayOffset(project.startDate);
                    const end = dayOffset(project.dueDate) + 1;
                    const clippedStart = Math.max(0, start);
                    const clippedEnd = Math.min(rangeDays, end);
                    const left = Math.max(0, clippedStart / rangeDays * 100);
                    const width = Math.max(0, (clippedEnd - clippedStart) / rangeDays * 100);
                    const projectTasks = tasks.filter((task) => task.projectId === project.id && dayOffset(task.dueDate) >= 0 && dayOffset(task.dueDate) < rangeDays);
                    return (
                        <div className={styles.projectRow} key={project.id}>
                            <div className={styles.projectInfo}>
                                <button aria-label={`Edit ${project.name}`} className={styles.projectImage} onClick={() => onEditProject(project)} type="button"><img alt="" src={`${import.meta.env.BASE_URL}assets/${project.cover}`} /></button>
                                <button className={styles.projectDetails} onClick={() => onEditProject(project)} type="button"><strong>{project.name}</strong><span>{project.owner} · {formatDate(project.dueDate)}</span></button>
                                <span className={styles.progress}>{project.progress}%</span>
                            </div>
                            <div className={styles.track} style={{ "--week-count": weeks }}>
                                <div className={styles.todayLine} style={{ left: `${5 / rangeDays * 100}%` }}><span>Today</span></div>
                                {width > 0 && <button aria-label={`Edit schedule for ${project.name}`} className={styles.projectBar} onClick={() => onEditProject(project)} style={{ left: `${left}%`, width: `${width}%` }} type="button">
                                    <span className={styles.barFill} style={{ width: `${project.progress}%` }} />
                                    <span className={styles.barLabel}>{project.name}</span>
                                </button>}
                                {projectTasks.map((task) => {
                                    const position = Math.max(0, dayOffset(task.dueDate) / rangeDays * 100);
                                    return <button aria-label={`Edit task: ${task.title}, due ${formatDate(task.dueDate)}`} className={styles.milestone} key={task.id} onClick={() => onEditTask(task)} style={{ left: `${position}%` }} title={task.title} type="button"><span><FiFlag aria-hidden="true" /></span></button>;
                                })}
                            </div>
                        </div>
                    );
                }) : (
                    <div className={styles.emptyState}><h2>No projects in this view</h2><p>Add a project or choose another lead to see a schedule.</p><button className={styles.secondaryButton} onClick={() => setOwnerFilter("Everyone")} type="button">Show everyone</button></div>
                )}
                <div className={styles.timelineLegend}><span><i className={styles.legendBar} /> Project window</span><span><i className={styles.legendMilestone}><FiFlag aria-hidden="true" /></i> Task due date</span><span><i className={styles.legendToday} /> Today</span></div>
            </section>

            <section className={styles.upcoming}>
                <div><span className={styles.label}>Keep the next handoff visible</span><h2>Upcoming task dates</h2></div>
                <Link to="/work">Open work list <FiArrowUpRight aria-hidden="true" /></Link>
                <div className={styles.upcomingList}>
                    {[...tasks].filter((task) => task.status !== "Done").sort((a, b) => a.dueDate.localeCompare(b.dueDate)).slice(0, 3).map((task) => {
                        const project = projects.find((item) => item.id === task.projectId);
                        return <button className={styles.upcomingItem} key={task.id} onClick={() => onEditTask(task)} type="button"><span className={styles.dateBox}>{formatDate(task.dueDate, { month: "short" })}<strong>{new Date(`${task.dueDate}T12:00:00`).getDate()}</strong></span><span className={styles.taskCopy}><strong>{task.title}</strong><span>{project?.name || "Project removed"} · {task.owner}</span></span><FiClock aria-hidden="true" className={styles.clockIcon} /></button>;
                    })}
                    {!tasks.some((task) => task.status !== "Done") && <p className={styles.emptyText}>There are no open tasks on the schedule.</p>}
                </div>
            </section>
        </div>
    );
};

export default TimelinePage;
