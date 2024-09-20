import { useState, useMemo } from 'react';
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
import { format, parseISO, startOfWeek, startOfMonth, isWithinInterval } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { DateRange } from "react-day-picker"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { CalendarIcon, FileX } from "lucide-react"

interface WorkoutData {
  date: string;
  weight: number;
}

interface ChartData {
  name: string;
  data: WorkoutData[];
}

export default function ProgressGraph() {
  const workouts = useSelector((state: RootState) => state.workout.workouts);
  const [selectedMuscle, setSelectedMuscle] = useState<string>('All');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [progressView, setProgressView] = useState<'day' | 'week' | 'month'>('day');

  const muscleGroups = useMemo(() => {
    const groups = new Set<string>();
    workouts.forEach(workout => {
      workout.muscleGroups.forEach(group => groups.add(group.name));
    });
    return ['All', ...Array.from(groups)];
  }, [workouts]);

  // Process workout data for the graph
  const processedData = useMemo(() => {
    return workouts.reduce((acc: Record<string, WorkoutData[]>, workout) => {
      const workoutDate = parseISO(workout.date);
      
      // Filter by date range
      if (dateRange && dateRange.from && dateRange.to) {
        if (!isWithinInterval(workoutDate, { start: dateRange.from, end: dateRange.to })) {
          return acc;
        }
      }

      workout.muscleGroups.forEach((muscleGroup) => {
        if (selectedMuscle === 'All' || selectedMuscle === muscleGroup.name) {
          muscleGroup.exercises.forEach((exercise) => {
            const maxWeight = Math.max(...exercise.sets.map((set) => set.weight));
            if (!acc[exercise.name]) {
              acc[exercise.name] = [];
            }
            let dateKey: string;
            switch (progressView) {
              case 'week':
                dateKey = format(startOfWeek(workoutDate), 'yyyy-MM-dd');
                break;
              case 'month':
                dateKey = format(startOfMonth(workoutDate), 'yyyy-MM-dd');
                break;
              default:
                dateKey = workout.date;
            }
            const existingEntry = acc[exercise.name].find(entry => entry.date === dateKey);
            if (existingEntry) {
              existingEntry.weight = Math.max(existingEntry.weight, maxWeight);
            } else {
              acc[exercise.name].push({ date: dateKey, weight: maxWeight });
            }
          });
        }
      });
      return acc;
    }, {});
  }, [workouts, selectedMuscle, dateRange, progressView]);

  const chartData: ChartData[] = useMemo(() => {
    return Object.entries(processedData).map(([exercise, data]) => ({
      name: exercise,
      data: data.sort(
        (a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime()
      ),
    }));
  }, [processedData]);

  const hasData = chartData.length > 0 && chartData.some(series => series.data.length > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Progress Graph</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 mb-4">
          <div>
            <Label htmlFor="muscle-select">Select Muscle Group</Label>
            <Select onValueChange={setSelectedMuscle} value={selectedMuscle}>
              <SelectTrigger id="muscle-select">
                <SelectValue placeholder="Select a muscle group" />
              </SelectTrigger>
              <SelectContent>
                {muscleGroups.map((muscle) => (
                  <SelectItem key={muscle} value={muscle}>
                    {muscle}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="progress-view">Progress View</Label>
            <Select onValueChange={(value: 'day' | 'week' | 'month') => setProgressView(value)} value={progressView}>
              <SelectTrigger id="progress-view">
                <SelectValue placeholder="Select progress view" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Daily</SelectItem>
                <SelectItem value="week">Weekly</SelectItem>
                <SelectItem value="month">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Date Range</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={"outline"}
                  className={`w-full justify-start text-left font-normal ${!dateRange && "text-muted-foreground"}`}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "LLL dd, y")} -{" "}
                        {format(dateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        {hasData ? (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                type="category"
                allowDuplicatedCategory={false}
                tickFormatter={(dateString) => format(parseISO(dateString), progressView === 'month' ? 'MMM yyyy' : 'MMM dd')}
              />
              <YAxis />
              <Tooltip
                labelFormatter={(label) => format(parseISO(label), 'MMM dd, yyyy')}
                formatter={(value: number) => [`${value} kg`, 'Weight']}
              />
              <Legend />
              {chartData.map((s, index) => (
                <Line
                  key={s.name}
                  dataKey="weight"
                  data={s.data}
                  name={s.name}
                  stroke={`hsl(${index * 45}, 70%, 50%)`}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex flex-col items-center justify-center h-[400px] text-gray-500">
            <FileX size={48} />
            <p className="mt-2 text-lg font-semibold">No data available</p>
            <p className="text-sm">Try adjusting your filters or add more workout data</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}