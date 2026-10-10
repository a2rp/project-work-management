import { useMemo, useState } from "react";
import { FiArrowDown, FiCalendar, FiCheck, FiCheckSquare, FiEdit2, FiFilter, FiPlus, FiSearch, FiTrash2 } from "react-icons/fi";
import { useSearchParams } from "react-router-dom";
import { formatDate, taskStatuses } from "../../data.js";
import styles from "./styles.module.css";

const WorkPage = ({ projects, tasks, onNewTask, onEditTask, onDeleteTask, onUpdateTask }) => {
    const [searchParams] = useSearchParams();
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All status");
    const [projectFilter, setProjectFilter] = useState("All projects");
    const [ownerFilter, setOwnerFilter] = useState(() => searchParams.get("owner") || "Everyone");
    const [sortBy, setSortBy] = useState("Due date");
    const owners = [...new Set(tasks.map((task) => task.owner))];
    const filteredTasks = useMemo(() => {
        const result = tasks.filter((task) => {
            const project = projects.find((item) => item.id === task.projectId);
            const matchesSearch = `${task.title} ${task.owner} ${project?.name || ""}`.toLowerCase().includes(search.toLowerCase());
            return matchesSearch
                && (statusFilter === "All status" || task.status === statusFilter)
                && (projectFilter === "All projects" || task.projectId === projectFilter)
                && (ownerFilter === "Everyone" || task.owner === ownerFilter);
        });
        return result.sort((a, b) => {
            if (sortBy === "Task name") return a.title.localeCompare(b.title);
            if (sortBy === "Priority") return ["High", "Medium", "Low"].indexOf(a.priority) - ["High", "Medium", "Low"].indexOf(b.priority);
            return a.dueDate.localeCompare(b.dueDate);
        });
    }, [ownerFilter, projectFilter, projects, search, sortBy, statusFilter, tasks]);
    const clearFilters = () => { setSearch(""); setStatusFilter("All status"); setProjectFilter("All projects"); setOwnerFilter("Everyone"); };

    return (
        <div className={styles.page}>
            <section className={styles.intro}>
                <div className={styles.titleBlock}>
                    <span className={styles.titleIcon}><FiCheckSquare aria-hidden="true" /></span>
                    <div><span className={styles.label}>Shared work queue</span><h1>Work</h1><p>Every next step has an owner, a date, and a project.</p></div>
                </div>
                <button className={styles.primaryButton} onClick={onNewTask} type="button"><FiPlus aria-hidden="true" /> Add task</button>
            </section>

            <section className={styles.filterPanel}>
                <label className={styles.searchBox}><FiSearch aria-hidden="true" /><input aria-label="Search work" onChange={(event) => setSearch(event.target.value)} placeholder="Search tasks or people" value={search} /></label>
                <label className={styles.selectBox}><FiFilter aria-hidden="true" /><select aria-label="Filter by status" onChange={(event) => setStatusFilter(event.target.value)} value={statusFilter}><option>All status</option>{taskStatuses.map((status) => <option key={status}>{status}</option>)}</select></label>
                <label className={styles.selectBox}><select aria-label="Filter by project" onChange={(event) => setProjectFilter(event.target.value)} value={projectFilter}><option>All projects</option>{projects.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}</select></label>
                <label className={styles.selectBox}><select aria-label="Filter by owner" onChange={(event) => setOwnerFilter(event.target.value)} value={ownerFilter}><option>Everyone</option>{owners.map((owner) => <option key={owner}>{owner}</option>)}</select></label>
                <label className={styles.sortBox}><span>Sort</span><select aria-label="Sort work" onChange={(event) => setSortBy(event.target.value)} value={sortBy}><option>Due date</option><option>Priority</option><option>Task name</option></select><FiArrowDown aria-hidden="true" /></label>
            </section>

            <section className={styles.tableShell}>
                <div className={styles.tableHeader}><div><h2>Team work</h2><p>{filteredTasks.length} of {tasks.length} tasks shown</p></div><span className={styles.dateRange}><FiCalendar aria-hidden="true" /> October 2026</span></div>
                {filteredTasks.length ? (
                    <div className={styles.tableScroll}>
                        <table>
                            <thead><tr><th scope="col">Task</th><th scope="col">Project</th><th scope="col">Owner</th><th scope="col">Due date</th><th scope="col">Priority</th><th scope="col">Status</th><th scope="col"><span className={styles.srOnly}>Actions</span></th></tr></thead>
                            <tbody>
                                {filteredTasks.map((task) => {
                                    const project = projects.find((item) => item.id === task.projectId);
                                    return (
                                        <tr key={task.id}>
                                            <td><div className={styles.taskName}>
                                                <button aria-label={task.status === "Done" ? `Reopen ${task.title}` : `Mark ${task.title} complete`} className={styles.checkButton} data-checked={task.status === "Done"} onClick={() => onUpdateTask(task.id, { status: task.status === "Done" ? "Not started" : "Done" })} type="button">{task.status === "Done" && <FiCheck aria-hidden="true" />}</button>
                                                <button className={styles.taskTitle} onClick={() => onEditTask(task)} type="button"><strong>{task.title}</strong><span>{task.status === "Blocked" ? "Needs a decision" : task.status === "Done" ? "Completed" : "Assigned work"}</span></button>
                                            </div></td>
                                            <td><span className={styles.projectName}>{project?.name || "Project removed"}</span></td>
                                            <td><span className={styles.owner}><span className={styles.avatar}>{task.owner.split(" ").map((part) => part[0]).slice(0, 2).join("")}</span>{task.owner}</span></td>
                                            <td><span className={styles.date}>{formatDate(task.dueDate, { month: "short", day: "numeric" })}</span></td>
                                            <td><span className={styles.priority} data-priority={task.priority}>{task.priority}</span></td>
                                            <td><label className={styles.statusSelect}><select aria-label={`Change ${task.title} status`} onChange={(event) => onUpdateTask(task.id, { status: event.target.value })} value={task.status}>{taskStatuses.map((status) => <option key={status}>{status}</option>)}</select></label></td>
                                            <td><div className={styles.rowActions}><button aria-label={`Edit ${task.title}`} onClick={() => onEditTask(task)} type="button"><FiEdit2 aria-hidden="true" /></button><button aria-label={`Delete ${task.title}`} onClick={() => onDeleteTask(task)} type="button"><FiTrash2 aria-hidden="true" /></button></div></td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className={styles.emptyState}><span><FiSearch aria-hidden="true" /></span><h3>{tasks.length ? "No work matches these filters" : "No work on the board yet"}</h3><p>{tasks.length ? "Clear a filter or search for a different task." : "Add the first task to a project plan."}</p>{tasks.length ? <button className={styles.secondaryButton} onClick={clearFilters} type="button">Clear filters</button> : <button className={styles.primaryButton} onClick={onNewTask} type="button"><FiPlus aria-hidden="true" /> Add task</button>}</div>
                )}
            </section>
            <p className={styles.note}>Updating a task here also updates its project schedule and the team workload view.</p>
        </div>
    );
};

export default WorkPage;
