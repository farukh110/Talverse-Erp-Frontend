import * as React from 'react';
import { PieChart, Pie, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Chrome', value: 50 },
  { name: 'Mozilla Firefox', value: 30 },
  { name: 'Opera Browser', value: 15 },
  { name: 'Other', value: 5 },
];

class PieChartExample extends React.Component<any> {
  state = {
    activeIndex: 0,
  };

  getInitialState() {
    return {
      activeIndex: 0,
    };
  }

  onPieEnter(data: any, index: any) {
    this.setState({
      activeIndex: index,
    });
  }

  render() {
    
    return (
      <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>  
      <PieChart width={300} height={300}>
        <Pie dataKey="value" data={data} cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label />
        <Tooltip />
      </PieChart>
      </ResponsiveContainer>
      </div>
    );
  }
}

export default PieChartExample;
