import React from 'react'
import { jwtDecode } from "jwt-decode";
import { Navigate } from "react-router-dom";




export  const isTokenValid=()=>{
       const token=localStorage.getItem("token")
        if(!token) return false

        try{
            const decodeToken=jwtDecode(token)
            return decodeToken.exp>Date.now()/1000
        }catch(e){
            console.log(e);
            
        }
    }

   export const ProtectRoute=({children})=>{
        if(!isTokenValid()){
           return <Navigate to="/" replace/>
        }
        return children
    }

    export const checkRole=()=>{
        const token=localStorage.getItem("token")

        try{
            const decodeToken=jwtDecode(token)
            return decodeToken.role
        }catch(e){
            console.log(e);
            
        }
    }


  

