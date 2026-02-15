import { Routes, Route, Link } from "react-router-dom";
import HomePage from './pages/LandingPage/HomePage'
import AboutUs from './pages/LandingPage/AboutUs'
import Login from './pages/LandingPage/Login'
import './App.css'

function App() {

  return (
    <>
    {/* All App Routes are mentioned Here */}
      <Routes>
        <Route path='/' element={<HomePage />} >
        </Route>
        <Route path='/about_us' element={<AboutUs />} />
        <Route path='/login' element={<Login />} />
      </Routes>
    </>
  )
}

export default App
