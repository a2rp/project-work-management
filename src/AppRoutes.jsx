import { lazy, Suspense } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Loading from "./components/loading/index.jsx";
import ScrollToTop from "./components/scrollToTop/index.jsx";

const PortfolioPage = lazy(() => import("./pages/portfolio/index.jsx"));
const ProjectsPage = lazy(() => import("./pages/projects/index.jsx"));
const TimelinePage = lazy(() => import("./pages/timeline/index.jsx"));
const WorkPage = lazy(() => import("./pages/work/index.jsx"));
const TeamPage = lazy(() => import("./pages/team/index.jsx"));
const NotFoundPage = lazy(() => import("./pages/notFound/index.jsx"));

const AppRoutes = (props) => {
    const location = useLocation();

    return (
        <>
            <ScrollToTop />
            <Suspense fallback={<Loading />} key={location.pathname}>
                <Routes location={location}>
                    <Route path="/" element={<PortfolioPage {...props} />} />
                    <Route path="/projects" element={<ProjectsPage {...props} />} />
                    <Route path="/timeline" element={<TimelinePage {...props} />} />
                    <Route path="/work" element={<WorkPage {...props} />} />
                    <Route path="/team" element={<TeamPage {...props} />} />
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </Suspense>
        </>
    );
};

export default AppRoutes;
