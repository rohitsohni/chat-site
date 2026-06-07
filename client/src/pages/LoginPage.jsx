import React, { useContext, useState } from 'react'
import assets from '../assets/assets'
import { AuthContext } from '../../context/AuthContext'

const LoginPage = () => {

  const [currState, setCurrState] = useState("Sign up")
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [bio, setBio] = useState("")
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);

  const {login} = useContext(AuthContext)

  const onSubmitHandler = (event)=>{
    event.preventDefault();

    if(currState === 'Sign up' && !isDataSubmitted){
      setIsDataSubmitted(true)
      return;
    }

    login(currState=== "Sign up" ? 'signup' : 'login', {fullName, email, password, bio})
  }

  return (
    <div className='min-h-screen bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-sm px-5'>

      {/* -------- left -------- */}
      <h1 className='max-w-xs text-center text-5xl font-semibold leading-tight text-cyan-50 drop-shadow-[0_12px_32px_rgba(6,182,212,0.35)] max-sm:text-4xl'>
        Chat Messenger
      </h1>

      {/* -------- right -------- */}

      <form onSubmit={onSubmitHandler} className='w-full max-w-sm border border-cyan-200/35 bg-slate-950/55 text-white p-6 flex flex-col gap-6 rounded-lg shadow-2xl shadow-cyan-950/40 backdrop-blur-2xl'>
        <h2 className='font-medium text-2xl flex justify-between items-center'>
          {currState}
          {isDataSubmitted && <img onClick={()=> setIsDataSubmitted(false)} src={assets.arrow_icon} alt="" className='w-5 cursor-pointer'/>
          }
          
         </h2>

        {currState === "Sign up" && !isDataSubmitted && (
          <div className='flex flex-col gap-1'>
            <input onChange={(e)=>setFullName(e.target.value)} value={fullName}
             type="text" minLength={3} maxLength={30} className='p-2 border border-cyan-200/30 bg-white/10 text-white placeholder-cyan-100/65 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-300' placeholder="Username" required/>
            <p className='text-xs text-cyan-50/60'>Use 3 to 30 characters.</p>
          </div>
        )}

        {!isDataSubmitted && (
          <>
          <div className='flex flex-col gap-1'>
            <input onChange={(e)=>setEmail(e.target.value)} value={email}
             type="email" placeholder='Email Address' required className='p-2 border border-cyan-200/30 bg-white/10 text-white placeholder-cyan-100/65 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-300'/>
            <p className='text-xs text-cyan-50/60'>Enter a valid email, like name@example.com.</p>
          </div>
          <div className='flex flex-col gap-1'>
            <input onChange={(e)=>setPassword(e.target.value)} value={password}
             type="password" minLength={6} maxLength={32} placeholder='Password' required className='p-2 border border-cyan-200/30 bg-white/10 text-white placeholder-cyan-100/65 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-300'/>
            <p className='text-xs text-cyan-50/60'>Use 6 to 32 characters.</p>
          </div>
          </>
        )}

        {currState === "Sign up" && isDataSubmitted && (
            <textarea onChange={(e)=>setBio(e.target.value)} value={bio}
             rows={4} className='p-2 border border-cyan-200/30 bg-white/10 text-white placeholder-cyan-100/65 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-300' placeholder='provide a short bio...' required></textarea>
          )
        }

        <button type='submit' className='py-3 bg-gradient-to-r from-cyan-400 to-blue-600 text-white rounded-md cursor-pointer shadow-lg shadow-cyan-950/40'>
          {currState === "Sign up" ? "Create Account" : "Login Now"}
        </button>

        <div className='flex flex-col gap-2'>
          {currState === "Sign up" ? (
            <p className='text-sm text-cyan-50/70'>Already have an account? <span onClick={()=>{setCurrState("Login"); setIsDataSubmitted(false)}} className='font-medium text-cyan-300 cursor-pointer'>Login here</span></p>
          ) : (
            <p className='text-sm text-cyan-50/70'>Create an account <span onClick={()=> setCurrState("Sign up")} className='font-medium text-cyan-300 cursor-pointer'>Click here</span></p>
          )}
        </div>
         
      </form>
    </div>
  )
}

export default LoginPage
