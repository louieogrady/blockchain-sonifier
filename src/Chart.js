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
};


const Chart = ({ priceData }) => (


  <ResponsiveLine
    width={600}
    height={400}
    margin={{ top: 60, right: 80, bottom: 60, left: 80 }}
    {...commonProperties}
    yScale = {
      {
        type: "linear",
        stacked: false
      }
    }
    data={[
      {
        id: "Bitcoin",
        data: priceData[0].bitcoin
      }
        ]}
    />
);

export default Chart
