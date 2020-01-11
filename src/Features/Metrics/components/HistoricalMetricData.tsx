import React from 'react';
import Plot from 'react-plotly.js'

interface ComponentProps {
  data: any,
  actions: any
}

export default (props: ComponentProps) => {
  return (
    <HistoricalMetricData 
      {...props}
    />
  )
}
const HistoricalMetricData = (props: ComponentProps) => {
  return (
    <div>
      {`Historical metric data works!`}
    </div>
  )
}