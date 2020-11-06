import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { weeklyRetentionObject } from '../models/event';
import {
  Td, Th, DatesTd, Table, Container,
} from '../styledComponents/Retention';
import { analyticsMachine } from '../machines/analyticsMachine';
import { useMachine } from "@xstate/react";

const OneHour: number = 1000 * 60 * 60;
const OneDay: number = OneHour * 24;
const OneWeek: number = OneDay * 7;

const getDefalutDayZero = () => {
  const today = new Date(new Date().toDateString()).getTime() + 6 * OneHour;
  const dayZeroInMili = today - 8 * OneWeek;

  return dayZeroInMili;
};

const RetentionCohort: React.FC = () => {
  const [dayZero] = useState<number>(getDefalutDayZero());
  const [current, send] = useMachine(analyticsMachine);
  const { results } = current.context;

  useEffect(() => {
    send('FETCH', { params: 'retention', query: {dayZero: dayZero}})
  }, []);

  return (
    <>
      <Container>
        <Table>
          <tr>
            <Th>Time frame</Th>
            {
              results && 
              results.map((week:weeklyRetentionObject, index:number) => (
              <Th>
                Week
                {index}
              </Th>
            ))
            }
          </tr>
          { results
          && results.map((week: weeklyRetentionObject) => (
            <tr>
              <DatesTd>
                <div>
                  {week.start}
                  {' '}
                  -
                  {week.end}
                </div>
                <div style={{ fontSize: '12px', fontWeight: 'normal' }}>
                  {week.newUsers}
                  {' '}
                  New Users
                </div>
              </DatesTd>
              {
                week.weeklyRetention.map((retention: number) => (
                  <Td theme={{ percents: retention }}>
                    {retention}
                    %
                  </Td>
                ))
              }
            </tr>
          ))}
        </Table>
      </Container>
    </>
  );
};

export default RetentionCohort;
