import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface WorkoutState {
  workouts: any[];
  customWorkouts: any[];
}

const initialState: WorkoutState = {
  workouts: [],
  customWorkouts: [],
};

const workoutSlice = createSlice({
  name: 'workout',
  initialState,
  reducers: {
    addWorkout: (state, action: PayloadAction<any>) => {
      state.workouts.push(action.payload);
    },
    addCustomWorkout: (state, action: PayloadAction<any>) => {
      state.customWorkouts.push(action.payload);
    },
    updateWorkout: (
      state,
      action: PayloadAction<{ index: number; workout: any }>
    ) => {
      state.workouts[action.payload.index] = action.payload.workout;
    },
  },
});
export const { addWorkout, addCustomWorkout, updateWorkout } =
  workoutSlice.actions;

export default workoutSlice.reducer;
