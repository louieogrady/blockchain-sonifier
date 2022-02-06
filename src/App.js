import React, { useEffect, useState } from "react";
import "./App.css";
import * as Tone from 'tone'
import Chart from "./Chart.js";

function App() {
  const initialPinMatrixState = Array(4).fill(0).map(x => Array(4).fill(0));
  const initialPriceDataState = {
    ethereum: [{ x: 0, y: 0 }],
    bitcoin: [{ x: 0, y: 0 }]
  }

  const [pinMatrix, setPinMatrix] = useState(initialPinMatrixState);
  const [priceData, setPriceData] = useState(initialPriceDataState);

  // let toneInstance;

  // const autoFilter = new Tone.AutoFilter("8n").toDestination().start();
  // create synths
  const bitcoinSynth = new Tone.FMSynth({
    harmonicity: 8,
    detune: 0,
    envelope: {
      attack: 0.1,
      decay: 0.5,
      sustain: 1,
      release: 4
    },
    modulationEnvelope: {
      attack: 0.5,
      decay: 0,
      sustain: 1,
      release: 4
    }
  }).toDestination();

  const ethSynth = new Tone.Oscillator().toDestination();


  // TODO: CHANGE to bitfinex websockets: https://docs.bitfinex.com/reference#rest-public-ticker
  // coincap websockets
  const connection = new WebSocket(
    "wss://ws.coincap.io/prices?assets=bitcoin,ethereum"
  );

  /** Returns current time for chart */
  const getTime = () => {
    let today = new Date();
    return today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  }

  const setStateOnReceivingData = (currentTime, data) => {
    let ethereumUpdate = {
      x: currentTime,
      y: data.ethereum
    };
    let bitcoinUpdate = {
      x: currentTime,
      y: data.bitcoin
    };

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

  useEffect(() => {

    async function startTone() {
      await Tone.start()
    }
    startTone();
    // listen to onmessage event
    connection.onmessage = event => {
      // Parse data
      const data = JSON.parse(event.data);
      // Get current time
      const currentTime = getTime();
      // Send data to function to organise state
      setStateOnReceivingData(currentTime, data);

      if (Tone.context.state === 'running') {
        // if (data.bitcoin) {
        //   bitcoinSynth.frequency.value = (data.bitcoin % 10000).toFixed(2);
        //   // bitcoinSynth.triggerAttackRelease();
        //   bitcoinSynth.triggerAttack(bitcoinSynth.frequency.value);

        // }

        if (data.ethereum) {
          ethSynth.frequency.value = data.ethereum % 1000;
          ethSynth.start()
        }

      }
    }

  }, [])


  const randomTriggerInterval = () => Math.floor(Math.random() * 15000) + 1000; // random generates number between 1 and 15

  const handleClick = async () => {
    
    if (Tone.context.state !== 'running') {
      Tone.context.resume();
    }
  }

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
