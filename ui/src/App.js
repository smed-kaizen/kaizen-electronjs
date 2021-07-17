import './App.css';
import Routes from "./components/Routes";

// console.log('window api', window.api)
// window.api.receive('api_failed', (event, args) => {
//   console.log('Failed', event, args)
// })

window.api.send('tasks', 'create', null, { title: 'asd' })
  .then(res => {
    console.log('success', res)
  }).catch(err => {
    console.log('Failed ', err)
})

function App() {
  return (
      <Routes/>
  );
}

export default App;
