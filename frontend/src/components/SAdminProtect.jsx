import {useEffect} from 'react'
import { useNavigate } from 'react-router-dom';

const SAdminProtect = (props) => {
    const { Component } = props;
    const navigate = useNavigate()
    useEffect (() =>{
        let token = localStorage.getItem('token')
        let sAdmin = localStorage.getItem('sAdmin')
        console.log(sAdmin);
        console.log(token);
        if(!token){
            navigate('/login')
        }
        if (sAdmin==="false") {
            navigate('/login')
        }
    })
  return (
    <div><Component /></div>
  )
}

export default SAdminProtect