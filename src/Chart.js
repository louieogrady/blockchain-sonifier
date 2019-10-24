import React, { Component } from "react";
import { ResponsiveLine } from '@nivo/line'

// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.


const Chart = ({ priceData }) => (
    <ResponsiveLine
      width={600}
      height={400}
      margin={{ top: 60, right: 80, bottom: 60, left: 80 }}
      data={[
        {
          id: "Bitcoin",
          data: [{
            x: priceData[0].currentTimes[priceData[0].currentTimes.length -1],
            y: priceData[0].bitcoin[0].data.x[priceData[0].bitcoin[0].data.x.length -1],
          }]
        }
      ]}
    />
);

export default Chart
