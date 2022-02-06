import React, { useEffect, useState } from "react";
import "./App.css";
import Tone from "tone";
import Chart from "./Chart.js";

function App() {
  const initialPinMatrixState = Array(4).fill(0).map(x => Array(4).fill(0));
  const initialPriceDataState = {
    ethereum: [{ x: 0, y: 0 }],
    bitcoin: [{ x: 0, y: 0 }]
  }

  const [pinMatrix, setPinMatrix] = useState(initialPinMatrixState);
  const [priceData, setPriceData] = useState(initialPriceDataState);



  const autoFilter = new Tone.AutoFilter("4n").toMaster().start();
  // create synths
  const bitcoinSynth = new Tone.FMSynth({
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
  }).connect(autoFilter).toMaster();

  const ethSynth = new Tone.MembraneSynth().toMaster();

  // coincap websockets
  const connection = new WebSocket(
    "wss://ws.coincap.io/prices?assets=bitcoin,ethereum"
  );

  useEffect(() => {
    console.log(pinMatrix)

    let eth = 0;
    let bit = 0;

    // listen to onmessage event
    connection.onmessage = e => {
      console.log('** in',priceData)
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
      eth = ethereumUpdate
      bit = bitcoinUpdate

      if (data.ethereum && data.bitcoin) {
        console.log(data.ethereum);
        setPriceData((prevState) => ({
          ethereum: [...prevState.ethereum, ethereumUpdate],
          bitcoin: [...prevState.bitcoin, bitcoinUpdate],
        }))
      } else if (data.bitcoin) {
        setPriceData((prevState) => ({
          ...prevState,
          bitcoin: [...prevState.bitcoin, bitcoinUpdate],
        }))
      } else if (data.ethereum) {
        setPriceData((prevState) => ({
          ...prevState,
          ethereum: [...prevState.ethereum, ethereumUpdate],
        }))
      }
    }



    console.log(bit.data)
    if (bit.data) {
      let bitcoinPrice = bit.data.x;
      bitcoinSynth.frequency.value = bitcoinPrice;
      bitcoinSynth.triggerAttack();
      console.log("synth started");
    }

  }, [])


  const randomTriggerInterval = () => Math.floor(Math.random() * 15000) + 1000; // random generates number between 1 and 15

  const handleClick = () => {}

  return (
    <div className="App">
      <h1> bitcoin: {priceData.bitcoin[priceData.bitcoin.length - 1].y} </h1>
      <h1> ethereum: {priceData.ethereum[priceData.ethereum.length - 1].y} </h1>
      <button onClick={handleClick}> Start Synth </button>
      <div className="Chart-Container" style={{ height: '10em', width: '10em' }}>
        <Chart priceData={priceData} />
      </div>
    </div>
  );

}
export default App;
