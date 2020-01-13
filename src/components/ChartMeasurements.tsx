import React, { FC, useEffect, Fragment } from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Label, CartesianGrid } from 'recharts';
import { MEASUREMENTS, MEASUREMENT } from '../resources/types';
import { GridListTile } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
interface ComponentProps {
  lazyGetColor: any;
  measurements: Map<string, MEASUREMENTS>;
}
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    tile: {
      width: '33%',
      height: '300px',
    },
  }),
);
export const ChartMeasurements: FC<ComponentProps> = (props: ComponentProps) => {
  const classes = useStyles();
  const { measurements, lazyGetColor } = props;
  let measurements_array = new Array<MEASUREMENTS>();
  measurements.forEach(measurements => {
    measurements_array.push(measurements);
  });
  useEffect(() => {}, [measurements]);
  return (
    <Fragment>
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
                <CartesianGrid
                  strokeDasharray="1 1"
                  verticalFill={[`${lazyGetColor(key.metric + key.unit)}`, `${lazyGetColor(key.unit + key.metric)}`]}
                  fillOpacity={0.05}
                />
                <XAxis height={40} dataKey="at" tick={{ fontSize: 10 }}>
                  <Label value={measurement.metric} position="insideBottom" fontSize={14} fill="#676767" />
                </XAxis>
                <YAxis width={80} tick={{ fontSize: 1 }}>
                  <Label value={measurement.unit} angle={-90} position="outside" fill="#676767" fontSize={14} />
                </YAxis>
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={lazyGetColor(`${key.metric}`)}
                  isAnimationActive={false}
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </GridListTile>
        );
      })}
    </Fragment>
  );
};
