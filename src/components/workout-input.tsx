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
import { CalendarIcon, PlusIcon, MinusIcon, XIcon, DumbbellIcon } from 'lucide-react'
import { format, differenceInDays } from 'date-fns'
import { Checkbox } from '@/components/ui/checkbox'
import { useToast } from "@/hooks/use-toast"
import { useNavigate } from 'react-router-dom'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface WorkoutInputProps {
  setActiveTab: (tab: string) => void;
}

export default function WorkoutInput({ setActiveTab }: WorkoutInputProps) {
  const [selectedMuscles, setSelectedMuscles] = useState<string[]>([])
  const [workout, setWorkout] = useState<MuscleGroup[]>([])
  const [date, setDate] = useState<Date>(new Date())
  const [showStreakDialog, setShowStreakDialog] = useState(false)
  const [streakCount, setStreakCount] = useState(0)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { toast } = useToast()
  const allMuscleGroups = useSelector((state: RootState) => state.workout.muscleGroups)
  const workouts = useSelector((state: RootState) => state.workout.workouts)

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
      if (newWorkout[muscleIndex].exercises[exerciseIndex].sets.length > 1) {
        newWorkout[muscleIndex].exercises[exerciseIndex].sets.splice(setIndex, 1)
      } else {
        toast({
          title: "Cannot remove set",
          description: "You must keep at least one set for each exercise.",
          variant: "destructive",
        })
      }
      return newWorkout
    })
  }

  const handleRemoveExercise = (muscleIndex: number, exerciseIndex: number) => {
    setWorkout(prevWorkout => {
      const newWorkout = JSON.parse(JSON.stringify(prevWorkout))
      newWorkout[muscleIndex].exercises.splice(exerciseIndex, 1)
      return newWorkout
    })
  }

  const handleSubmit = () => {
    if (workout.some(muscleGroup => muscleGroup.exercises.length === 0)) {
      toast({
        title: "Cannot save workout",
        description: "Please add at least one exercise for each selected muscle group.",
        variant: "destructive",
      })
      return
    }

    const newWorkout: Workout = {
      date: format(date, 'yyyy-MM-dd'),
      muscleGroups: workout
    }
    dispatch(addWorkout(newWorkout))
    updateStreak()
    setShowStreakDialog(true)
    // Reset the form after submission
    setWorkout([])
    setSelectedMuscles([])
    setDate(new Date())
  }

  const updateStreak = () => {
    const sortedWorkouts = [...workouts, { date: format(date, 'yyyy-MM-dd') }]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    let currentStreak = 1
    let lastWorkoutDate = new Date(sortedWorkouts[0].date)

    for (let i = 1; i < sortedWorkouts.length; i++) {
      const currentDate = new Date(sortedWorkouts[i].date)
      const daysDifference = differenceInDays(lastWorkoutDate, currentDate)

      if (daysDifference === 1) {
        currentStreak++
        lastWorkoutDate = currentDate
      } else if (daysDifference === 2) {
        lastWorkoutDate = currentDate
      } else {
        break
      }
    }

    setStreakCount(currentStreak)
  }

  const handleAddCustomExercise = (muscleGroup: string) => {
    navigate(`/?muscle=${encodeURIComponent(muscleGroup)}`)
    setActiveTab('custom')
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
          <div className='space-y-2'>
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
          <CardHeader className='border-b mb-2'>
            <CardTitle>{muscleGroup.name}</CardTitle>
          </CardHeader>
          <CardContent className=''>
            {muscleGroup.exercises.length === 0 ? (
              <div className="text-center py-4">
                <DumbbellIcon className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">No exercises added for this muscle group.</p>
                <Button
                  onClick={() => handleAddCustomExercise(muscleGroup.name)}
                  className="mt-4"
                >
                  Add Custom Exercise
                </Button>
              </div>
            ) : (
              muscleGroup.exercises.map((exercise, exerciseIndex) => (
                <div key={exercise.name} className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold">{exercise.name}</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveExercise(muscleIndex, exerciseIndex)}
                    >
                      <XIcon className="h-4 w-4" />
                    </Button>
                  </div>
                  {exercise.sets.map((set, setIndex) => (
                    <div key={setIndex} className="grid grid-cols-7 gap-2 items-center border-b pb-3">
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
                      <div className="col-span-2 flex justify-end mt-5">
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
              ))
            )}
          </CardContent>
        </Card>
      ))}
      
      {selectedMuscles.length > 0 && (
        <Button onClick={handleSubmit} className="w-full">Save Workout</Button>
      )}

      <Dialog open={showStreakDialog} onOpenChange={setShowStreakDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Workout Streak</DialogTitle>
            <DialogDescription>
              {streakCount > 1 ? (
                <>
                  <span className="text-2xl">🔥</span> Your current streak is {streakCount} days!
                </>
              ) : (
                <>
                  <span className="text-2xl">🕒</span> Keep it up! You're on day 1 of your streak.
                </>
              )}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  )
}