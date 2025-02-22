import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import App from "./App";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        errorElement: <NotFound />,
        children: [
            { path: "/", element: <Home />},
            { path: "/blog", element: <Blog />},
            { path: "/contact", element: <Contact />}
        ]
    }
]);

export default router;