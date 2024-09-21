import { useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../store'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarIcon, FileX, ArrowUpDown } from 'lucide-react'
import { format, isWithinInterval, parseISO } from 'date-fns'
import { DateRange } from 'react-day-picker'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'


interface FlattenedWorkout {
  date: string
  muscleGroup: string
  exercise: string
  set: number
  reps: number
  weight: number
}

type SortField = 'date' | 'set' | 'reps' | 'weight'
type SortOrder = 'asc' | 'desc'

export default function WorkoutHistory() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [sortField, setSortField] = useState<SortField>('date')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')
  const workouts = useSelector((state: RootState) => state.workout.workouts)

  const filteredWorkouts = workouts.filter(workout => {
    const workoutDate = parseISO(workout.date)
    if (dateRange?.from && dateRange?.to) {
      return isWithinInterval(workoutDate, { start: dateRange.from, end: dateRange.to })
    }
    return true
  })

  // Flatten and sort workouts
  const flattenedWorkouts: FlattenedWorkout[] = filteredWorkouts.flatMap(workout =>
    workout.muscleGroups.flatMap(muscleGroup =>
      muscleGroup.exercises.flatMap(exercise =>
        exercise.sets.map((set, index) => ({
          date: workout.date,
          muscleGroup: muscleGroup.name,
          exercise: exercise.name,
          set: index + 1,
          reps: set.reps,
          weight: set.weight
        }))
      )
    )
  )

  const sortedWorkouts = flattenedWorkouts.sort((a, b) => {
    if (sortField === 'date') {
      return sortOrder === 'asc' 
        ? new Date(a.date).getTime() - new Date(b.date).getTime()
        : new Date(b.date).getTime() - new Date(a.date).getTime()
    }
    if (sortField === 'set' || sortField === 'reps' || sortField === 'weight') {
      return sortOrder === 'asc' 
        ? a[sortField] - b[sortField]
        : b[sortField] - a[sortField]
    }
    return 0
  })

  const toggleSort = (field: SortField) => {
    if (field === sortField) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('asc')
    }
  }

  const hasData = sortedWorkouts.length > 0

  return (
    <Card>
      <CardHeader>
        <CardTitle>Workout History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-end mb-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[280px] justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(dateRange.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={setDateRange}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        {hasData ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="cursor-pointer" onClick={() => toggleSort('date')}>
                  Date {sortField === 'date' && <ArrowUpDown className="ml-2 h-4 w-4 inline" />}
                </TableHead>
                <TableHead>Muscle Group</TableHead>
                <TableHead>Exercise</TableHead>
                <TableHead className="cursor-pointer" onClick={() => toggleSort('set')}>
                  Set {sortField === 'set' && <ArrowUpDown className="ml-2 h-4 w-4 inline" />}
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => toggleSort('reps')}>
                  Reps {sortField === 'reps' && <ArrowUpDown className="ml-2 h-4 w-4 inline" />}
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => toggleSort('weight')}>
                  Weight (kg) {sortField === 'weight' && <ArrowUpDown className="ml-2 h-4 w-4 inline" />}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedWorkouts.map((workout, index) => (
                <TableRow key={`${workout.date}-${workout.muscleGroup}-${workout.exercise}-${workout.set}-${index}`}>
                  <TableCell>{format(parseISO(workout.date), 'MMM dd, yyyy')}</TableCell>
                  <TableCell>{workout.muscleGroup}</TableCell>
                  <TableCell>{workout.exercise}</TableCell>
                  <TableCell>{workout.set}</TableCell>
                  <TableCell>{workout.reps}</TableCell>
                  <TableCell>{workout.weight}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="flex flex-col items-center justify-center h-[400px] text-gray-500">
            <FileX size={48} />
            <p className="mt-2 text-lg font-semibold">No workout history available</p>
            <p className="text-sm">Try adjusting your date range or add more workout data</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}