import Footer from "./components/Footer"
import Game from "./components/Game"
import Header from "./components/Header"


function App() {
  return (
    <>
      <div className="min-h-screen">
        <Header title="x TIC TAC TOE o" />
        <Game />
        <Footer title="© @lilsadfoqs roadmap 2025" />
      </div>
    </>
  )
}

export default App
