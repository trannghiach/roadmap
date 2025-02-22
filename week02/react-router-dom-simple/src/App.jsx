import { Outlet } from "react-router-dom";
import NavBar from "./components/NavBar"

function App() {
  return (
    <>
      <div className="flex gap-2">
        <NavBar />
        <Outlet />
      </div>
    </>
  )
}

export default App;
