import './App.css';
import Routes from "./components/Routes";
import NavBar from "./components/NavBar";
import React from "react";



window.api.send('tasks', 'create', null, { title: 'asd' })
  .then(res => {
    console.log('success', res)
  }).catch(err => {
    console.log('Failed ', err)
})

function App() {
  return (
    <>
      <NavBar/>
      <Routes/>
    </>
  );
}

export default App;
