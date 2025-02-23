import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import NotFound from "./pages/NotFound";
import Details from "./pages/Details";
import { Home } from "./pages/Home";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: '/',
                element: <Home />
            },
            {
                path: "/:lat/:lon",
                element: <Details />,
            },
        ]
    },
    {
        path: '*',
        element: <NotFound />
    }
]);

export default router;