const Header = ({ title }) => {
  return (
    <>
        <div className="container flex justify-center items-center top-0 left-0 w-full">
            <h1 className="text-3xl leading-36">{title}</h1>
        </div>
    </>
  )
}

export default Header;