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
  workouts: Workout[]
  muscleGroups: MuscleGroup[]
}

const initialState: WorkoutState = {
  workouts: [],
  muscleGroups: [
    { name: "Back Muscles", exercises: [] },
    { name: "Biceps Muscles", exercises: [] },
    { name: "Chest Muscles", exercises: [] },
    { name: "Leg Muscles", exercises: [] },
    { name: "Shoulder Muscles", exercises: [] },
    { name: "Triceps Muscles", exercises: [] },
    { name: "Core Muscles", exercises: [] },
  ],
}

const workoutSlice = createSlice({
  name: 'workout',
  initialState,
  reducers: {
    addWorkout: (state, action: PayloadAction<Workout>) => {
      state.workouts.push(action.payload)
    },
    addCustomExercise: (state, action: PayloadAction<{ muscleGroup: string, exercise: Exercise }>) => {
      const { muscleGroup, exercise } = action.payload
      const group = state.muscleGroups.find(g => g.name === muscleGroup)
      if (group) {
        group.exercises.push(exercise)
      }
    },
    removeCustomExercise: (state, action: PayloadAction<{ muscleGroup: string, exerciseName: string }>) => {
      const { muscleGroup, exerciseName } = action.payload
      const group = state.muscleGroups.find(g => g.name === muscleGroup)
      if (group) {
        group.exercises = group.exercises.filter(e => e.name !== exerciseName)
      }
    },
  },
})

export const { addWorkout, addCustomExercise, removeCustomExercise } = workoutSlice.actions
export default workoutSlice.reducer