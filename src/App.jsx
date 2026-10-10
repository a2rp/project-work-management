import { useState } from "react";
import AppRoutes from "./AppRoutes.jsx";
import styles from "./App.module.css";
import Footer from "./components/footer/index.jsx";
import Header from "./components/header/index.jsx";
import DialogHost from "./components/dialog/index.jsx";
import Toast from "./components/toast/index.jsx";
import { initialProjects, initialTasks } from "./data.js";

const App = () => {
    const [projects, setProjects] = useState(initialProjects);
    const [tasks, setTasks] = useState(initialTasks);
    const [dialog, setDialog] = useState(null);
    const [toast, setToast] = useState(null);

    const notify = (message, tone = "success") => {
        setToast({ id: Date.now(), message, tone });
    };

    const openProjectForm = (project = null) => setDialog({ kind: "project", record: project });
    const openTaskForm = (task = null) => setDialog({ kind: "task", record: task });
    const confirmDelete = (type, record) => setDialog({ kind: "confirm", type, record });

    const saveProject = (values) => {
        if (values.id) {
            setProjects((current) => current.map((project) => project.id === values.id ? values : project));
            notify("Project updated");
        } else {
            setProjects((current) => [{ ...values, id: `project-${Date.now()}` }, ...current]);
            notify("Project added to your portfolio");
        }
        setDialog(null);
    };

    const saveTask = (values) => {
        if (values.id) {
            setTasks((current) => current.map((task) => task.id === values.id ? values : task));
            notify("Task updated");
        } else {
            setTasks((current) => [{ ...values, id: `task-${Date.now()}` }, ...current]);
            notify("Task added to the plan");
        }
        setDialog(null);
    };

    const updateTask = (taskId, changes) => {
        setTasks((current) => current.map((task) => task.id === taskId ? { ...task, ...changes } : task));
        if (changes.status) notify(changes.status === "Done" ? "Task marked complete" : `Task moved to ${changes.status}`);
    };

    const deleteRecord = () => {
        const { type, record } = dialog;
        if (type === "project") {
            const linkedCount = tasks.filter((task) => task.projectId === record.id).length;
            setProjects((current) => current.filter((project) => project.id !== record.id));
            setTasks((current) => current.filter((task) => task.projectId !== record.id));
            notify(linkedCount ? `Project and ${linkedCount} linked tasks removed` : "Project removed");
        } else {
            setTasks((current) => current.filter((task) => task.id !== record.id));
            notify("Task removed");
        }
        setDialog(null);
    };

    const sharedProps = {
        projects,
        tasks,
        onNewProject: () => openProjectForm(),
        onNewTask: () => openTaskForm(),
        onEditProject: openProjectForm,
        onEditTask: openTaskForm,
        onDeleteProject: (project) => confirmDelete("project", project),
        onDeleteTask: (task) => confirmDelete("task", task),
        onUpdateTask: updateTask,
        onNotify: notify,
    };

    return (
        <div className={styles.app}>
            <a className={styles.skipLink} href="#main-content">Skip to content</a>
            <Header onNewProject={sharedProps.onNewProject} onNewTask={sharedProps.onNewTask} />
            <main className={styles.main} id="main-content">
                <AppRoutes {...sharedProps} />
            </main>
            <Footer />
            {dialog && <DialogHost
                dialog={dialog}
                key={`${dialog.kind}-${dialog.type || ""}-${dialog.record?.id || "new"}`}
                projects={projects}
                tasks={tasks}
                onClose={() => setDialog(null)}
                onDelete={deleteRecord}
                onSaveProject={saveProject}
                onSaveTask={saveTask}
            />}
            <Toast toast={toast} onDismiss={() => setToast(null)} />
        </div>
    );
};

export default App;
