import { useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../store'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarIcon, FileX } from 'lucide-react'
import { format, isWithinInterval, parseISO } from 'date-fns'
import { DateRange } from 'react-day-picker'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface WorkoutEntry {
  date: string
  muscleGroups: {
    name: string
    exercises: {
      name: string
      sets: {
        reps: number
        weight: number
      }[]
    }[]
  }[]
}

export default function WorkoutHistory() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const workouts = useSelector((state: RootState) => state.workout.workouts)

  const filteredWorkouts = workouts.filter(workout => {
    const workoutDate = parseISO(workout.date)
    if (dateRange?.from && dateRange?.to) {
      return isWithinInterval(workoutDate, { start: dateRange.from, end: dateRange.to })
    }
    return true
  })

  // Group workouts by date and muscle
  const groupedWorkouts = filteredWorkouts.reduce((acc, workout) => {
    if (!acc[workout.date]) {
      acc[workout.date] = {}
    }
    workout.muscleGroups.forEach((muscleGroup) => {
      if (!acc[workout.date][muscleGroup.name]) {
        acc[workout.date][muscleGroup.name] = []
      }
      acc[workout.date][muscleGroup.name].push(...muscleGroup.exercises)
    })
    return acc
  }, {} as Record<string, Record<string, WorkoutEntry['muscleGroups'][0]['exercises']>>)

  const hasData = Object.keys(groupedWorkouts).length > 0

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
                <TableHead>Date</TableHead>
                <TableHead>Muscle Group</TableHead>
                <TableHead>Exercise</TableHead>
                <TableHead>Set</TableHead>
                <TableHead>Reps</TableHead>
                <TableHead>Weight (kg)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(groupedWorkouts).map(([date, muscles]) => (
                Object.entries(muscles).map(([muscle, exercises], muscleIndex) => (
                  exercises.map((exercise, exerciseIndex) => (
                    exercise.sets.map((set, setIndex) => (
                      <TableRow key={`${date}-${muscle}-${exerciseIndex}-${setIndex}`}>
                        {exerciseIndex === 0 && setIndex === 0 && muscleIndex === 0 && (
                          <TableCell rowSpan={Object.values(muscles).flat().reduce((acc, e) => acc + e.sets.length, 0)}>
                            {format(parseISO(date), 'MMM dd, yyyy')}
                          </TableCell>
                        )}
                        {setIndex === 0 && exerciseIndex === 0 && (
                          <TableCell rowSpan={exercises.reduce((acc, e) => acc + e.sets.length, 0)}>
                            {muscle}
                          </TableCell>
                        )}
                        {setIndex === 0 && <TableCell rowSpan={exercise.sets.length}>{exercise.name}</TableCell>}
                        <TableCell>{setIndex + 1}</TableCell>
                        <TableCell>{set.reps}</TableCell>
                        <TableCell>{set.weight}</TableCell>
                      </TableRow>
                    ))
                  ))
                ))
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