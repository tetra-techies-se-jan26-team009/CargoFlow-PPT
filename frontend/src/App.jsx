import { Routes, Route, Link } from "react-router-dom";
import HomePage from './pages/LandingPage/HomePage'
import './App.css'

function App() {

  return (
    <>
    {/* All App Routes are mentioned Here */}
      <Routes>
        <Route path='/' element={<HomePage />} ></Route>
      </Routes>
    </>
  )
}

export default App
