import React, { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Provider, useQuery, createClient } from 'urql';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Label, ResponsiveContainer } from 'recharts';
import { isSelectionNode } from 'graphql';
import { MEASUREMENT } from '../resources/types';

const useStyles = makeStyles((theme: Theme) => createStyles({}));

interface ComponentProps {
  data: any;
}
export const ChartMeasurements: FC<ComponentProps> = (props: ComponentProps) => {
  const { data } = props;
  return null;
  // <LineChart width={1000} height={500} data={data}>
  //   <XAxis height={40} dataKey="" tick={{ fontSize: 10 }}>
  //     <Label value="at" position="insideBottom" fontSize={14} fill="#676767" />
  //   </XAxis>
  //   {data.map((c, i) => {
  //     return (
  //       <YAxis width={80} yAxisId={c[0].unit} tick={{ fontSize: 10 }}>
  //         <Label value={c[0].unit} angle={-90} position="insideTopLeft" fill="#676767" fontSize={12} key={i} />
  //       </YAxis>
  //     );
  //   })}
  //   {data.map((c, i) => {
  //     return <Line yAxisId={c[0].unit} type="monotone" dataKey="value" stroke="black" key={i} />;
  //   })}
  //   <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
  // </LineChart>
};
