import React, { FC, useEffect } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, Label, Legend, CartesianGrid } from 'recharts';
import { MEASUREMENTS } from '../resources/types';
import { GridList, GridListTile, Grid } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) => createStyles({}));

interface ComponentProps {
  measurements: Map<string, MEASUREMENTS>;
}

export const ChartMeasurements: FC<ComponentProps> = (props: ComponentProps) => {
  const { measurements } = props;
  if (!measurements) return null;
  // console.log(measurements);
  let measurements_array = new Array<MEASUREMENTS>();
  measurements.forEach(measurements => {
    measurements_array.push(measurements);
  });
  console.log(measurements_array);
  return (
    <div>
      <Grid container alignContent={'center'} alignItems={'flex-start'} spacing={1}>
        <Grid item xs={9}>
          <GridList cellHeight={300} cols={3}>
            {measurements_array.map(measurements => {
              const data = measurements.measurements;
              const measurement = data[0];
              return (
                <GridListTile key={measurements.metric} cols={1}>
                  {measurements.metric}
                  <ResponsiveContainer height="100%" width="100%">
                    <LineChart data={data} margin={{ left: -10, right: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis height={40} dataKey="at" tick={{ fontSize: 10 }}>
                        <Label value={measurement.metric} position="insideBottom" fontSize={14} fill="#676767" />
                      </XAxis>
                      <YAxis width={80} tick={{ fontSize: 10 }}>
                        <Label value={measurement.unit} angle={-90} position="outside" fill="#676767" fontSize={14} />
                      </YAxis>
                      <Line type="monotone" dataKey="value" stroke="black" />
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
