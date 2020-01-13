import React, { FC } from 'react';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Chip from '@material-ui/core/Chip';
import CloseIcon from '@material-ui/icons/Close';
import { LinearProgress } from '@material-ui/core';

interface ComponentProps {
  metrics: string[];
  selectedMetrics: string[];
  classes: any;
  handleChange: any;
  handleClear: any;
  handleDelete: any;
}

export const SelectMetrics: FC<ComponentProps> = (props: ComponentProps) => {
  const { classes, metrics, selectedMetrics, handleChange, handleClear, handleDelete } = props;
  if (!metrics) return <LinearProgress />;
  return (
    <FormControl className={classes.formControl} variant="outlined">
      <InputLabel>Metrics</InputLabel>
      <Select
        multiple
        value={selectedMetrics}
        onChange={handleChange}
        className={classes.select}
        endAdornment={
          <InputAdornment position="start">
            <IconButton className={classes.iconButton} onClick={handleClear}>
              <CloseIcon />
            </IconButton>
          </InputAdornment>
        }
        renderValue={selected => (
          <div className={classes.chips}>
            {(selected as string[]).map(value => (
              <Chip
                key={value}
                label={value}
                className={classes.chip}
                onDelete={e => handleDelete(value)}
                deleteIcon={<CloseIcon id={value} />}
              />
            ))}
          </div>
        )}
        MenuProps={{
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'left',
          },
          transformOrigin: {
            vertical: 'top',
            horizontal: 'left',
          },
          getContentAnchorEl: null,
        }}
      >
        {selectedMetrics.length === metrics.length ? (
          <MenuItem disabled key={''} value={''}>
            {'No Options'}
          </MenuItem>
        ) : (
          metrics
            .filter(metric => !selectedMetrics.includes(metric))
            .map(metric => (
              <MenuItem key={metric} value={metric}>
                {metric}
              </MenuItem>
            ))
        )}
      </Select>
    </FormControl>
  );
};
