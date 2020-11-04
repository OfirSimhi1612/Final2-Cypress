import axios from "axios";
import React, { useEffect, useState } from "react";
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from 'recharts';
import { Event, os } from "../models/event";

interface OsCount {
  name: os;
  count: number;
}

const COLORS = ['#264653', '#2a9d8f', '#e9c46a', '#f4a261', '#e76f51','#9e2a2b'];

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  name,
  index
}: any) => {
  const RADIAN = Math.PI / 180;
  const radius = 10 + innerRadius + (outerRadius - innerRadius);
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill={COLORS[index % COLORS.length]}
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {name} {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const OsChart: React.FC = () => {
  const [osCount, setOSCount] = useState<OsCount[]>([]);

  useEffect(() => {
    async function fetch(){
      try{
        const { data } = await axios.get("http://localhost:3001/events/chart/os/all")
        const os = data.reduce((count: OsCount[], event: Event) => {
          count[count.findIndex(e => e.name === event.os)].count ++;
          return count;
        }, [
          {name: "windows", count: 0},
          {name: "mac", count: 0},
          {name: "linux", count: 0},
          {name: "ios", count: 0},
          {name: "android", count: 0},
          {name: "other", count: 0}
        ])
        setOSCount(os)
      } catch (error){
        console.log(error);
      }
    }

    fetch()
    
  }, [])
  

  return (
    <>
    <h2 style={{textAlign:"center"}}>Os Distribution</h2>
    {osCount.length > 0 &&
    <ResponsiveContainer>
      <PieChart width={400} height={300}>
        <Pie
          data={osCount} 
          cx="50%"
          cy="50%" 
          labelLine={false}
          label={renderCustomizedLabel} 
          outerRadius={100}
          fill="#8884d8"
          dataKey={"count"}
        >
          {
            osCount!.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)
          }
        </Pie>
        <Tooltip/>
      </PieChart>
      </ResponsiveContainer>
    }
    </>
  );
};

export default OsChart;


