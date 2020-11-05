import React, { useEffect, useState } from "react";
import axios from "axios";
import { weeklyRetentionObject } from "../models/event";
import { Td, Th, DatesTd, Table, Container } from "../styledComponents/Retention"; 

const OneHour: number = 1000 * 60 * 60; 
const OneDay: number = OneHour * 24
const OneWeek: number = OneDay*7

// 0:
// end: "Oct 06 2020"
// newUsers: 9
// registrationWeek: 0
// start: "Sep 30 2020"
// weeklyRetention: (6) [100, 100, 78, 89, 33, 0]
// __proto__: Object
// 1:
// end: "Oct 13 2020"
// newUsers: 16
// registrationWeek: 1
// start: "Oct 07 2020"
// weeklyRetention: (5) [100, 100, 100, 94, 0]
// __proto__: Object
// 2:
// end: "Oct 20 2020"
// newUsers: 9
// registrationWeek: 2
// start: "Oct 14 2020"
// weeklyRetention: (4) [100, 100, 78, 0]
// __proto__: Object
// 3:
// end: "Oct 27 2020"
// newUsers: 9
// registrationWeek: 3
// start: "Oct 21 2020"
// weeklyRetention: (3) [100, 89, 0]
// __proto__: Object
// 4:
// end: "Nov 03 2020"
// newUsers: 7
// registrationWeek: 4
// start: "Oct 28 2020"
// weeklyRetention: (2) [100, 0]
// __proto__: Object
// 5:
// end: "Nov 10 2020"
// newUsers: 0
// registrationWeek: 5
// start: "Nov 04 2020"
// weeklyRetention: [100]

const getDefalutDayZero = () => {
  const today = new Date (new Date().toDateString()).getTime()+6*OneHour
  const dayZeroInMili = today-8*OneWeek

  return dayZeroInMili;
}


const RetentionCohort: React.FC = () => {
  
  const [cohortData, setCohortData] = useState<weeklyRetentionObject[]>()
  const [dayZero, setDayZero] = useState<number>(getDefalutDayZero())


  useEffect(() => {
    const fetch = async () => {
      const { data } = await axios.get(`http://localhost:3001/events/retention?dayZero=${dayZero}`);

      console.log(data)
      setCohortData(data);
    }
    fetch()
  }, [])

  return (
    <>
    <Container>
      <Table>
        <tr>
          <Th>Time frame</Th>
          {
            cohortData &&
            cohortData.map((week:weeklyRetentionObject , index:number) => <Th>Week {index}</Th>)
          }
        </tr>
        { cohortData && 
          cohortData.map((week: weeklyRetentionObject) => {
            return (
              <tr>
                <DatesTd>
                  <div>
                    {week.start} - {week.end}
                  </div>
                  <div style={{fontSize: "12px", fontWeight: "normal"}}>
                    {week.newUsers} New Users
                  </div>
                </DatesTd>
                {
                  week.weeklyRetention.map((retention: number) => {
                    return (
                      <Td theme={{percents: retention}}>
                        {retention}%
                      </Td>
                    );
                  })
                }
              </tr>
            );
          } )
        }
      </Table>
      </Container>
    </>
  );
};

export default RetentionCohort;
