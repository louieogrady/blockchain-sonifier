import React, { Component } from "react";
import "./App.css";
import Tone from "tone"


class App extends Component {
  state = {
    bitcoin: null,
    x: "x"
  };

  synth1 = new Tone.AMSynth().toMaster();

  handleClick = () => {
    this.synth1.triggerAttack();
    this.synth1.frequency.value = this.state.bitcoin / 20
    console.log('synth started')
  }

  // coincap JSON API
  coincapBitCoinPrice = "https://api.coincap.io/v2/rates/bitcoin";

  // coincap websockets
  pricesWs = ('wss://ws.coincap.io/prices?assets=bitcoin')

  getBitcoinPrice = () => {
   this.connection = new WebSocket('wss://ws.coincap.io/prices?assets=bitcoin');
   // listen to onmessage event
   this.connection.onmessage = e => {
     // add the new message to state
   console.log(JSON.parse(e.data));
   const bitcoinPrice = JSON.parse(e.data);
   console.log(bitcoinPrice.bitcoin);
       this.setState({
       bitcoin : bitcoinPrice.bitcoin
     })
   };
  }

  componentDidMount() {
    // this.fetchFromAPI();
    this.getBitcoinPrice();

    setInterval(() => {
    // console.log(this.state.bitcoin / 20);
    this.synth1.frequency.value = this.state.bitcoin / 20
    console.log(this.synth1.frequency.value);

  }, 1000);
  }



  render() {
    return (
      <div className="App">
      <h1> {this.state.bitcoinPrice} </h1>

        <button onClick={this.handleClick}> Start Synth </button>
      </div>
    );
  }
}

export default App;
