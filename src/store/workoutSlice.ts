import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface Set {
  reps: number
  weight: number
}

export interface Exercise {
  name: string
  sets: Set[]
}

export interface MuscleGroup {
  name: string
  exercises: Exercise[]
}

export interface Workout {
  date: string
  muscleGroups: MuscleGroup[]
}

interface WorkoutState {
  muscleGroups: MuscleGroup[]
  workouts: Workout[]
}

const initialMuscleGroups: MuscleGroup[] = [
  {
    name: 'Back Muscles',
    exercises: [
      { name: 'Bent-over Rowing', sets: [{ reps: 12, weight: 0 }] },
      { name: 'Seated Rowing', sets: [{ reps: 12, weight: 0 }] },
      { name: 'Lat Pulldown', sets: [{ reps: 12, weight: 0 }] },
    ],
  },
  {
    name: 'Biceps Muscles',
    exercises: [
      { name: 'E-Z Bar Curl', sets: [{ reps: 12, weight: 0 }] },
      { name: 'Preacher Curl', sets: [{ reps: 12, weight: 0 }] },
      { name: 'Incline DB Curl', sets: [{ reps: 12, weight: 0 }] },
      { name: 'Hammer Curl', sets: [{ reps: 15, weight: 0 }] },
    ],
  },
  // ... other muscle groups
]

const initialState: WorkoutState = {
  muscleGroups: initialMuscleGroups,
  workouts: []
}

const workoutSlice = createSlice({
  name: 'workout',
  initialState,
  reducers: {
    addWorkout: (state, action: PayloadAction<Workout>) => {
      state.workouts.push(action.payload)
    },
    addCustomExercise: (state, action: PayloadAction<{ muscleGroup: string; exercise: Exercise }>) => {
      const { muscleGroup, exercise } = action.payload
      const existingGroup = state.muscleGroups.find(group => group.name === muscleGroup)
      if (existingGroup) {
        existingGroup.exercises.push(exercise)
      } else {
        state.muscleGroups.push({
          name: muscleGroup,
          exercises: [exercise]
        })
      }
    },
    updateWorkout: (state, action: PayloadAction<{ index: number; workout: Workout }>) => {
      state.workouts[action.payload.index] = action.payload.workout
    }
  }
})

export const { addWorkout, addCustomExercise, updateWorkout } = workoutSlice.actions

export default workoutSlice.reducer