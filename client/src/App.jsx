import React, { useContext } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import {Toaster} from "react-hot-toast"
import { AuthContext } from '../context/AuthContext'
import assets from './assets/assets'

const App = () => {
  const { authUser } = useContext(AuthContext)
  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat text-white"
      style={{ backgroundImage: `linear-gradient(135deg, rgba(2, 6, 23, 0.46), rgba(14, 116, 144, 0.28)), url(${assets.chatBlueBackground})` }}
    >
      <Toaster/>
      <Routes>
        <Route path='/' element={authUser ? <HomePage /> : <Navigate to="/login" />}/>
        <Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to="/" />}/>
        <Route path='/profile' element={authUser ? <ProfilePage /> : <Navigate to="/login" />}/>
      </Routes>
    </div>
  )
}

export default App
