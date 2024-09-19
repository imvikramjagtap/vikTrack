import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { addWorkout, WorkoutState } from '@/store/workoutSlice'

type Set = {
  reps: number
  weight: number
}

type Exercise = {
  name: string
  sets: Set[]
}

type MuscleGroup = {
  name: string
  exercises: Exercise[]
}

const allMuscleGroups: MuscleGroup[] = [
  {
    name: 'Back Muscles',
    exercises: [
      { name: 'Bent-over Rowing', sets: [{ reps: 12, weight: 0 }, { reps: 12, weight: 0 }, { reps: 12, weight: 0 }, { reps: 12, weight: 0 }] },
      { name: 'Seated Rowing', sets: [{ reps: 12, weight: 0 }, { reps: 12, weight: 0 }, { reps: 12, weight: 0 }, { reps: 12, weight: 0 }] },
      { name: 'Lat Pulldown', sets: [{ reps: 12, weight: 0 }, { reps: 12, weight: 0 }, { reps: 12, weight: 0 }, { reps: 12, weight: 0 }] },
    ],
  },
  {
    name: 'Biceps Muscles',
    exercises: [
      { name: 'E-Z Bar Curl', sets: [{ reps: 12, weight: 0 }, { reps: 12, weight: 0 }, { reps: 12, weight: 0 }, { reps: 12, weight: 0 }] },
      { name: 'Preacher Curl', sets: [{ reps: 12, weight: 0 }, { reps: 12, weight: 0 }, { reps: 12, weight: 0 }, { reps: 12, weight: 0 }] },
      { name: 'Incline DB Curl', sets: [{ reps: 12, weight: 0 }, { reps: 12, weight: 0 }, { reps: 12, weight: 0 }, { reps: 12, weight: 0 }] },
      { name: 'Hammer Curl', sets: [{ reps: 15, weight: 0 }, { reps: 15, weight: 0 }, { reps: 15, weight: 0 }] },
    ],
  },
  // ... (other muscle groups)
]

export function WorkoutInputComponent() {
  const [selectedMuscles, setSelectedMuscles] = useState<string[]>([])
  const [workout, setWorkout] = useState<MuscleGroup[]>([])
  const [date, setDate] = useState<Date>(new Date())
  const dispatch = useDispatch()

  const handleMuscleSelection = (muscles: string[]) => {
    setSelectedMuscles(muscles)
  }

  const handleInputChange = (muscleIndex: number, exerciseIndex: number, setIndex: number, field: keyof Set, value: number) => {
    const updatedWorkout = [...workout]
    updatedWorkout[muscleIndex].exercises[exerciseIndex].sets[setIndex][field] = value
    setWorkout(updatedWorkout)
  }

  const handleSubmit = () => {
    const newWorkout: WorkoutState = {
      date: format(date, 'yyyy-MM-dd'),
      workout: workout
    }
    dispatch(addWorkout(newWorkout))
    // Reset the form after submission
    setWorkout([])
    setSelectedMuscles([])
    setDate(new Date())
  }

  // Update workout when selected muscles change
  useEffect(() => {
    const newWorkout = allMuscleGroups.filter(mg => selectedMuscles.includes(mg.name))
    setWorkout(newWorkout)
  }, [selectedMuscles])

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Workout Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="date">Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={`w-full justify-start text-left font-normal ${!date && "text-muted-foreground"}`}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(newDate) => newDate && setDate(newDate)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <Label htmlFor="muscles">Select Muscles to Train</Label>
            <Select onValueChange={handleMuscleSelection} value={selectedMuscles}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select muscles" />
              </SelectTrigger>
              <SelectContent>
                {allMuscleGroups.map((muscleGroup) => (
                  <SelectItem key={muscleGroup.name} value={muscleGroup.name}>
                    {muscleGroup.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {workout.map((muscleGroup, muscleIndex) => (
        <Card key={muscleGroup.name}>
          <CardHeader>
            <CardTitle>{muscleGroup.name}</CardTitle>
          </CardHeader>
          <CardContent>
            {muscleGroup.exercises.map((exercise, exerciseIndex) => (
              <div key={exercise.name} className="mb-4">
                <h4 className="font-semibold mb-2">{exercise.name}</h4>
                {exercise.sets.map((set, setIndex) => (
                  <div key={setIndex} className="grid grid-cols-3 gap-4 mb-2">
                    <div>
                      <Label htmlFor={`${exercise.name}-set-${setIndex + 1}`}>Set {setIndex + 1}</Label>
                    </div>
                    <div>
                      <Label htmlFor={`${exercise.name}-reps-${setIndex}`}>Reps</Label>
                      <Input
                        id={`${exercise.name}-reps-${setIndex}`}
                        type="number"
                        value={set.reps}
                        onChange={(e) => handleInputChange(muscleIndex, exerciseIndex, setIndex, 'reps', parseInt(e.target.value))}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`${exercise.name}-weight-${setIndex}`}>Weight (kg)</Label>
                      <Input
                        id={`${exercise.name}-weight-${setIndex}`}
                        type="number"
                        value={set.weight}
                        onChange={(e) => handleInputChange(muscleIndex, exerciseIndex, setIndex, 'weight', parseFloat(e.target.value))}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
      
      {selectedMuscles.length > 0 && (
        <Button onClick={handleSubmit} className="w-full">Save Workout</Button>
      )}
    </div>
  )
}