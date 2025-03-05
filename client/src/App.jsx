import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuthStore } from './store/useAuthStore.js';
import {  Loader } from 'lucide-react'
import Signup from './pages/Signup';
import Login from './pages/Login';
import Home from './pages/Home';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import ForgotPassword from './pages/ForgotPassword.jsx';
import ResetPassword from './pages/ResetPassword.jsx';
import CreatePost from './components/CreatePost.jsx';
import ViewPosts from './components/ViewPosts.jsx';
import EditPost from './components/EditPost.jsx';
import Profile from './components/Profile.jsx';
import { socket } from "./lib/socket.js";
import useThemeStore  from './store/useThemeStore.js';


function App() {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();  
  const { theme } = useThemeStore();

  if(theme === 'dark'){
    document.body.style.backgroundColor = "black"
  }
  else{
    document.body.style.backgroundColor = "white"

  }

  useEffect(() => {
    checkAuth()
   }, [checkAuth]);

   useEffect(() => {
    socket.connect();
    return () => socket.disconnect();
}, []);
  
      if (isCheckingAuth && !authUser) { // means till the time it is checked whether the user is authenticated or not, the loader should be displayed.
       return <div className='flex justify-center items-center h-screen'>
         <Loader className='size-10 animate-spin'/>
        </div>
       }
return <div className={`transition-all duration-300 ${theme === "dark" ? "bg-black" : "bg-white"}`}>
    
    <Routes>
    
    <Route path='/' element={authUser ? <Home/> : <Navigate to='/login'/>}/>
    <Route path='/signup' element={!authUser ? <Signup/> : <Navigate to='/'/>}/>
    <Route path='/login' element={!authUser ? <Login/> : <Navigate to='/'/>}/>
    <Route path='/forgot-password' element= {!authUser ? <ForgotPassword/> : <Navigate to='/'/>}/>
    <Route path='/reset-password/:token' element={!authUser ? <ResetPassword /> : <Navigate to='/'/>} /> 
    <Route path='/create' element={authUser ? <CreatePost/> : <Navigate to='/login' />} />
    <Route path='/view-posts' element={authUser ? <ViewPosts/> : <Navigate to='/login' />} />
    <Route path="/edit/:postId" element={authUser ? <EditPost /> : <Navigate to='/login' />} />
    <Route path='/profile' element={authUser ? <Profile/> : <Navigate to='/login' />} />

    </Routes>
    
    <Toaster />
      </div>

}

export default App
