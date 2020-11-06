import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell,
} from 'recharts';
import axios from 'axios';
import { Event, eventName } from '../models/event';
import { analyticsMachine } from '../machines/analyticsMachine';
import { useMachine } from "@xstate/react";

  interface ViewsCount {
    name: eventName;
    count: number;
    url: string;
  }

const COLORS = ['#264653', '#2a9d8f', '#e9c46a', '#f4a261', '#e76f51', '#9e2a2b'];

const ViewsChart: React.FC = () => {
  const [viewsCount, setViewsCount] = useState<ViewsCount[]>([]);
  const [current, send, analyticsService] = useMachine(analyticsMachine);
  const { pageData, results } = current.context;

  useEffect(() => {
    send('FETCH', { params: 'all'})
  }, [])

  useEffect(() => {
      if(results) {
        const views = results.reduce((count: ViewsCount[], event: Event) => {
          count[count.findIndex((e) => e.url === event.name)].count += 1;
          return count;
        }, [
          { name: 'Login', count: 0, url: 'login' },
          { name: 'Signup', count: 0, url: 'signup' },
          { name: 'Analitics', count: 0, url: 'admin' },
          { name: 'Home Page', count: 0, url: '/' },
        ]);
        setViewsCount(views);
      }
  }, [results]);

  return (
    <>
      <h2 style={{ textAlign: 'center' }}>Page Views Distribution</h2>
      {viewsCount.length > 0
      && (
        <ResponsiveContainer>
          <BarChart width={730} height={250} data={viewsCount}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count">
              {
            viewsCount!.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)
              }
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </>
  );
};

export default ViewsChart;
