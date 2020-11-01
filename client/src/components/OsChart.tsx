import React from "react";
import { LineChart, Line, CartesianGrid, XAxis, YAxis } from 'recharts';

const mockData = [ { "_id": "vern685wo7gbtg8iwhw487oy", "session_id": "gehos8t4hlkros5", "name": "Signed Up", "distinct_user_id": "13793", "referred": "Friend", "time": 1371002000, "os": "windows", "browser": "chrome", "geolocation": {
    "location": { "lat": 51.0, "lng": -0.1 }, "accuracy": 1200.4, }, }, { "_id": "vern685wo7gbtg8iwhw487oy", "session_id": "fsdawgwg35gsd5", "name": "Viewed Home page", "distinct_user_id": "13793", "referred": "Friend", "time": 1371002000, "os": "android", "browser": "chrome", "geolocation": {
    "location": { "lat": 51.0, "lng": -0.1 }, "accuracy": 1200.4, }, }, ]

const OsChart: React.FC = () => {
  let  usersOS : {
        mac:number ,
        windows:number,
        android:number,
        linux:number,
        other:number,
    }
     usersOS = {
         mac:0,
         windows:0,
         android:0,
         linux:0,
         other:0,
     }
   
    mockData.forEach(element => {
        switch (element.os) {
            case "windows":
                usersOS.windows++;
                break;
                case "mac":
                    usersOS.mac++;
                    case "linux":
                        usersOS.linux++;
                        case "android":
                        usersOS.android++;
            default:
                usersOS.other++;
                break;
        }    
    });
  return (
    <>
    <LineChart width={500} height={300} data={mockData}>
    <XAxis dataKey="name"/>
    <YAxis/>
    <CartesianGrid stroke="#eee" strokeDasharray="5 5"/>
    <Line type="monotone" dataKey="uv" stroke="#8884d8" />
    <Line type="monotone" dataKey="pv" stroke="#82ca9d" />
  </LineChart>
    </>
  );
};

export default OsChart;