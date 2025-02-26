import { useNavigate } from "react-router-dom"

const Header = () => {
    const navigate = useNavigate();

    function handleClick() {
        navigate('/');
    }
    return (
        <>
            <div className="w-16 h-16 flex justify-center items-center fixed rounded-full top-8 left-8 cursor-pointer shadow-xl shadow-cyan-200 z-20" onClick={handleClick}>
                <p className="text-2xl">🏠</p>
            </div>
        </>
    )
}

export default Header