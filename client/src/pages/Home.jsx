import React from 'react'
import ViewPosts from '../components/ViewPosts';
import Navbar from '../components/Navbar'

const Home = () => {
  return (
    <div className=' w-full'>
<Navbar/>

        <ViewPosts/>
    </div>
  )
}

export default Home