import React from 'react'
import { useNavigate } from 'react-router-dom'

const Notfound = () => {
  const navigate = useNavigate()
  let admin=localStorage.getItem('adminId')
  return (
    <>
      <h1>404 Notfound</h1>
      <button onClick={()=>navigate(`/admin/${admin}`)}>Go to home</button>
    </>
  )
}

export default Notfound