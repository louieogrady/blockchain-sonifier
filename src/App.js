import React, { Component } from "react";
import "./App.css";
import Tone from "tone";

class App extends Component {
  state = {
    bitcoin: null
  };

  // create synths
  bitcoinSynth = new Tone.AMSynth().toMaster();

  // coincap websockets
  pricesWs = "wss://ws.coincap.io/prices?assets=bitcoin";

  getBitcoinPrice = () => {
    this.connection = new WebSocket(
      "wss://ws.coincap.io/prices?assets=bitcoin,ethereum"
    );

    // listen to onmessage event
    this.connection.onmessage = e => {
      // work the onmessage response
      console.log(JSON.parse(e.data));
      const data = JSON.parse(e.data);

      // switch (data)

      if (data.bitcoin) {
        console.log(data.bitcoin);
        this.setState({
          bitcoin: data.bitcoin
        });
      }
    };
  };

  componentDidMount() {
    this.getBitcoinPrice();

    setInterval(() => {
      this.bitcoinSynth.frequency.value = this.state.bitcoin / 25;
      console.log(this.bitcoinSynth.frequency.value);
    }, 1000);
    
  }

  handleClick = () => {
    this.bitcoinSynth.frequency.value = this.state.bitcoin / 25;
    this.bitcoinSynth.triggerAttack();
    console.log("synth started");
  };

  render() {
    return (
      <div className="App">
        <h1> {this.state.bitcoin} </h1>

        <button onClick={this.handleClick}> Start Synth </button>
      </div>
    );
  }
}

export default App;
