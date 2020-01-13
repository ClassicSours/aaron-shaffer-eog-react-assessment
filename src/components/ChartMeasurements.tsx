import React, { FC, useState, useEffect } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Label, ResponsiveContainer, Legend } from 'recharts';
import { MEASUREMENT, KEYED_MEASUREMENT } from '../resources/types';
import { LinearProgress } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) => createStyles({}));

interface ComponentProps {
  recentMeasurements: Map<string, MEASUREMENT>;
  data: KEYED_MEASUREMENT[];
  metrics: string[];
}

export const ChartMeasurements: FC<ComponentProps> = (props: ComponentProps) => {
  const { data, metrics, recentMeasurements } = props;
  const [keyedData, setKeyedData] = useState(() => {
    const initialState = data;
    return initialState;
  });
  useEffect(() => {
    if (data.length > keyedData.length + 60) {
      setKeyedData(data);
    }
  }, [data, keyedData]);
  let mostRecentMeasurements = new Array<MEASUREMENT>();
  recentMeasurements.forEach((v, k) => {
    if (metrics.includes(k)) mostRecentMeasurements.push(v);
  });

  if (keyedData === null) return <LinearProgress />;
  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <LineChart
          width={1200}
          height={600}
          data={keyedData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <XAxis height={40} dataKey="at" tick={{ fontSize: 10 }}>
            <Label value="at" position="insideBottom" fontSize={14} fill="#676767" />
          </XAxis>
          {mostRecentMeasurements
            .sort((a, b) => (a.unit < b.unit ? -1 : 1))
            .map(id => {
              return (
                <YAxis
                  width={80}
                  yAxisId={`${id.unit}`}
                  tick={{ fontSize: 10 }}
                  type="number"
                  key={`yaxis__${id.metric}_${id.at}_${id.value}`}
                >
                  <Label
                    value={`${id.unit}`}
                    angle={-90}
                    position="insideTopLeft"
                    fill="#676767"
                    fontSize={12}
                    key={`label_${id.metric}_${id.at}_${id.value}`}
                  />
                </YAxis>
              );
            })}
          {mostRecentMeasurements.map(id => {
            return (
              <Line
                key={`line_${id.metric}`}
                dataKey="dataKey"
                yAxisId={`${id.unit}`}
                stroke="black"
                animationDuration={0}
              />
            );
          })}
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
