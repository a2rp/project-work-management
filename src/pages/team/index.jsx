import { FiArrowUpRight, FiCheckCircle, FiClock, FiUsers } from "react-icons/fi";
import { Link } from "react-router-dom";
import { initials, teamMembers } from "../../data.js";
import styles from "./styles.module.css";

const TeamPage = ({ projects, tasks, onEditTask }) => {
    const openTasks = tasks.filter((task) => task.status !== "Done");
    const blockedTasks = tasks.filter((task) => task.status === "Blocked");
    const members = teamMembers.map((member) => {
        const memberTasks = tasks.filter((task) => task.owner === member.name);
        const active = memberTasks.filter((task) => task.status !== "Done");
        const memberProjects = projects.filter((project) => project.owner === member.name || memberTasks.some((task) => task.projectId === project.id));
        return { ...member, memberTasks, active, memberProjects };
    });

    return (
        <div className={styles.page}>
            <section className={styles.intro}>
                <div><span className={styles.label}>People and focus</span><h1>Team workload</h1><p>See who has room to take on the next piece of work.</p></div>
                <Link className={styles.viewLink} to="/work">Open work queue <FiArrowUpRight aria-hidden="true" /></Link>
            </section>

            <section aria-label="Team summary" className={styles.summaryStrip}>
                <div><span className={styles.summaryIcon}><FiUsers aria-hidden="true" /></span><span className={styles.summaryCopy}><small>People in this workspace</small><strong>{members.length}</strong></span></div>
                <div><span className={styles.summaryIcon} data-tone="green"><FiCheckCircle aria-hidden="true" /></span><span className={styles.summaryCopy}><small>Open tasks assigned</small><strong>{openTasks.length}</strong></span></div>
                <div><span className={styles.summaryIcon} data-tone="amber"><FiClock aria-hidden="true" /></span><span className={styles.summaryCopy}><small>Waiting on a decision</small><strong>{blockedTasks.length}</strong></span></div>
            </section>

            <section className={styles.memberGrid}>
                {members.map((member) => {
                    const capacity = Math.min(member.active.length / 6 * 100, 100);
                    const level = member.active.length >= 5 ? "Busy" : member.active.length >= 3 ? "Steady" : "Room available";
                    const latestTasks = [...member.memberTasks].sort((a, b) => a.dueDate.localeCompare(b.dueDate)).slice(0, 3);
                    return (
                        <article className={styles.memberCard} key={member.name}>
                            <div className={styles.memberHeading}>
                                <span className={styles.avatar} data-color={member.color}>{initials(member.name)}</span>
                                <div><h2>{member.name}</h2><p>{member.role}</p></div>
                                <Link aria-label={`See ${member.name}'s tasks`} className={styles.arrowLink} to={`/work?owner=${encodeURIComponent(member.name)}`}><FiArrowUpRight aria-hidden="true" /></Link>
                            </div>
                            <div className={styles.capacityHeading}><span>Open workload</span><strong>{member.active.length} tasks · {level}</strong></div>
                            <div aria-label={`${Math.round(capacity)} percent workload`} className={styles.capacityTrack}><span data-level={level} style={{ width: `${capacity}%` }} /></div>
                            <div className={styles.projectsLabel}>Projects in motion <span>{member.memberProjects.length}</span></div>
                            <div className={styles.projectTags}>
                                {member.memberProjects.slice(0, 2).map((project) => <span key={project.id}>{project.name}</span>)}
                                {!member.memberProjects.length && <span className={styles.noProject}>No active project</span>}
                                {member.memberProjects.length > 2 && <span>+{member.memberProjects.length - 2} more</span>}
                            </div>
                            <div className={styles.taskPreview}>
                                <div className={styles.previewLabel}>Next up</div>
                                {latestTasks.length ? latestTasks.map((task) => (
                                    <button className={styles.taskLine} key={task.id} onClick={() => onEditTask(task)} type="button">
                                        <span className={styles.taskStatus} data-status={task.status} />
                                        <span>{task.title}</span>
                                        <small>{task.status}</small>
                                    </button>
                                )) : <p className={styles.emptyTasks}>Nothing assigned yet. This teammate has room for new work.</p>}
                            </div>
                        </article>
                    );
                })}
            </section>
            <p className={styles.note}>Workload uses each person’s open task count. It is a planning signal, not a time-tracking estimate.</p>
        </div>
    );
};

export default TeamPage;
