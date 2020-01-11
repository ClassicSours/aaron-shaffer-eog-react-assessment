import React from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles, Card, CardHeader} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close';
import { Measurement } from '../../../types';

const useStyles = makeStyles({
  card: {
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
  return (
    <CurrentMetricData
      {...props}
    />
  )
}

interface ComponentProps {
  measurement: Measurement,
  actions: any,
}

const CurrentMetricData = (props: ComponentProps) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { measurement, actions } = props

  const handleDelete = (measurement: Measurement) => {
    dispatch(actions.removeSelectedMetric(measurement.metric))
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
            onClick={(e) => handleDelete(measurement)}
            >
            <CloseIcon />
          </IconButton>
        }
      />
    </Card>
  )
}