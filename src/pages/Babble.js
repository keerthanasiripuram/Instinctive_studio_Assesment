import React from 'react'
import Button from '../components/Button/Button.js'

const outer_container = {
  padding: "0 3rem",
  boxSizing: "border-box",
}

const bgColor = {
  backgroundColor: "#2F4858",
  display: "flex",
  flexDirection: "column",
  height: "100vh",
}

export default function Babble() {
  return (
    <div style={bgColor}>
      <div style={outer_container}>
        <Button />
      </div>
    </div>
  )
}
