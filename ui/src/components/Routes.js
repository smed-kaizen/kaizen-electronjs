import React from "react"
import { Route, Switch } from "react-router-dom";
import Home from "../Screens/Home"

export  default function Routes (props) {
  return(
      <Switch>
        <Route exact path="/" component={Home}/>
      </Switch>
  )
}
