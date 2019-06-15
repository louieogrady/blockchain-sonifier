import React, { Component } from "react";
import "./App.css";
import Tone from "tone"


class App extends Component {
  state = {
    bitcoinPrice: null
  };

  synth1 = new Tone.AMSynth().toMaster();

  handleClick = () => {
    this.synth1.triggerAttack();
    this.synth1.frequency.value = this.state.bitcoinPrice
    console.log('synth started')
  }


  // coincap JSON API
  coincapBitCoinPrice = "https://api.coincap.io/v2/rates/bitcoin";

  // coincap websockets
  pricesWs = ('wss://ws.coincap.io/prices?assets=bitcoin')


  // fetchFromAPI = () => {
  //   fetch(this.coincapBitCoinPrice)
  //     .then(resp => resp.json())
  //     .then(data => console.log(data.data.rateUsd))
  //     .then(data => this.setState({ bitcoinPrice: data }));
  // };

  getBitcoinPrice = () => {
   this.connection = new WebSocket('wss://ws.coincap.io/prices?assets=bitcoin');
   // listen to onmessage event
   this.connection.onmessage = e => {
     // add the new message to state
   console.log(JSON.parse(e.data));
   const x = JSON.parse(e.data);
   console.log(x.bitcoin);
   // debugger
       this.setState({
       bitcoinPrice : x.bitcoin
     })
   };
  }

  componentDidMount() {
    // this.fetchFromAPI();
    this.getBitcoinPrice();
    console.log(this.state.bitcoinPrice - 7000);
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
