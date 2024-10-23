import { useState } from 'react'
import Header from '../components/header'
import { Outlet } from 'react-router-dom'
import { useAuth } from '../useauth';



function App() {
  useAuth();

  return (
    <>
    <Header></Header>
     <Outlet></Outlet>

    </>
  )
}

export default App
