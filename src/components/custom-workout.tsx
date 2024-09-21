import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addCustomExercise, removeCustomExercise, Exercise } from '../store/workoutSlice'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PlusIcon, XIcon } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"
import { ScrollArea } from "@/components/ui/scroll-area"
import { RootState } from '@/store'
import { useLocation, useNavigate } from 'react-router-dom'

const suggestedExercises = {
  "Back Muscles": [
    { name: "Deadlift", sets: [{ reps: 10, weight: 0 }] },
    { name: "Pull-Up", sets: [{ reps: 12, weight: 0 }] },
    { name: "Bent Over Row", sets: [{ reps: 10, weight: 0 }] },
    { name: "Lat Pulldown", sets: [{ reps: 12, weight: 0 }] }
  ],
  "Biceps Muscles": [
    { name: "Barbell Curl", sets: [{ reps: 12, weight: 0 }] },
    { name: "Dumbbell Curl", sets: [{ reps: 12, weight: 0 }] },
    { name: "Hammer Curl", sets: [{ reps: 12, weight: 0 }] },
    { name: "Preacher Curl", sets: [{ reps: 12, weight: 0 }] }
  ],
  "Chest Muscles": [
    { name: "Bench Press", sets: [{ reps: 10, weight: 0 }] },
    { name: "Incline Bench Press", sets: [{ reps: 10, weight: 0 }] },
    { name: "Chest Fly", sets: [{ reps: 12, weight: 0 }] },
    { name: "Push-Up", sets: [{ reps: 15, weight: 0 }] }
  ],
  "Leg Muscles": [
    { name: "Squat", sets: [{ reps: 10, weight: 0 }] },
    { name: "Leg Press", sets: [{ reps: 12, weight: 0 }] },
    { name: "Lunges", sets: [{ reps: 12, weight: 0 }] },
    { name: "Leg Curl", sets: [{ reps: 12, weight: 0 }] }
  ],
  "Shoulder Muscles": [
    { name: "Overhead Press", sets: [{ reps: 10, weight: 0 }] },
    { name: "Lateral Raise", sets: [{ reps: 12, weight: 0 }] },
    { name: "Front Raise", sets: [{ reps: 12, weight: 0 }] },
    { name: "Shrugs", sets: [{ reps: 12, weight: 0 }] }
  ],
  "Triceps Muscles": [
    { name: "Tricep Pushdown", sets: [{ reps: 12, weight: 0 }] },
    { name: "Overhead Tricep Extension", sets: [{ reps: 12, weight: 0 }] },
    { name: "Close-Grip Bench Press", sets: [{ reps: 10, weight: 0 }] },
    { name: "Dips", sets: [{ reps: 12, weight: 0 }] }
  ],
  "Core Muscles": [
    { name: "Plank", sets: [{ reps: 1, weight: 0 }] },
    { name: "Russian Twists", sets: [{ reps: 15, weight: 0 }] },
    { name: "Leg Raises", sets: [{ reps: 12, weight: 0 }] },
    { name: "Sit-Ups", sets: [{ reps: 15, weight: 0 }] }
  ]
}

