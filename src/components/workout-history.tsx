import { useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../store'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'

export default function WorkoutHistory() {
  const [dateRange, setDateRange] = useState({ from: undefined, to: undefined })
  const workouts = useSelector((state: RootState) => state.workout)

  console.log(workouts.workouts, "worke");
  
  const filteredWorkouts = workouts.workouts.filter(workout => {
    const workoutDate = new Date(workout.date)
    if (dateRange.from && dateRange.to) {
      return workoutDate >= dateRange.from && workoutDate <= dateRange.to
    }
    return true
  })

  // Group workouts by date and muscle
  const groupedWorkouts = filteredWorkouts.reduce((acc, workout) => {
    if (!acc[workout.date]) {
      acc[workout.date] = {}
    }
    workout.workout.forEach((muscleGroup) => {
      if (!acc[workout.date][muscleGroup.name]) {
        acc[workout.date][muscleGroup.name] = []
      }
      acc[workout.date][muscleGroup.name].push(...muscleGroup.exercises)
    })
    return acc
  }, {})

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[280px] justify-start text-left font-normal">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange.from ? (
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
                    {exerciseIndex === 0 && setIndex === 0 && muscleIndex === 0 && <TableCell rowSpan={Object.values(muscles).flat().reduce((acc, e) => acc + e.sets.length, 0)}>{date}</TableCell>}
                    {setIndex === 0 && exerciseIndex === 0 && <TableCell rowSpan={exercises.reduce((acc, e) => acc + e.sets.length, 0)}>{muscle}</TableCell>}
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
    </div>
  )
}