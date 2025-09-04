import React from 'react'

const Input = ({htmlFor,label,id,name,type,placeholder,className,required=false,element=null,formprop={},...rest}) => {
  return (
          
              <div className={`info ${formprop || ""}`}>
              <label htmlFor={htmlFor}>{label}</label>
              <input
                id={id}
                name={name}
                type={type}
                placeholder={placeholder}
                className={`input ${className}`}
                required={required}
                {...rest}
              />
              {element && element}
              </div>
          
             
  )
}

export default Input