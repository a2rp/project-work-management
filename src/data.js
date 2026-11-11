const dateFromToday = (offsetDays) => {
    const date = new Date();
    date.setHours(12, 0, 0, 0);
    date.setDate(date.getDate() + offsetDays);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

export const initialProjects = [
    {
        id: "project-1",
        name: "Customer portal rebuild",
        client: "Atlas Health",
        owner: "Maya Chen",
        status: "On track",
        progress: 64,
        startDate: dateFromToday(-21),
        dueDate: dateFromToday(8),
        cover: "product-discovery.jpg",
        summary: "A clearer member experience, from first sign-in to care plan.",
    },
    {
        id: "project-2",
        name: "Mobile checkout refresh",
        client: "Lumen Supply",
        owner: "Sofia Patel",
        status: "Needs attention",
        progress: 42,
        startDate: dateFromToday(-14),
        dueDate: dateFromToday(3),
        cover: "design-system.jpg",
        summary: "Reduce checkout friction across the Lumen mobile storefront.",
    },
    {
        id: "project-3",
        name: "Field research sprint",
        client: "Fieldnote",
        owner: "Jordan Lee",
        status: "On track",
        progress: 78,
        startDate: dateFromToday(-28),
        dueDate: dateFromToday(12),
        cover: "research-workshop.jpg",
        summary: "Turn five customer interviews into a focused product direction.",
    },
    {
        id: "project-4",
        name: "Design system 2.0",
        client: "Internal",
        owner: "Noah Williams",
        status: "Planning",
        progress: 18,
        startDate: dateFromToday(-7),
        dueDate: dateFromToday(18),
        cover: "design-system.jpg",
        summary: "Create a shared component foundation for the next release cycle.",
    },
];

export const initialTasks = [
    { id: "task-1", title: "Approve member dashboard flow", projectId: "project-1", owner: "Maya Chen", status: "In progress", priority: "High", dueDate: dateFromToday(1) },
    { id: "task-2", title: "Review accessibility findings", projectId: "project-1", owner: "Jordan Lee", status: "In progress", priority: "High", dueDate: dateFromToday(2) },
    { id: "task-3", title: "Map appointment booking journey", projectId: "project-1", owner: "Noah Williams", status: "Not started", priority: "Medium", dueDate: dateFromToday(4) },
    { id: "task-4", title: "Prototype saved payment states", projectId: "project-2", owner: "Sofia Patel", status: "Blocked", priority: "High", dueDate: dateFromToday(0) },
    { id: "task-5", title: "Test address entry on mobile", projectId: "project-2", owner: "Ethan Cole", status: "In progress", priority: "Medium", dueDate: dateFromToday(5) },
    { id: "task-6", title: "Synthesize interview notes", projectId: "project-3", owner: "Jordan Lee", status: "Done", priority: "Medium", dueDate: dateFromToday(-2) },
    { id: "task-7", title: "Share opportunity summary", projectId: "project-3", owner: "Maya Chen", status: "In progress", priority: "High", dueDate: dateFromToday(3) },
    { id: "task-8", title: "Audit current component library", projectId: "project-4", owner: "Noah Williams", status: "Not started", priority: "Low", dueDate: dateFromToday(8) },
    { id: "task-9", title: "Define token naming structure", projectId: "project-4", owner: "Sofia Patel", status: "Not started", priority: "Medium", dueDate: dateFromToday(10) },
    { id: "task-10", title: "Prepare next steering review", projectId: "project-1", owner: "Ethan Cole", status: "Not started", priority: "Low", dueDate: dateFromToday(7) },
    { id: "task-11", title: "Confirm pilot store list", projectId: "project-2", owner: "Maya Chen", status: "Done", priority: "Medium", dueDate: dateFromToday(-5) },
    { id: "task-12", title: "Tag research clips by theme", projectId: "project-3", owner: "Ethan Cole", status: "In progress", priority: "Low", dueDate: dateFromToday(6) },
];

export const teamMembers = [
    { name: "Maya Chen", role: "Product lead", color: "lavender" },
    { name: "Jordan Lee", role: "Researcher", color: "peach" },
    { name: "Sofia Patel", role: "Product designer", color: "mint" },
    { name: "Noah Williams", role: "Engineer", color: "blue" },
    { name: "Ethan Cole", role: "Engineer", color: "rose" },
];

export const projectCovers = [
    { value: "product-discovery.jpg", label: "Product discovery" },
    { value: "design-system.jpg", label: "Design system" },
    { value: "research-workshop.jpg", label: "Research workshop" },
];

export const taskStatuses = ["Not started", "In progress", "Blocked", "Done"];
export const projectStatuses = ["Planning", "On track", "Needs attention", "Complete"];

export const formatDate = (dateValue, options = { month: "short", day: "numeric" }) => {
    if (!dateValue) return "No date";
    return new Intl.DateTimeFormat("en-US", options).format(new Date(`${dateValue}T12:00:00`));
};

export const initials = (name) => name.split(" ").map((part) => part[0]).slice(0, 2).join("");
