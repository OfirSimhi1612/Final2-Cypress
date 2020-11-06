import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { analyticsMachine } from '../machines/analyticsMachine';
import { useMachine } from "@xstate/react";

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingLeft: '10px',
    marginBottom: '5px',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    marginTop: '10px',
    width: '40%',
  },
  chart: {
    maxHeight: '100%',
    height: '300px',
    paddingBottom: '10px',
  },
  head: {
    [theme.breakpoints.down('md')]: {
      display: 'none',
    },
  },
}));

export interface HourSessions {
  hour: string;
  count: number;
  offset?: number;
}

const SessionsByHourChart: React.FC = () => {
  const [sessionsCount, setSessionsCount] = useState<HourSessions[]>([]);
  const [mainGraph, setMainGraph] = useState<number>(getDaysOffset(getCurrentDate()));
  const [secondaryGraph, setSecondaryGraph] = useState<number>(getDaysOffset(getYesterdayDate()));
  const [mainCurrent, sendMain] = useMachine(analyticsMachine);
  const { results: mainResults } = mainCurrent.context;
  const [secondaryCurrent, sendsecondary] = useMachine(analyticsMachine);
  const { results: secondaryResults } = secondaryCurrent.context;

  const classes = useStyles();

  useEffect(() => {
    sendMain('FETCH', { params: `by-hours/${mainGraph}` })
  }, [mainGraph]);

  useEffect(() => {
    sendsecondary('FETCH', { params: `by-hours/${secondaryGraph}` })
  }, [secondaryGraph]);


  useEffect(() => {
    if(mainResults!.length > 0 && secondaryResults!.length > 0){
      const combined: HourSessions[] = mainResults!.map((day: HourSessions, index: number) => ({
        offset: secondaryResults![index].count,
        count: day.count,
        hour: day.hour,
      }));
      setSessionsCount(combined)
    }
  }, [mainResults, secondaryResults])
    

  function getDaysOffset(date: string): number {
    const dayInMili = 1000 * 60 * 60 * 24;
    let offset: number = 0;
    const offsetInDate = new Date(date);
    const now = new Date(new Date(Date.now()).toDateString()).getTime();

    offset = (now - offsetInDate.getTime()) / dayInMili;
    return Math.ceil(offset);
  }
  const updateMain = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setMainGraph(getDaysOffset(event.target.value));
  };

  const updateSecondary = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setSecondaryGraph(getDaysOffset(event.target.value));
  };

  function getCurrentDate(): string {
    const now: string = new Date().toJSON();
    return now.slice(0, 10);
  }

  function getYesterdayDate(): string {
    const day = 1000 * 60 * 60 * 24;
    const now: string = new Date(Date.now() - day).toJSON();
    return now.slice(0, 10);
  }

  return (
    <>
      <div className={classes.chart}>
        <div className={classes.container}>
          <form className={classes.container} noValidate>
            <TextField
              id="datetime-local"
              label="Main"
              type="date"
              defaultValue={getCurrentDate()}
              onChange={updateMain}
              className={classes.textField}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              id="datetime-local"
              label="Secondary"
              type="date"
              defaultValue={getYesterdayDate()}
              onChange={updateSecondary}
              className={classes.textField}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </form>
        </div>
        {(mainResults && secondaryResults) &&
        <ResponsiveContainer width="90%" height="80%">
          <LineChart data={sessionsCount} margin={{ top: 5, bottom: 15 }}>
            <Line type="monotone" dataKey="count" stroke="#8884d8" name="Main" />
            <Line type="monotone" dataKey="offset" stroke="#8c0819" name="Secondary" />
            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
            <XAxis dataKey="hour" label={{ value: 'Date', offset: -10, position: 'insideBottom' }} />
            <YAxis label={{
              value: 'Unique Sessoins', angle: -90, position: 'insideStart', dx: -20,
            }}
            />
            <Tooltip />
          </LineChart>
        </ResponsiveContainer>
        }
      </div>
    </>
  );
};

export default SessionsByHourChart;
