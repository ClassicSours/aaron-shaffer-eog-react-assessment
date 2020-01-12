import * as React from 'react';
import PlotlyChart from 'react-plotlyjs-ts';
import { makeStyles } from '@material-ui/core';
import { useDispatch } from 'react-redux';

const useStyles = makeStyles({

})

export default (props: ComponentProps) => {
  return (
    <PlotMetrics 
      {...props}
    />
  )
}

interface ComponentProps {

}

const PlotMetrics = (props: ComponentProps) => {
  const classes = useStyles();

  const handleClick = (evt: any) => {
    console.log(evt)
    console.log(typeof evt)
  }
  const handleHover = (evt: any) => {
    console.log(evt)
    console.log(typeof evt)
  }

  const data = [
    {
        marker: {
            color: 'rgb(16, 32, 77)'
        },
        type: 'scatter',
        x: [1, 2, 3],
        y: [6, 2, 3]
    },
    {
        name: 'bar chart example',
        type: 'bar',
        x: [1, 2, 3],
        y: [6, 2, 3],
    }
  ];
  const layout = {
      annotations: [
          {
              text: 'simple annotation',
              x: 0,
              xref: 'paper',
              y: 0,
              yref: 'paper'
          }
      ],
      title: 'simple example',
      xaxis: {
          title: 'time'
      },
  };
  return (
    <PlotlyChart data={data}
      layout={layout}
      onClick={handleClick}
      onHover={handleHover}
    />
  )
}