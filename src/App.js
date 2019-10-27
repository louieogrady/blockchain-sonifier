import React, { Component } from "react";
import "./App.css";
import Tone from "tone";
import Chart from "./Chart.js";



class App extends Component {
  state = {
    priceData: [
      {
        ethereum: [{x: 0, y: 0} ],
        bitcoin: [{x: 0, y: 0 } ]
      }
    ]
    // bitcoin: null,
    // ethereum: null
  };

  eth = 0
  bit = 0



  // bitcoinPrice = this.state.priceData[0].bitcoin[0].data.x;
  // ethPrice = this.state.priceData[0].ethereum[0].data.x;

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
  })
    .connect(this.autoFilter)
    .toMaster();

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
        // console.log(JSON.parse(e.data));
        const data = JSON.parse(e.data);
        let today = new Date();
        let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();


        let ethereumUpdate = {
          x: time,
          y: data.ethereum
        };
        let bitcoinUpdate = {
          x: time,
          y: data.bitcoin
        };
        this.eth = ethereumUpdate
        this.bit = bitcoinUpdate
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

          this.setState({
            priceData: [{
              ethereum: [...this.state.priceData[0].ethereum, ethereumUpdate],
              bitcoin: [...this.state.priceData[0].bitcoin, bitcoinUpdate],
            }]
          })
        } else if (data.bitcoin) {
          this.setState({
            priceData: [{
              ethereum: [...this.state.priceData[0].ethereum],
              bitcoin: [...this.state.priceData[0].bitcoin, bitcoinUpdate]
            }]
          })
        } else if (data.ethereum) {
          this.setState({
            priceData: [{
              ethereum: [...this.state.priceData[0].ethereum, ethereumUpdate],
              bitcoin: [...this.state.priceData[0].bitcoin]
            }]
          })
        }

      }
    }


  componentDidMount() {

    this.getPrices();
    console.log(this.bit.data)
    if (this.bit.data) {
      let bitcoinPrice = this.bit.data.x;
      this.bitcoinSynth.frequency.value = this.bitcoinPrice;
      this.bitcoinSynth.triggerAttack();
      console.log("synth started");
    }


  //
  //   setInterval(() => {
  //     // had to put this here rather than componentDidMount
  //     if (this.state.priceData[0].ethereum[0].length > 0) {
  //       this.ethSynth.triggerAttack(
  //         this.bit.eth.x / 8
  //       );
  //     }
  //   }, this.randomTriggerInterval()); // MembraneSynth is triggered by the amount of seconds determined by the random Interval generator
  //
  //
  //   setInterval(() => {
  //     let today = new Date();
  //     let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  //
  //     this.setState({
  //       priceData: [
  //         {
  //         bitcoin: [...this.state.priceData[0].bitcoin[0]],
  //         ethereum: [{id: 'eth', data: {x: [...this.state.priceData[0].ethereum[0].data.x], y: [...this.state.priceData[0].currentTimes, time] }}],
  //         currentTimes: [...this.state.priceData[0].currentTimes, time]
  //         }
  //       ]
  //     })
  //   }, 1000)
  //
  //   setInterval(() => {
  //     if (this.state.priceData[0].bitcoin[0].data.x.length > 0) {
  //       this.bitcoinSynth.frequency.value =
  //         this.state.priceData[0].bitcoin[0].data.x[
  //           this.state.priceData[0].bitcoin[0].data.x.length - 1
  //         ] / 25; // selects last item in array, bringing down the frequency to something more manageable
  //       console.log(this.bitcoinSynth.frequency.value);
  //     }
  //   }, 1000); // osc frequency is updated every second
   }

  randomTriggerInterval = () => Math.floor(Math.random() * 15000) + 1000; // random generates number between 1 and 15

  handleClick = () => {}



  render() {


    console.log(this.state.priceData)
    return (
      <div className="App">
        <h1> bitcoin: {this.state.priceData[0].bitcoin[this.state.priceData[0].bitcoin.length -1].x} </h1>
        <h1> ethereum: {this.state.priceData[0].ethereum[this.state.priceData[0].ethereum.length -1].x} </h1>
        <button onClick={this.handleClick}> Start Synth </button>
        <div className="Chart-Container" style= {{ height: '10em', width: '10em' }}>
        <Chart priceData={this.state.priceData}/>
        </div>



      </div>
    );
  }
}
export default App;
