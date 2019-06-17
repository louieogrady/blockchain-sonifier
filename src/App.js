import React, { Component } from "react";
import "./App.css";
import Tone from "tone";

class App extends Component {
  state = {
    bitcoin: null,
    ethereum: null
  };

  // create synths
  bitcoinSynth = new Tone.AMSynth().toMaster();

  // coincap websockets
  pricesWs = "wss://ws.coincap.io/prices?assets=bitcoin";




  getPrices = () => {
    this.connection = new WebSocket(
      "wss://ws.coincap.io/prices?assets=bitcoin,ethereum"
    );

    // listen to onmessage event
    this.connection.onmessage = e => {
      // work the onmessage response
      console.log(JSON.parse(e.data));
      const data = JSON.parse(e.data);

      if (data.bitcoin) {
        console.log(data.bitcoin);
        this.setState({
          bitcoin: data.bitcoin
        });
      } else {
        console.log('no bitcoin price update')
      }

      if (data.ethereum) {
        console.log(data.ethereum);
        this.setState({
          ethereum: data.ethereum
        });
      } else {
        console.log('no ethereum price update')
      }
    };
  };

  componentDidMount() {
    this.getPrices();

    setInterval(() => {
      this.bitcoinSynth.frequency.value = this.state.bitcoin / 25; // bringing down the frequency to something more manageable
      console.log(this.bitcoinSynth.frequency.value);
    }, 1000);                                                      // osc frequency is updated every second

  }

  handleClick = () => {
    this.bitcoinSynth.frequency.value = this.state.bitcoin / 25;
    this.bitcoinSynth.triggerAttack();
    console.log("synth started");
  };

  render() {
    return (
      <div className="App">
        <h1> bitcoin: {this.state.bitcoin} </h1>
        <h1> ethereum: {this.state.ethereum} </h1>

        <button onClick={this.handleClick}> Start Synth </button>
      </div>
    );
  }
}

export default App;
