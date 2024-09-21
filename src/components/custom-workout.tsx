import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addCustomExercise, Exercise } from '../store/workoutSlice'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PlusIcon, CheckIcon } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"
import { RootState } from '@/store'

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

  const [addedExercises, setAddedExercises] = useState<string[]>([])

  useEffect(() => {
    if (muscleGroup) {
      const muscleGroupExercises = allMuscleGroups.find(mg => mg.name === muscleGroup)?.exercises || []
      setAddedExercises(muscleGroupExercises.map(e => e.name))
    } else {
      setAddedExercises([])
    }
  }, [muscleGroup, allMuscleGroups])

  const handleSubmit = () => {
    if (addedExercises.includes(exerciseName)) {
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
    setAddedExercises([...addedExercises, exerciseName])
    // Reset the form after submission
    setExerciseName('')
    setReps(0)
  }

  const handleAddSuggestedExercise = (exercise: Exercise) => {
    if (addedExercises.includes(exercise.name)) {
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
    setAddedExercises([...addedExercises, exercise.name])
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

      {muscleGroup && (
        <Card>
          <CardHeader>
            <CardTitle>Suggested Exercises for {muscleGroup}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {suggestedExercises[muscleGroup as keyof typeof suggestedExercises]?.map((exercise) => (
                <div key={exercise.name} className="flex justify-between items-center">
                  <span>{exercise.name}</span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleAddSuggestedExercise(exercise)}
                    disabled={addedExercises.includes(exercise.name)}
                  >
                    {addedExercises.includes(exercise.name) ? (
                      <CheckIcon className="h-4 w-4" />
                    ) : (
                      <>
                        <PlusIcon className="h-4 w-4 mr-2" />
                        Add
                      </>
                    )}
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