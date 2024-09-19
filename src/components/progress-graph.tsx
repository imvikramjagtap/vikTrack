import { useSelector } from 'react-redux';
import { RootState } from '../store';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ProgressGraph() {
  const workouts = useSelector((state: RootState) => state.workout.workouts);

  // Process workout data for the graph
  const processedData = workouts.reduce((acc, workout) => {
    workout.workout.forEach((muscleGroup) => {
      muscleGroup.exercises.forEach((exercise) => {
        const maxWeight = Math.max(...exercise.sets.map((set) => set.weight));
        if (!acc[exercise.name]) {
          acc[exercise.name] = [];
        }
        acc[exercise.name].push({ date: workout.date, weight: maxWeight });
      });
    });
    return acc;
  }, {});

  const chartData = Object.entries(processedData).map(([exercise, data]) => ({
    name: exercise,
    data: data.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    ),
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Progress Graph</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              type="category"
              allowDuplicatedCategory={false}
            />
            <YAxis />
            <Tooltip />
            <Legend />
            {chartData.map((s, index) => (
              <Line
                key={s.name}
                dataKey="weight"
                data={s.data}
                name={s.name}
                stroke={`hsl(${index * 45}, 70%, 50%)`}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
