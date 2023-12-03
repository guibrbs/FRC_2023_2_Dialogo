import React from "react"
import './styles/app.css'

export const App:React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="App">
      {children}
    </div>
  )
}