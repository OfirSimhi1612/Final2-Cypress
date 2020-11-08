/// <reference path="types.ts" />

import express, { Request, Response } from 'express';

import {
  getAllEvents, createEvent,
  getLastWeekEventsCount,
  getLastDayEventsCount,
  getTodaysEvents,
  getWeeksEvents,
  getRetentionCohort,
  // retention
} from './database';

import {
  Event, weeklyRetentionObject, GeoLocation, os,
} from '../../client/src/models/event';

const router = express.Router();

// Routes

interface Filter {
  sorting: string;
  type: string;
  browser: string;
  search: string;
  offset: number;
  state: string;
}

router.get('/by-days/:offset', (req: Request, res: Response) => {
  if (typeof parseInt(req.params.offset, 10) !== 'number') {
    res.status(400).send('Invalid Offset!');
  }
  try {
    const events = getLastWeekEventsCount(parseInt(req.params.offset, 10));
    res.send(events);
  } catch (error) {
    res.status(500).send('Somthing Went Wrong...');
  }
});

router.get('/by-hours/:offset', (req: Request, res: Response) => {
  if (typeof parseInt(req.params.offset, 10) !== 'number') {
    res.status(400).send('Invalid Offset!');
  }
  try {
    const events = getLastDayEventsCount(parseInt(req.params.offset, 10));
    res.send(events);
  } catch (error) {
    res.status(500).send('Somthing Went Wrong...');
  }
});

router.get('/today', (req: Request, res: Response) => {
  try {
    const events: Event[] = getTodaysEvents();

    res.send(events);
  } catch (error) {
    res.status(500).send('Something Went Wrong...');
  }
});

router.get('/week', (req: Request, res: Response) => {
  try {
    const events: Event[] = getWeeksEvents();

    res.send(events);
  } catch (error) {
    res.status(500).send('Something Went Wrong...');
  }
});

router.get('/all', (req: Request, res: Response) => {
  try {
    const events: Event[] = getAllEvents();

    res.send(events);
  } catch (error) {
    res.status(500).send('Something Went Wrong...');
  }
});

router.get('/all-filtered', (req: Request, res: Response) => {
  try {
    const filters: Filter = req.query;
    let filtered: any[] = getAllEvents();

    if (filters.search && filters.search !== '') {
      const reg: RegExp = new RegExp(filters.search, 'i');
      filtered = filtered.filter((event) => Object.keys(event).reduce((test: boolean, key: string) => {
        if (key === 'date') {
          return test;
        }
        return test || reg.test((event[key]).toString());
      }, false));
    }

    if (filters.type && filters.type !== 'all') {
      filtered = filtered.filter((event: Event) => event.name === filters.type);
    }

    if (filters.browser && filters.browser !== 'all') {
      filtered = filtered.filter((event: Event) => event.browser === filters.browser);
    }

    if (filters.sorting && filters.sorting !== 'none') {
      filtered.sort((e1: Event, e2: Event) => (filters.sorting[0] === '+' ? e1.date - e2.date : e2.date - e1.date));
    }

    const more = filtered.length >= filters.offset;

    res.json(filters.state !== 'x' ? {
      events: filtered.slice(0, filters.offset),
      more,
    }
      : [filtered.slice(0, filters.offset), more]);
  } catch (error) {
    res.status(500).send('Something Went Wrong...');
  }
});

router.get('/retention', (req: Request, res: Response) => {
  const { dayZero } = req.query;
  if (typeof parseInt(dayZero, 10) !== 'number') {
    res.status(400).send('Invalid Day Zero!');
  }
  try {
    const retentionCohort:weeklyRetentionObject[] = getRetentionCohort(parseInt(dayZero, 10));
    res.json(retentionCohort);
  } catch (error) {
    res.status(500).send('Something Went Wrong...');
  }
});

router.post(
  '/',
  (req: Request, res: Response) => {
    try {
      const event: Event = req.body;
      createEvent(event);
      res.send('event added');
    } catch (error) {
      res.status(500).send('error occured');
    }
  },
);

router.get('/chart/os/:time', (req, res) => {
  const filteredData:{_id:string, os:os}[] = [];
  let events : Event[];
  if (req.params.time === 'today') {
    events = getTodaysEvents();
  } else if (req.params.time === 'week') {
    events = getWeeksEvents();
  } else {
    events = getAllEvents();
  }
  events.forEach((event) => {
    filteredData.push({ _id: event._id, os: event.os });
  });
  res.status(200);
  res.send(filteredData);
});

router.get('/chart/pageview/:time', (req, res) => {
  const filteredData:{_id:string, url:string}[] = [];
  let events : Event[];
  if (req.params.time === 'today') {
    events = getTodaysEvents();
  } else if (req.params.time === 'week') {
    events = getWeeksEvents();
  } else {
    events = getAllEvents();
  }
  events.forEach((event) => {
    filteredData.push({ _id: event._id, url: event.url });
  });
  res.status(200);
  res.send(filteredData);
});

router.get('/chart/timeonpage/inhours', (req, res) => {
  const filteredData: {_id:string, url:string, date:number}[] = [];
  const events : Event[] = getAllEvents();
  events.forEach((event) => {
    filteredData.push({ _id: event._id, url: event.url, date: (event.date * 1000 * 60 * 60) });
  });

  let counterTimeLogin = 0;
  let counterTimeSignin = 0;
  let counterTimeAdmin = 0;
  let counterTimeHome = 0;

  filteredData.forEach((event) => {
    if (event.url === 'http://localhost3000/login') {
      counterTimeLogin += event.date;
    } else if (event.url === 'http://localhost3000/signup') {
      counterTimeSignin += event.date;
    } else if (event.url === 'http://localhost3000/admin') {
      counterTimeAdmin += event.date;
    } else if (event.url === 'http://localhost3000/') {
      counterTimeHome += event.date;
    }
  });

  const finalData = [
    { name: 'Login', value: Math.round((counterTimeLogin / 1000 / 60 / 60 + Number.EPSILON) * 100) / 100 },
    { name: 'Signin', value: Math.round((counterTimeSignin / 1000 / 60 / 60 + Number.EPSILON) * 100) / 100 },
    { name: 'Admin', value: Math.round((counterTimeAdmin / 1000 / 60 / 60 + Number.EPSILON) * 100) / 100 },
    { name: 'Home', value: Math.round((counterTimeHome / 1000 / 60 / 60 + Number.EPSILON) * 100) / 100 },
  ];

  res.status(200);
  res.send(finalData);
});

router.get('/chart/geolocation/:time', (req, res) => {
  const filteredData:{_id:string, geolocation:GeoLocation}[] = [];
  let events : Event[];
  if (req.params.time === 'today') {
    events = getTodaysEvents();
  } else if (req.params.time === 'week') {
    events = getWeeksEvents();
  } else {
    events = getAllEvents();
  }
  events.forEach((event) => {
    filteredData.push({ _id: event._id, geolocation: event.geolocation });
  });
  res.status(200);
  res.send(filteredData);
});

export default router;
