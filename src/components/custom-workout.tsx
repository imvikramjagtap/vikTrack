import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { addCustomWorkout } from '@/store/workoutSlice'

type CustomWorkout = {
  muscleGroup: string
  exerciseName: string
  sets: number
  reps: number
}

export default function CustomWorkout() {
  const [customWorkout, setCustomWorkout] = useState<CustomWorkout>({
    muscleGroup: '',
    exerciseName: '',
    sets: 0,
    reps: 0
  })
  const dispatch = useDispatch()

  const handleInputChange = (field: keyof CustomWorkout, value: string | number) => {
    setCustomWorkout(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = () => {
    dispatch(addCustomWorkout(customWorkout))
    // Reset the form after submission
    setCustomWorkout({
      muscleGroup: '',
      exerciseName: '',
      sets: 0,
      reps: 0
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Custom Workout</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-4">
          <div>
            <Label htmlFor="muscle-group">Muscle Group</Label>
            <Select 
              onValueChange={(value) => handleInputChange('muscleGroup', value)}
              value={customWorkout.muscleGroup}
            >
              <SelectTrigger id="muscle-group">
                <SelectValue placeholder="Select muscle group" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="chest">Chest</SelectItem>
                <SelectItem value="back">Back</SelectItem>
                <SelectItem value="legs">Legs</SelectItem>
                <SelectItem value="shoulders">Shoulders</SelectItem>
                <SelectItem value="arms">Arms</SelectItem>
                <SelectItem value="core">Core</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="exercise-name">Exercise Name</Label>
            <Input 
              id="exercise-name" 
              value={customWorkout.exerciseName}
              onChange={(e) => handleInputChange('exerciseName', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="sets">Sets</Label>
            <Input 
              id="sets" 
              type="number" 
              value={customWorkout.sets}
              onChange={(e) => handleInputChange('sets', parseInt(e.target.value))}
            />
          </div>
          <div>
            <Label htmlFor="reps">Reps</Label>
            <Input 
              id="reps" 
              type="number" 
              value={customWorkout.reps}
              onChange={(e) => handleInputChange('reps', parseInt(e.target.value))}
            />
          </div>
          <Button type="submit" className="w-full">Add Custom Workout</Button>
        </form>
      </CardContent>
    </Card>
  )
}