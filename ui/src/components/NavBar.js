import React from "react"
import {Link} from "react-router-dom";


export default function (props) {
  return(
    <>
      <Link to="/"><h2>Home</h2></Link>
      <Link to="/new"><h2>New Task</h2></Link>
    </>
  )
}
