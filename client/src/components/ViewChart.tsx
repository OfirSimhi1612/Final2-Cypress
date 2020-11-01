import React,{useEffect} from 'react'
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  } from 'recharts';
  
export default function ViewChart() {
    const mockData = [{id:156,page:"HomePage"},{id:156,page:"HomePage"},{id:156,page:"HomePage"},{id:156,page:"HomePage"},{id:156,page:"HomePage"},{id:156,page:"HomePage"},{id:156,page:"HomePage"},{id:156,page:"HomePage"},{id:156,page:"HomePage"},{id:156,page:"HomePage"},{id:156,page:"HomePage"},{id:156,page:"HomePage"},{id:156,page:"HomePage"},{id:156,page:"HomePage"},{id:156,page:"HomePage"},{id:156,page:"HomePage"},{id:156,page:"HomePage"},{id:156,page:"HomePage"},{id:156,page:"HomePage"},{id:156,page:"HomePage"},{id:156,page:"HomePage"},{id:156,page:"HomePage"},{id:156,page:"HomePage"},{id:156,page:"HomePage"},{id:156,page:"HomePage"},{id:156,page:"HomePage"},{id:156,page:"HomePage"},{id:156,page:"HomePage"},{id:156,page:"HomePage"},{id:156,page:"HomePage"},
    {id:157,page:"Transactions"},{id:157,page:"Transactions"},{id:157,page:"Transactions"},{id:157,page:"Transactions"},{id:157,page:"Transactions"},{id:157,page:"Transactions"},{id:157,page:"Transactions"},{id:157,page:"Transactions"},{id:157,page:"Transactions"},{id:157,page:"Transactions"},{id:157,page:"Transactions"},{id:157,page:"Transactions"},{id:157,page:"Transactions"},{id:157,page:"Transactions"},{id:157,page:"Transactions"},{id:157,page:"Transactions"},{id:157,page:"Transactions"},{id:157,page:"Transactions"},{id:157,page:"Transactions"},{id:157,page:"Transactions"},{id:157,page:"Transactions"},{id:157,page:"Transactions"},
    {id:158,page:'My Profile'},{id:158,page:'My Profile'},{id:158,page:'My Profile'},{id:158,page:'My Profile'},{id:158,page:'My Profile'},{id:158,page:'My Profile'},{id:158,page:'My Profile'},{id:158,page:'My Profile'},{id:158,page:'My Profile'},{id:158,page:'My Profile'},{id:158,page:'My Profile'},{id:158,page:'My Profile'},{id:158,page:'My Profile'},{id:158,page:'My Profile'},{id:158,page:'My Profile'},{id:158,page:'My Profile'},{id:158,page:'My Profile'},{id:158,page:'My Profile'},{id:158,page:'My Profile'},{id:158,page:'My Profile'},{id:158,page:'My Profile'},{id:158,page:'My Profile'},{id:158,page:'My Profile'},{id:158,page:'My Profile'},{id:158,page:'My Profile'},{id:158,page:'My Profile'},{id:158,page:'My Profile'},{id:158,page:'My Profile'},{id:158,page:'My Profile'},{id:158,page:'My Profile'},{id:158,page:'My Profile'},{id:158,page:'My Profile'},{id:158,page:'My Profile'},{id:158,page:'My Profile'},{id:158,page:'My Profile'},{id:158,page:'My Profile'},{id:158,page:'My Profile'},{id:158,page:'My Profile'},
    {id:159,page:'statistics'},{id:159,page:'statistics'},{id:159,page:'statistics'},{id:159,page:'statistics'},{id:159,page:'statistics'},{id:159,page:'statistics'},{id:159,page:'statistics'},{id:159,page:'statistics'},{id:159,page:'statistics'},{id:159,page:'statistics'},{id:159,page:'statistics'},{id:159,page:'statistics'},{id:159,page:'statistics'},
]
    const updateData = () => {
      mockData.forEach((session) => {
        switch (session.page) {
            case "HomePage":
                    data[0].views++;
                break;
                case "Transactions":
                        data[1].views++;  
                    break;
                    case "My Profile":
                            data[2].views++;
                        break;
                        case "statistics":
                                data[3].views++;  
                        break;
            default:
                break;
      }})
    }
    const data = [
        {
          name: 'HomePage', views: 4000, amt: 2400,
        },
        {
          name: 'Transactions', views: 3000, amt: 2210,
        },
        {
          name: 'My Profile', views: 2000, amt: 2290,
        },
        {
          name: 'statistics', views: 3490, amt: 2100,
        },
      ];
      useEffect(() => {
          updateData();
      }, [])
    return (
        <div style={{}}>
            <BarChart
        width={500}
        height={280}
        data={data}
        margin={{
          top: 5, right: 100, bottom: 15,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="views" fill="#8884d8" background={{ fill: '#eee' }} />
      </BarChart>
        </div>
    )
}
