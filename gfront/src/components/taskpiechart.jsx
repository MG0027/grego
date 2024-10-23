
import { useSelector } from 'react-redux';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import styles from './taskpiechart.module.css'

const TaskPieChart = () => {
  // Fetch tasks from Redux
  const tasks = useSelector((state) => state.task); // Assuming tasks are stored in redux state.tasks

  // Filter completed and incomplete tasks
  const completedTasks = tasks.filter((task) => task.completed === true);
  const incompleteTasks = tasks.filter((task) => task.completed === false);

  // Prepare data for the pie chart
  const pieData = [
    { name: 'Completed Tasks', value: completedTasks.length },
    { name: 'Incomplete Tasks', value: incompleteTasks.length }
  ];

  // Colors for the pie chart
  const COLORS = ['royalblue', 'grey'];

  return (
    <div style={{ textAlign: 'center', backgroundColor:'' ,}}>
      

      <h4 className={styles.pieh}>Task Completion Status</h4>
      <PieChart width={350} height={350} >
        <Pie
          data={pieData}
          cx={175}
          cy={155}
          outerRadius={140}
          fill="#8884d8"
          dataKey="value"
         
        >
          {pieData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip 
         contentStyle={{
          backgroundColor: 'white !important', // Tooltip background color
          border: '1px solid #ccc',
           // Optional: add a border to the tooltip
        }}
        itemStyle={{
          color: 'black !important', // Text color inside the tooltip
        }}/>
        <Legend 
         
         layout="horizontal" // Vertical layout for the legend
         verticalAlign="bottom" // Align to the top of the legend
         align="right" // Center the legend
         wrapperStyle={{
           
           marginBottom:'10px',
           
         }}
          />
      </PieChart >

    </div>
  );
};

export default TaskPieChart;
