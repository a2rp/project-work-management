import { useEffect, useRef, useState } from "react";
import { FiAlertTriangle, FiCalendar, FiCheck, FiFolder, FiX } from "react-icons/fi";
import { initialProjects, projectCovers, projectStatuses, taskStatuses, teamMembers } from "../../data.js";
import styles from "./styles.module.css";

const today = "2026-10-10";

const DialogHost = ({ dialog, projects, tasks, onClose, onDelete, onSaveProject, onSaveTask }) => {
    const dialogRef = useRef(null);
    const [values, setValues] = useState(() => dialog.record ? { ...dialog.record } : dialog.kind === "project" ? {
        name: "", client: "", owner: teamMembers[0].name, status: "Planning", progress: 0,
        startDate: today, dueDate: "2026-11-06", cover: projectCovers[0].value, summary: "",
    } : {
        title: "", projectId: projects[0]?.id || "", owner: teamMembers[0].name,
        status: "Not started", priority: "Medium", dueDate: today,
    });
    const [error, setError] = useState("");

    useEffect(() => {
        if (!dialog) return undefined;
        dialogRef.current?.focus();
        const closeOnEscape = (event) => {
            if (event.key === "Escape") onClose();
        };
        document.addEventListener("keydown", closeOnEscape);
        return () => document.removeEventListener("keydown", closeOnEscape);
    }, [dialog, onClose, projects]);

    if (!dialog) return null;

    const updateValue = (event) => {
        const { name, value } = event.target;
        setValues((current) => ({ ...current, [name]: name === "progress" ? Number(value) : value }));
        setError("");
    };

    const submitProject = (event) => {
        event.preventDefault();
        if (values.dueDate < values.startDate) {
            setError("The due date must be after the start date.");
            return;
        }
        onSaveProject(values);
    };

    const submitTask = (event) => {
        event.preventDefault();
        if (!projects.length) {
            setError("Add a project before scheduling work.");
            return;
        }
        onSaveTask(values);
    };

    const isEdit = Boolean(dialog.record?.id);
    const projectDeleteCount = dialog.kind === "confirm" && dialog.type === "project"
        ? tasks.filter((task) => task.projectId === dialog.record.id).length
        : 0;

    return (
        <div className={styles.backdrop} onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
            <section aria-labelledby="dialog-title" aria-modal="true" className={styles.dialog} ref={dialogRef} role="dialog" tabIndex={-1}>
                <header className={styles.dialogHeader}>
                    <div className={styles.headingIcon} data-danger={dialog.kind === "confirm"}>
                        {dialog.kind === "confirm" ? <FiAlertTriangle aria-hidden="true" /> : dialog.kind === "project" ? <FiFolder aria-hidden="true" /> : <FiCalendar aria-hidden="true" />}
                    </div>
                    <div className={styles.headingText}>
                        <h2 id="dialog-title">{dialog.kind === "confirm" ? `Remove ${dialog.type}` : `${isEdit ? "Edit" : "Add"} ${dialog.kind}`}</h2>
                        <p>{dialog.kind === "confirm" ? "This change cannot be undone." : `Keep ${dialog.kind === "project" ? "the project plan" : "the team plan"} up to date.`}</p>
                    </div>
                    <button aria-label="Close dialog" className={styles.closeButton} onClick={onClose} type="button"><FiX aria-hidden="true" /></button>
                </header>

                {dialog.kind === "confirm" ? (
                    <div className={styles.confirmBody}>
                        <p>Remove <strong>{dialog.record?.name || dialog.record?.title}</strong> from this workspace?</p>
                        {projectDeleteCount > 0 && <p className={styles.warning}>{projectDeleteCount} linked {projectDeleteCount === 1 ? "task will" : "tasks will"} also be removed.</p>}
                        <div className={styles.actions}>
                            <button className={styles.secondaryButton} onClick={onClose} type="button">Keep it</button>
                            <button className={styles.dangerButton} onClick={onDelete} type="button">Remove {dialog.type}</button>
                        </div>
                    </div>
                ) : dialog.kind === "project" ? (
                    <form className={styles.form} onSubmit={submitProject}>
                        <label className={styles.field}>
                            <span>Project name</span>
                            <input autoComplete="off" maxLength={72} name="name" onChange={updateValue} placeholder="e.g. Customer portal rebuild" required value={values.name || ""} />
                        </label>
                        <div className={styles.fieldRow}>
                            <label className={styles.field}>
                                <span>Client or team</span>
                                <input maxLength={48} name="client" onChange={updateValue} placeholder="e.g. Atlas Health" required value={values.client || ""} />
                            </label>
                            <label className={styles.field}>
                                <span>Project lead</span>
                                <select name="owner" onChange={updateValue} value={values.owner || teamMembers[0].name}>
                                    {teamMembers.map((member) => <option key={member.name} value={member.name}>{member.name}</option>)}
                                </select>
                            </label>
                        </div>
                        <div className={styles.fieldRow}>
                            <label className={styles.field}>
                                <span>Start date</span>
                                <input name="startDate" onChange={updateValue} required type="date" value={values.startDate || today} />
                            </label>
                            <label className={styles.field}>
                                <span>Target date</span>
                                <input name="dueDate" onChange={updateValue} required type="date" value={values.dueDate || today} />
                            </label>
                        </div>
                        <div className={styles.fieldRow}>
                            <label className={styles.field}>
                                <span>Status</span>
                                <select name="status" onChange={updateValue} value={values.status || projectStatuses[0]}>
                                    {projectStatuses.map((status) => <option key={status}>{status}</option>)}
                                </select>
                            </label>
                            <label className={styles.field}>
                                <span>Progress, {values.progress || 0}%</span>
                                <input max="100" min="0" name="progress" onChange={updateValue} type="range" value={values.progress ?? 0} />
                            </label>
                        </div>
                        <label className={styles.field}>
                            <span>Project image</span>
                            <select name="cover" onChange={updateValue} value={values.cover || initialProjects[0].cover}>
                                {projectCovers.map((cover) => <option key={cover.value} value={cover.value}>{cover.label}</option>)}
                            </select>
                        </label>
                        <label className={styles.field}>
                            <span>What is the project about?</span>
                            <textarea maxLength={180} name="summary" onChange={updateValue} placeholder="A short note to help the team stay aligned" rows="2" value={values.summary || ""} />
                        </label>
                        {error && <p className={styles.errorMessage}>{error}</p>}
                        <div className={styles.actions}>
                            <button className={styles.secondaryButton} onClick={onClose} type="button">Cancel</button>
                            <button className={styles.primaryButton} type="submit"><FiCheck aria-hidden="true" /> {isEdit ? "Save changes" : "Create project"}</button>
                        </div>
                    </form>
                ) : (
                    <form className={styles.form} onSubmit={submitTask}>
                        {!projects.length && <p className={styles.warning}>There are no projects yet. Add a project before scheduling this task.</p>}
                        <label className={styles.field}>
                            <span>Task name</span>
                            <input autoComplete="off" maxLength={100} name="title" onChange={updateValue} placeholder="What needs to move forward?" required value={values.title || ""} />
                        </label>
                        <label className={styles.field}>
                            <span>Project</span>
                            <select disabled={!projects.length} name="projectId" onChange={updateValue} required value={values.projectId || ""}>
                                {projects.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}
                            </select>
                        </label>
                        <div className={styles.fieldRow}>
                            <label className={styles.field}>
                                <span>Owner</span>
                                <select name="owner" onChange={updateValue} value={values.owner || teamMembers[0].name}>
                                    {teamMembers.map((member) => <option key={member.name} value={member.name}>{member.name}</option>)}
                                </select>
                            </label>
                            <label className={styles.field}>
                                <span>Due date</span>
                                <input name="dueDate" onChange={updateValue} required type="date" value={values.dueDate || today} />
                            </label>
                        </div>
                        <div className={styles.fieldRow}>
                            <label className={styles.field}>
                                <span>Status</span>
                                <select name="status" onChange={updateValue} value={values.status || taskStatuses[0]}>
                                    {taskStatuses.map((status) => <option key={status}>{status}</option>)}
                                </select>
                            </label>
                            <label className={styles.field}>
                                <span>Priority</span>
                                <select name="priority" onChange={updateValue} value={values.priority || "Medium"}>
                                    {["Low", "Medium", "High"].map((priority) => <option key={priority}>{priority}</option>)}
                                </select>
                            </label>
                        </div>
                        {error && <p className={styles.errorMessage}>{error}</p>}
                        <div className={styles.actions}>
                            <button className={styles.secondaryButton} onClick={onClose} type="button">Cancel</button>
                            <button className={styles.primaryButton} disabled={!projects.length} type="submit"><FiCheck aria-hidden="true" /> {isEdit ? "Save changes" : "Add task"}</button>
                        </div>
                    </form>
                )}
            </section>
        </div>
    );
};

export default DialogHost;
