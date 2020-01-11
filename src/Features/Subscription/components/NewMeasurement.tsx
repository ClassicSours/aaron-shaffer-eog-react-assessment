import React, { useState, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles, Card, CardHeader, LinearProgress} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close';
import { Measurement } from '../../../types';

const useStyles = makeStyles({
  card: {
    // width: "auto !important",
    minWidth: "325px",
    float: "left",
    clear: "both",  
  },
  subheader: {
    textAlign: "right"
  },
  iconButton: {
    "&:hover": {
      backgroundColor: "transparent"
    }
  }
});

export default (props: ComponentProps) => {
  console.log(props)
  return (
    <NewMeasurement 
      {...props}
    />
  )
}

interface ComponentProps {
  measurement: Measurement | undefined,
  actions: any,
}

const NewMeasurement = (props: ComponentProps) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { measurement, actions } = props
  // only update when at changes
  // const memoized_measurement = useMemo((measurements.get(metricName)) => measurement, [measurement])
  
  const handleDelete = (metricName: string) => {
    dispatch(actions.removeSelectedMetric(metricName))
  }

  if(!measurement) {
    return (
      <Card className={classes.card}>
        <LinearProgress />
      </Card>
    )
  }
  return (
  <Card className={classes.card}>
      <CardHeader
        title={measurement.metric}
        titleTypographyProps={{variant:"h6", component:"h6", noWrap:true}}
        subheader={`${measurement.value} ${measurement.unit}`}
        subheaderTypographyProps={{variant:"h3", component:"h3", noWrap:true, className:classes.subheader}}
        action={
          <IconButton 
            className={classes.iconButton}
            onClick={(e) => handleDelete(measurement.metric)}
            >
            <CloseIcon />
          </IconButton>
        }
      />
    </Card>
  )
}