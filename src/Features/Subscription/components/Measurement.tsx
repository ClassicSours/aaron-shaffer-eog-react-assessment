import React, { FC } from 'react';

export interface MeasurementResponse {
  newMeasurements: MeasurementEntry;
}

export interface MeasurementEntry {
  metric: string;
  at: number;
  value: number;
  unit: string;
}

export const Measurement: FC<MeasurementEntry> = props => (
  <div className="notif">
  {console.log(JSON.stringify(props))}
    <h4>{props.metric}</h4>
    <li>{props.at}</li>
    <li>{props.value}</li>
    <li>{props.unit}</li>
  </div>
);

Measurement.displayName = 'Measurement';