import React, { FC, Fragment } from 'react'
import { Measurement } from '../resources/types'
import { useDispatch } from 'react-redux';
import Card from '@material-ui/core/Card';
import IconButton from '@material-ui/core/IconButton'
import CardHeader from '@material-ui/core/CardHeader';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles, createStyles, Theme, LinearProgress } from '@material-ui/core';

interface ComponentProps {metric: string, measurements: Map<string,Measurement>, actions: any}
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      width: "100%",
      minWidth: "fit-content",
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
  }),
);

export const MeasurementCard: FC<ComponentProps> = (props: ComponentProps) => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const {metric, measurements, actions} = props
  const measurement = measurements.get(metric)

  const handleDelete: any = (metric: string) => {
    dispatch(actions.removeSelectedMetric(metric))
  }
  console.log(measurement)
  return (
    <Card className={classes.card}>
      {
        (measurement !== undefined) ? (
          <CardHeader
            title={metric}
            titleTypographyProps={{variant:"h6", component:"h6", noWrap:true}}
            subheader={`${measurement.value} ${measurement.unit}`}
            subheaderTypographyProps={{variant:"h3", component:"h3", noWrap:true, className:classes.subheader}}
            action={
            <IconButton className={classes.iconButton} 
              onClick={(e) => handleDelete(metric)}><CloseIcon />
            </IconButton>}
          />
          ) : (
          <Fragment>
          <CardHeader
            title={metric}
            titleTypographyProps={{variant:"h6", component:"h6", noWrap:true}}
            action={
            <IconButton className={classes.iconButton} 
              onClick={(e) => handleDelete(metric)}><CloseIcon />
            </IconButton>}
          />
          <LinearProgress />
          </Fragment>
        ) 
      }
    </Card>
  )
}
