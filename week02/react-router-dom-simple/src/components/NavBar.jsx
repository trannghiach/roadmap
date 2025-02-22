import { Link, useNavigate } from "react-router-dom";

const NavBar = () => {
  const navigate = useNavigate();

  function handleClick () {
    navigate("/contact");
  }
  
  return (
    <div className="flex flex-col gap-2">
      <Link to="/">Home</Link>
      <Link to="/blog">Blog</Link>
      <Link to="/contact">Contact</Link>
      <button onClick={handleClick}>Contact2</button>
    </div>
  )
}

export default NavBar;