import React, { Component } from "react";
import "./App.css";
import Tone from "tone";
import Chart from "./Chart.js";

class App extends Component {
  state = {
    priceData: [{
      ethereum: [],
      bitcoin: []
    }],
    bitcoin: null,
    ethereum: null
  };

  bitcoinPrice = this.state.priceData[0].bitcoin

  autoFilter = new Tone.AutoFilter("4n").toMaster().start();
  // create synths
  bitcoinSynth = new Tone.FMSynth({
    harmonicity: 10,
    detune: 0,
    envelope: {
      attack: 0.01,
      decay: 0.01,
      sustain: 1,
      release: 0.5
    },
    modulationEnvelope: {
      attack: 1,
      decay: 0,
      sustain: 2,
      release: 0.5
    }
  }).connect(this.autoFilter).toMaster();




  ethSynth = new Tone.MembraneSynth().toMaster();

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

      // this.setState({
      //   priceData: data
      // });

      // if (data.bitcoin) {
      //   console.log(data.bitcoin);
      //   this.setState({
      //     bitcoin: data.bitcoin
      //   });
      // } else {
      //   console.log("no bitcoin price update");
      // }

      if (data.ethereum && data.bitcoin) {
        console.log(data.ethereum);
        // this.setState({
        //   ethereum: data.ethereum
        // });

        this.setState({ priceData: [{
          ethereum: [...this.state.priceData[0].ethereum, data.ethereum],
          bitcoin: [...this.state.priceData[0].bitcoin, data.bitcoin]
        }]
      })
    } else if (data.bitcoin) {
      this.setState({ priceData: [{
        ethereum: [...this.state.priceData[0].ethereum],
        bitcoin: [...this.state.priceData[0].bitcoin, data.bitcoin]
      }]
    })
  } else if (data.ethereum) {
    this.setState({priceData: [{
        ethereum: [...this.state.priceData[0].ethereum, data.ethereum],
        bitcoin: [...this.state.priceData[0].bitcoin]
      }]

    })}
  }
}

  componentDidMount() {
    this.getPrices();


    setInterval(() => {
      let bitcoinPrice = this.state.priceData[0].bitcoin
    this.bitcoinSynth.frequency.value = bitcoinPrice[bitcoinPrice.length-1] / 25; // selects last item in array, bringing down the frequency to something more manageable
      console.log(this.bitcoinSynth.frequency.value);
    }, 1000); // osc frequency is updated every second
  }

  randomTriggerInterval = () => Math.floor(Math.random() * 15000) + 1000; // random generates number between 1 and 15

  handleClick = () => {
    let bitcoinPrice = this.state.priceData[0].bitcoin
    this.bitcoinSynth.frequency.value = bitcoinPrice[bitcoinPrice.length-1]
    this.bitcoinSynth.triggerAttack();
    console.log("synth started");

    setInterval(() => {
      // had to put this here rather than componentDidMount
      this.ethSynth.triggerAttack(this.state.priceData[0].ethereum / 8);
    }, this.randomTriggerInterval()); // MembraneSynth is triggered by the amount of seconds determined by the random Interval generator
  };

  render() {
    let bitcoinPrice = this.state.priceData[0].bitcoin
    let ethPrice = this.state.priceData[0].ethereum
    return (
      <div className="App">
        <h1> bitcoin: {bitcoinPrice[bitcoinPrice.length-1]} </h1>
        <h1> ethereum: {ethPrice[ethPrice.length-1]} </h1>

        <button onClick={this.handleClick}> Start Synth </button>


      </div>

    );
  }
}
export default App;

// <div className="Chart-Container" style= {{ height: '10em', width: '10em' }}> <Chart priceData={this.state.priceData} />