export default function CustomWorkout() {
  const [muscleGroup, setMuscleGroup] = useState('')
  const [exerciseName, setExerciseName] = useState('')
  const [reps, setReps] = useState(0)
  const dispatch = useDispatch()
  const { toast } = useToast()
  const allMuscleGroups = useSelector((state: RootState) => state.workout.muscleGroups)
  const location = useLocation()
  const navigate = useNavigate()

  const [addedExercises, setAddedExercises] = useState<Exercise[]>([])

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const muscleParam = searchParams.get('muscle')
    if (muscleParam) {
      setMuscleGroup(decodeURIComponent(muscleParam))
    }
    navigate('/')
  }, [location])

  useEffect(() => {
    if (muscleGroup) {
      const muscleGroupExercises = allMuscleGroups.find(mg => mg.name === muscleGroup)?.exercises || []
      setAddedExercises(muscleGroupExercises)
    } else {
      setAddedExercises([])
    }
  }, [muscleGroup, allMuscleGroups])

  const handleSubmit = () => {
    if (addedExercises.some(e => e.name.toLowerCase() === exerciseName.toLowerCase())) {
      toast({
        title: "Exercise already exists",
        description: `${exerciseName} is already added to ${muscleGroup}.`,
        variant: "destructive",
      })
      return
    }

    const newExercise: Exercise = {
      name: exerciseName,
      sets: [{ reps, weight: 0 }]
    }
    dispatch(addCustomExercise({ muscleGroup, exercise: newExercise }))
    toast({
      title: "Custom exercise added",
      description: `${exerciseName} has been added to ${muscleGroup}.`,
    })
    setAddedExercises([...addedExercises, newExercise])
    // Reset the form after submission
    setExerciseName('')
    setReps(0)
  }

  const handleAddSuggestedExercise = (exercise: Exercise) => {
    if (addedExercises.some(e => e.name === exercise.name)) {
      toast({
        title: "Exercise already added",
        description: `${exercise.name} is already in ${muscleGroup}.`,
      })
      return
    }

    dispatch(addCustomExercise({ muscleGroup, exercise }))
    toast({
      title: "Suggested exercise added",
      description: `${exercise.name} has been added to ${muscleGroup}.`,
    })
    setAddedExercises([...addedExercises, exercise])
  }

  const handleRemoveExercise = (exerciseName: string) => {
    dispatch(removeCustomExercise({ muscleGroup, exerciseName }))
    setAddedExercises(addedExercises.filter(e => e.name !== exerciseName))
    toast({
      title: "Exercise removed",
      description: `${exerciseName} has been removed from ${muscleGroup}.`,
    })
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Add Custom Exercise</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-4">
            <div>
              <Label htmlFor="muscle-group">Muscle Group</Label>
              <Select 
                onValueChange={setMuscleGroup}
                value={muscleGroup}
              >
                <SelectTrigger id="muscle-group">
                  <SelectValue placeholder="Select muscle group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Back Muscles">Back Muscles</SelectItem>
                  <SelectItem value="Biceps Muscles">Biceps Muscles</SelectItem>
                  <SelectItem value="Chest Muscles">Chest Muscles</SelectItem>
                  <SelectItem value="Leg Muscles">Leg Muscles</SelectItem>
                  <SelectItem value="Shoulder Muscles">Shoulder Muscles</SelectItem>
                  <SelectItem value="Triceps Muscles">Triceps Muscles</SelectItem>
                  <SelectItem value="Core Muscles">Core Muscles</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {muscleGroup && (
              <ScrollArea className="h-20">
                <div className="flex flex-wrap gap-2">
                  {suggestedExercises[muscleGroup as keyof typeof suggestedExercises]
                    ?.filter(exercise => !addedExercises.some(e => e.name === exercise.name))
                    .map((exercise) => (
                      <Button
                        key={exercise.name}
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddSuggestedExercise(exercise)}
                      >
                        <PlusIcon className="h-4 w-4 mr-2" />
                        {exercise.name}
                      </Button>
                    ))}
                </div>
              </ScrollArea>
            )}
            <div>
              <Label htmlFor="exercise-name">Exercise Name</Label>
              <Input 
                id="exercise-name" 
                value={exerciseName}
                onChange={(e) => setExerciseName(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="reps">Default Reps</Label>
              <Input 
                id="reps" 
                type="number" 
                value={reps}
                onChange={(e) => setReps(parseInt(e.target.value))}
              />
            </div>
            <Button type="submit" className="w-full">Add Custom Exercise</Button>
          </form>
        </CardContent>
      </Card>

      {muscleGroup && addedExercises.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Added Exercises for {muscleGroup}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {addedExercises.map((exercise) => (
                <div key={exercise.name} className="flex justify-between items-center">
                  <span>{exercise.name}</span>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleRemoveExercise(exercise.name)}
                  >
                    <XIcon className="h-4 w-4 mr-2" />
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}