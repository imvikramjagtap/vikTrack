import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { addCustomExercise, Exercise } from '../store/workoutSlice'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function CustomWorkout() {
  const [muscleGroup, setMuscleGroup] = useState('')
  const [exerciseName, setExerciseName] = useState('')
  const [reps, setReps] = useState(0)
  const dispatch = useDispatch()

  const handleSubmit = () => {
    const newExercise: Exercise = {
      name: exerciseName,
      sets: [{ reps, weight: 0 }]
    }
    dispatch(addCustomExercise({ muscleGroup, exercise: newExercise }))
    // Reset the form after submission
    setMuscleGroup('')
    setExerciseName('')
    setReps(0)
  }

  return (
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
  )
}