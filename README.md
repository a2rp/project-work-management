![Project screenshot](./screenshot.png)

# Project Work Management

Waypoint is a frontend-only project planning workspace for keeping project dates, team tasks, and delivery workload in one place. It is designed for small product teams that need a clear portfolio view and practical day-to-day planning tools.

## Pages

| Route | Page | What it includes |
| --- | --- | --- |
| `/` | Portfolio | Project progress, open work, items due soon, and a featured project plan |
| `/projects` | Projects | Project cards, image selection, search, status filters, create, edit, and remove actions |
| `/timeline` | Timeline | Project date ranges, task due-date markers, lead filter, and a four or five week view |
| `/work` | Work | Searchable task table with owner, project, status, and priority filters, sorting, completion, edit, and remove actions |
| `/team` | Team workload | Workload derived from open tasks, related projects, and each teammate's next tasks |
| Any other path | Not found | A clear route error with a link back to the portfolio |

## Included behavior

- Create and edit projects with a client or team, lead, date range, status, progress, local project image, and summary.
- Create and edit tasks with a project, owner, due date, status, and priority.
- Search projects and work. Filter projects by status and work by project, owner, or status. Sort the work list by due date, priority, or name.
- Mark work complete or reopen it from the portfolio and work list. The timeline and team workload update from the same in-memory React state.
- Review overlapping project dates and task deadlines on the timeline. Change the lead filter and switch between four and five weeks.
- Review each teammate's open task count, status mix, and project assignments. Selecting a teammate's task opens it for editing; the arrow opens that person's filtered work list.
- Remove projects and tasks through a custom confirmation dialog. Removing a project also removes its linked tasks, and the dialog reports that count before confirmation.
- Receive a short toast after project and task changes. Project date ranges are checked before saving, required form values are validated, and empty search results can be cleared.
- Use the responsive top navigation, repository link, mobile menu, fixed header behavior, footer links, keyboard focus styles, and reduced-motion support.

## Data and limits

The project and task records are realistic sample data held in React state. Changes remain available while navigating between routes, then reset on refresh. The app does not use local storage, a database, an API, authentication, or external integrations. The team workload is calculated from the sample task assignments, not from time tracking or live availability.

## Screenshots

These screenshots were captured from the built app using representative sample data. The page gallery covers every route. The dialog gallery covers project and task create/edit flows, the project date validation state, and destructive confirmation dialogs.

### Pages

| Page | Screenshot |
| --- | --- |
| Portfolio | ![Portfolio page with project progress and upcoming work](./screenshots/pages/portfolio.png) |
| Projects | ![Project cards with images, progress, owners, and dates](./screenshots/pages/projects.png) |
| Timeline | ![Project schedule timeline with task due date markers](./screenshots/pages/timeline.png) |
| Work | ![Task list with search, filters, owners, priorities, and status controls](./screenshots/pages/work.png) |
| Team workload | ![Team workload cards with open tasks and project assignments](./screenshots/pages/team.png) |
| Not found | ![Not found page with a link back to the portfolio](./screenshots/pages/not-found.png) |

### Dialogs and validation

| State | Screenshot |
| --- | --- |
| Create project | ![Create project dialog](./screenshots/modals/project-create.png) |
| Edit project | ![Edit project dialog](./screenshots/modals/project-edit.png) |
| Project date validation | ![Project dialog showing a due date validation message](./screenshots/modals/project-date-validation.png) |
| Remove project confirmation | ![Project removal confirmation showing linked task count](./screenshots/modals/project-delete-confirm.png) |
| Create task | ![Create task dialog](./screenshots/modals/task-create.png) |
| Edit task | ![Edit task dialog](./screenshots/modals/task-edit.png) |
| Remove task confirmation | ![Task removal confirmation dialog](./screenshots/modals/task-delete-confirm.png) |

## Local setup

Use Node.js and npm from this folder.

```sh
npm install
npm run dev
```

Open the project at the Vite URL under `/project-work-management/`.

## Quality checks

```sh
npm run lint
npm run build
npm run preview
```

The production build disables source maps. The GitHub Pages deploy command builds the app, copies the entry page to `404.html` for route fallback, and publishes `dist` to the `gh-pages` branch.

## Deployment

Deployment has not been completed yet. The configured GitHub Pages target is [https://a2rp.github.io/project-work-management/](https://a2rp.github.io/project-work-management/). The public repository and Pages site must be available before this URL can be reported as live.

Deploy after the repository is connected:

```sh
npm run deploy
```

## Future improvements

The frontend workflows above are implemented. The following extensions are not implemented:

- Connect a backend API for shared project and task records across devices and team members.
- Add team accounts, roles, and permission levels for multi-user workspaces.
- Add calendar and chat integrations for due dates and project updates.
- Add server-side audit history and hosted file attachments when projects need durable records and shared documents.

## Links

- Portfolio: [https://www.ashishranjan.net](https://www.ashishranjan.net)
- GitHub: [https://github.com/a2rp](https://github.com/a2rp)
- CodePen: [https://codepen.io/ash1198](https://codepen.io/ash1198)
- LinkedIn: [https://www.linkedin.com/in/aashishranjan](https://www.linkedin.com/in/aashishranjan)
- Facebook: [https://www.facebook.com/theash.ashish/](https://www.facebook.com/theash.ashish/)
- YouTube: [https://www.youtube.com/@ashishranjan-ashz?sub_confirmation=1](https://www.youtube.com/@ashishranjan-ashz?sub_confirmation=1)
- Email: [mailto:ash.ranjan09@gmail.com](mailto:ash.ranjan09@gmail.com)

## Support

- Support: [https://a2rp-donation-page.netlify.app/](https://a2rp-donation-page.netlify.app/)
- Buy Me a Coffee: [https://buymeacoffee.com/ashishranjan](https://buymeacoffee.com/ashishranjan)
- Patreon: [https://www.patreon.com/ashishranjan](https://www.patreon.com/ashishranjan)
