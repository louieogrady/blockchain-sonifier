import React, { Component } from "react";
import { ResponsiveLine } from "@nivo/line";

// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.
const commonProperties = {
  animate: true,
  labelTextColor: "Red",
  enableSlices: 'x',
  enablePoints: false,
  enableGridX: false,
  enableGridY: false
};


const Chart = ({ priceData }) => (
  <ResponsiveLine
    width={1000}
    height={1000}
    margin={{ top: 60, right: 80, bottom: 60, left: 80 }}
    {...commonProperties}
    // axisBottom settings hide time labels on x axis
    axisBottom={{
      "orient": "bottom",
      "tickSize": 0,
      "tickPadding": 5,
      "tickRotation": 0,
      "format": () => null,
    }}

    yScale = {
      {
        type: "linear",
        stacked: false,
        min: 0,
        max: 70000
      }
    }
    data={[
      {
        id: "Bitcoin",
        data: priceData.bitcoin
      },
      {
        id: "Eth",
        data: priceData.ethereum
      }
    ]}
    />
);

export default Chart
