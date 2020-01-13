import React, { FC, Fragment } from 'react';
import { MEASUREMENT } from '../resources/types';
import Card from '@material-ui/core/Card';
import IconButton from '@material-ui/core/IconButton';
import CardHeader from '@material-ui/core/CardHeader';
import CloseIcon from '@material-ui/icons/Close';
import { LinearProgress } from '@material-ui/core';
import { useQuery } from 'urql';
import { getLastKnownMeasurement } from '../resources/queries';
import { useEffectOnce } from 'react-use';

interface ComponentProps {
  metricName: string;
  measurements: Map<string, MEASUREMENT>;
  handleDelete: any;
  classes: any;
  dispatch: any;
  actions: any;
}

export const MeasurementCard: FC<ComponentProps> = (props: ComponentProps) => {
  const { metricName, classes, measurements, handleDelete, dispatch, actions } = props;
  const measurement = measurements.get(metricName);
  // request a metric
  const [LAST_KNOWN_MEASUREMENT, GET_LAST_KNOWN_MEASUREMENT] = useQuery({
    query: getLastKnownMeasurement,
    variables: { metricName },
    requestPolicy: 'cache-only',
  });

  const { data, error } = LAST_KNOWN_MEASUREMENT;
  useEffectOnce(() => {
    if (error) {
      dispatch(actions.metricsApiErrorReceived({ error: error.message }));
      return;
    }
    if (!data) return;
    const { newMeasurement } = data;
    GET_LAST_KNOWN_MEASUREMENT();
    dispatch(actions.lastKnownMeasurementDataRecieved(newMeasurement));
  });

  return (
    <Card className={classes.card}>
      {measurement !== undefined ? (
        <CardHeader
          title={metricName}
          titleTypographyProps={{
            variant: 'h6',
            component: 'h6',
            noWrap: true,
          }}
          subheader={`${measurement.value} ${measurement.unit}`}
          subheaderTypographyProps={{
            variant: 'h3',
            component: 'h3',
            noWrap: true,
            className: classes.subheader,
          }}
          action={
            <IconButton className={classes.iconButton} onClick={e => handleDelete(metricName)}>
              <CloseIcon />
            </IconButton>
          }
        />
      ) : (
        <Fragment>
          <CardHeader
            title={metricName}
            titleTypographyProps={{
              variant: 'h6',
              component: 'h6',
              noWrap: true,
            }}
            action={
              <IconButton className={classes.iconButton} onClick={e => handleDelete(metricName)}>
                <CloseIcon />
              </IconButton>
            }
          />
          <LinearProgress />
        </Fragment>
      )}
    </Card>
  );
};
