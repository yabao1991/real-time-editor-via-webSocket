import React from 'react';
import { w3cwebsocket as W3CWebSocket } from "websocket";
import logo from './logo.svg';
import './App.css';

const client = new W3CWebSocket('ws://localhost:8080/', 'echo-protocol');

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      receivedMessage: '',
      statusInfo: ''
    };
  }

  componentWillMount() {
    client.onerror = function() {
      console.log('Connection Error');
    };
    
    client.onopen = () => {
        console.log('WebSocket Client Connected');
        this.setState({
          statusInfo: 'WebSocket Client Connected'
        })
    
        function sendNumber() {
            if (client.readyState === client.OPEN) {
                var number = Math.round(Math.random() * 0xFFFFFF);
                client.send(number.toString());
                setTimeout(sendNumber, 1000);
            }
        }
        sendNumber();
    }
    
    client.onclose = () => {
      console.log('echo-protocol Client Closed');
      this.setState({
        statusInfo: 'echo-protocol Client Closed'
      })
    }
    
    client.onmessage = e => {
      if (typeof e.data === 'string') {
        console.log("Received: '" + e.data + "'");
        
      }
      this.setState({
        receivedMessage: e.data
      })
    }
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h4>{`>> Current Connection Info: `} <p style={{ color: 'green'}}>{this.state.statusInfo}</p></h4>
          <h1>Received Message: </h1>
          <h1>{this.state.receivedMessage || <p style={{ color: 'yellow'}}>No Message Yet</p>}</h1><br />
        </header>
      </div>
    )
  }

}

export default App;
