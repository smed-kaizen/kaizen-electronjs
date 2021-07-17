import logo from './logo.svg';
import './App.css';

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
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
