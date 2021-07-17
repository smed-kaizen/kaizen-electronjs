import React from "react"
import { Route, Switch, Link, HashRouter } from "react-router-dom";
import Home from "../Screens/Home"
import NewTask from "../Screens/NewTask"
import NavBar from "./NavBar";

export  default function Routes (props) {
  return(
    <HashRouter>
      <NavBar/>
      <Switch>
        <Route exact path="/" component={Home}/>
        <Route exact path="/new" component={NewTask}/>
      </Switch>
    </HashRouter>
  )
}
