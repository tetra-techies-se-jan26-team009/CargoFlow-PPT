import { Routes, Route, Link } from "react-router-dom";
import HomePage from './pages/LandingPage/HomePage'
import AboutUs from './pages/LandingPage/AboutUs'
import Login from './pages/Authentication/Login'
import './App.css'
import SignUp from "./pages/Authentication/SignUp";

function App() {

  return (
    <>
    {/* All App Routes are mentioned Here */}
      <Routes>
        {/* Landing Page Routes */}

        <Route path='/' element={<HomePage />} ></Route>
        <Route path='/about_us' element={<AboutUs />} />
        
        {/* Authentication Routes  */}
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<SignUp />} />
      </Routes>
    </>
  )
}

export default App
