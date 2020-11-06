/// <reference path="types.ts" />

import express, { Request, Response } from 'express';
import { isEqual, pick } from 'lodash/fp';

import { reduce } from 'bluebird';
import { query } from 'express-validator';
import {
  getAllEvents, createEvent, getAllUsers,
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
import { User } from '../../client/src/models/user';
import { ensureAuthenticated, validateMiddleware } from './helpers';
import {
  shortIdValidation,
  searchValidation,
  userFieldsValidator,
  isUserValidator,
} from './validators';

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

router.get('/count', (req: Request, res: Response) => {
  const allEvents: Event[] = getAllEvents();

  res.json(allEvents.length);
});

router.get('/by-days/:offset', (req: Request, res: Response) => {
  const events = getLastWeekEventsCount(parseInt(req.params.offset));

  res.send(events);
});

router.get('/by-hours/:offset', (req: Request, res: Response) => {
  const events = getLastDayEventsCount(parseInt(req.params.offset));

  res.send(events);
});
router.get('/today', (req: Request, res: Response) => {
  const events = getTodaysEvents();

  res.send(events);
});
router.get('/week', (req: Request, res: Response) => {
  const events = getWeeksEvents();

  res.send(events);
});

router.get('/all', (req: Request, res: Response) => {
  const allEvents: Event[] = getAllEvents();

  res.json(allEvents);
});

router.get('/all-filtered', (req: Request, res: Response) => {
  const filters: Filter = req.query;
  let filtered: any[] = getAllEvents();

  if (filters.search && filters.search !== '') {
    const reg: RegExp = new RegExp(filters.search, 'i');
    filtered = filtered.filter((event) => Object.keys(event).reduce((test: boolean, key) => test || reg.test((event[key]).toString()), false));
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
});

router.get('/retention', (req: Request, res: Response) => {
  const { dayZero } = req.query;
  const retentionCohort:weeklyRetentionObject[] = getRetentionCohort(parseInt(dayZero));
  res.json(retentionCohort);
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

//   router.get('/chart/timeonpage/allusers',(req,res) => {

//     const allUsers = getAllUsers();

//     let userURLdetails:
//     {"userId": string,
//     "username": string,
//     "login": number,
//     "signin": number,
//     "admin": number,
//     "home": number}[] = [];

//     allUsers.forEach(user => {
//       const userEvents: Event[] = getEventsByUserId(user.id);

//       let counterTimeLogin = 0;
//       let counterTimeSignin = 0;
//       let counterTimeAdmin = 0;
//       let counterTimeHome = 0;

//     userEvents.forEach(event => {
//       if (event.url === "http://localhost3000/login") {
//         counterTimeLogin += event.date;
//       } else if (event.url === "http://localhost3000/signup") {
//         counterTimeSignin += event.date;
//       } else if (event.url === "http://localhost3000/admin") {
//         counterTimeAdmin += event.date;
//       } else if (event.url === "http://localhost3000/") {
//         counterTimeHome += event.date;
//       }
//     })

//     userURLdetails.push({
//       "userId": user.id,
//       "username": user.username,
//       "login": counterTimeLogin / 1000,
//       "signin": counterTimeSignin ,
//       "admin": counterTimeAdmin ,
//       "home": counterTimeHome
//     })

//   })
//   let counterLogin = 0;
//   let counterSignin = 0;
//   let counterAdmin = 0;
//   let counterHome = 0;

//   userURLdetails.forEach((user) => {
//     counterLogin +=  user.login;
//     counterSignin += user.signin;
//     counterAdmin += user.admin;
//     counterHome += user.home;
//   });
//   res.status(200);
//   res.send(userURLdetails);
// });

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

// router.get("/test", (req: Request, res: Response) => {
//   const events = retention(parseInt(req.query.dayZero))
//   res.send(events)
// })

export default router;
