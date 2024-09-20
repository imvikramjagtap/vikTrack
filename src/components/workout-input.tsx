import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addWorkout, MuscleGroup, Workout } from '../store/workoutSlice'
import { RootState } from '../store'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { CalendarIcon, PlusIcon, MinusIcon } from 'lucide-react'
import { format } from 'date-fns'
import { Checkbox } from '@/components/ui/checkbox'

export default function WorkoutInput() {
  const [selectedMuscles, setSelectedMuscles] = useState<string[]>([])
  const [workout, setWorkout] = useState<MuscleGroup[]>([])
  const [date, setDate] = useState<Date>(new Date())
  const dispatch = useDispatch()
  const allMuscleGroups = useSelector((state: RootState) => state.workout.muscleGroups)

  const handleMuscleSelection = (muscle: string) => {
    setSelectedMuscles(prev => 
      prev.includes(muscle) ? prev.filter(m => m !== muscle) : [...prev, muscle]
    )
  }

  const handleInputChange = (muscleIndex: number, exerciseIndex: number, setIndex: number, field: 'reps' | 'weight', value: number) => {
    setWorkout(prevWorkout => {
      const newWorkout = JSON.parse(JSON.stringify(prevWorkout))
      newWorkout[muscleIndex].exercises[exerciseIndex].sets[setIndex][field] = value
      return newWorkout
    })
  }

  const handleAddSet = (muscleIndex: number, exerciseIndex: number) => {
    setWorkout(prevWorkout => {
      const newWorkout = JSON.parse(JSON.stringify(prevWorkout))
      newWorkout[muscleIndex].exercises[exerciseIndex].sets.push({ reps: 0, weight: 0 })
      return newWorkout
    })
  }

  const handleRemoveSet = (muscleIndex: number, exerciseIndex: number, setIndex: number) => {
    setWorkout(prevWorkout => {
      const newWorkout = JSON.parse(JSON.stringify(prevWorkout))
      newWorkout[muscleIndex].exercises[exerciseIndex].sets.splice(setIndex, 1)
      return newWorkout
    })
  }

  const handleSubmit = () => {
    const newWorkout: Workout = {
      date: format(date, 'yyyy-MM-dd'),
      muscleGroups: workout
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
    setWorkout(JSON.parse(JSON.stringify(newWorkout)))
  }, [selectedMuscles, allMuscleGroups])

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
            <div className="grid grid-cols-2 gap-2">
              {allMuscleGroups.map((muscleGroup) => (
                <div key={muscleGroup.name} className="flex items-center space-x-2">
                  <Checkbox
                    id={muscleGroup.name}
                    checked={selectedMuscles.includes(muscleGroup.name)}
                    onCheckedChange={() => handleMuscleSelection(muscleGroup.name)}
                  />
                  <Label htmlFor={muscleGroup.name}>{muscleGroup.name}</Label>
                </div>
              ))}
            </div>
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
                  <div key={setIndex} className="grid grid-cols-7 gap-2 mb-2 items-center">
                    <div className="col-span-1">
                      <Label htmlFor={`${exercise.name}-set-${setIndex + 1}`}>Set {setIndex + 1}</Label>
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor={`${exercise.name}-reps-${setIndex}`}>Reps</Label>
                      <Input
                        id={`${exercise.name}-reps-${setIndex}`}
                        type="number"
                        value={set.reps}
                        onChange={(e) => handleInputChange(muscleIndex, exerciseIndex, setIndex, 'reps', parseInt(e.target.value))}
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor={`${exercise.name}-weight-${setIndex}`}>Weight (kg)</Label>
                      <Input
                        id={`${exercise.name}-weight-${setIndex}`}
                        type="number"
                        value={set.weight}
                        onChange={(e) => handleInputChange(muscleIndex, exerciseIndex, setIndex, 'weight', parseFloat(e.target.value))}
                      />
                    </div>
                    <div className="col-span-2 flex justify-end">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleRemoveSet(muscleIndex, exerciseIndex, setIndex)}
                        className="mr-2"
                      >
                        <MinusIcon className="h-4 w-4" />
                      </Button>
                      {setIndex === exercise.sets.length - 1 && (
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleAddSet(muscleIndex, exerciseIndex)}
                        >
                          <PlusIcon className="h-4 w-4" />
                        </Button>
                      )}
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