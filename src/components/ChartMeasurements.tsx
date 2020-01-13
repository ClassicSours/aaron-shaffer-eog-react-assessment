import React, { FC, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Label, CartesianGrid } from 'recharts';
import { MEASUREMENTS, MEASUREMENT } from '../resources/types';
import { GridList, GridListTile, Grid } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

interface ComponentProps {
  measurements: Map<string, MEASUREMENTS>;
}
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    tile: {
      width: '300px',
      height: '300px',
    },
  }),
);
export const ChartMeasurements: FC<ComponentProps> = (props: ComponentProps) => {
  const classes = useStyles();
  const { measurements } = props;
  let measurements_array = new Array<MEASUREMENTS>();
  measurements.forEach(measurements => {
    measurements_array.push(measurements);
  });
  useEffect(() => {}, [measurements]);
  return (
    <div>
      <Grid container alignContent={'center'} alignItems={'flex-start'} spacing={1}>
        <Grid item xs={9}>
          <GridList cellHeight={300} cols={3}>
            {measurements_array.map(measurements => {
              const data = measurements.measurements;
              const measurement = data[0];
              const most_recent = data.slice(-1).pop();
              if (!most_recent) return null;
              const key: MEASUREMENT = most_recent;
              return (
                <GridListTile key={measurements.metric} cols={1} className={classes.tile}>
                  <ResponsiveContainer width={'99%'} height={300} key={key.at}>
                    <LineChart data={data} margin={{ left: -10, right: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis height={40} dataKey="at" tick={{ fontSize: 10 }}>
                        <Label value={measurement.metric} position="insideBottom" fontSize={14} fill="#676767" />
                      </XAxis>
                      <YAxis width={80} tick={{ fontSize: 10 }}>
                        <Label value={measurement.unit} angle={-90} position="outside" fill="#676767" fontSize={14} />
                      </YAxis>
                      <Line type="monotone" dataKey="value" stroke="black" isAnimationActive={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </GridListTile>
              );
            })}
          </GridList>
        </Grid>
      </Grid>
    </div>
  );
};
