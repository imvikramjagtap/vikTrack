import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../store'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { MoonIcon, SunIcon, DumbbellIcon, PlusCircleIcon, ClipboardListIcon, LineChartIcon, FlameIcon, ClockIcon } from 'lucide-react'
import WorkoutInput from './workout-input'
import CustomWorkout from './custom-workout'
import WorkoutHistory from './workout-history'
import ProgressGraph from './progress-graph'
import { differenceInDays } from 'date-fns'

export default function App() {
  const currentTheme: "light" | "dark" | null = localStorage.getItem('theme') as "light" | "dark" | null;
  const [activeTab, setActiveTab] = useState('workout');
  const [streakCount, setStreakCount] = useState(0)
  const [streakStatus, setStreakStatus] = useState<'active' | 'warning' | 'lost'>('lost')
  const [theme, setTheme] = useState<'light' | 'dark'>(currentTheme || 'dark')
  const workouts = useSelector((state: RootState) => state.workout.workouts)

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null
    if (savedTheme) {
      setTheme(savedTheme)
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark')
    }
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light')
  }

  useEffect(() => {
    updateStreak()
  }, [workouts])

  const updateStreak = () => {
    if (workouts.length === 0) {
      setStreakCount(0)
      setStreakStatus('lost')
      return
    }

    const sortedWorkouts = [...workouts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    let currentStreak = 1
    let lastWorkoutDate = new Date(sortedWorkouts[0].date)
    const today = new Date()

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

    const daysSinceLastWorkout = differenceInDays(today, lastWorkoutDate)
    if (daysSinceLastWorkout === 0) {
      setStreakStatus('active')
    } else if (daysSinceLastWorkout === 1) {
      setStreakStatus('warning')
    } else {
      setStreakStatus('lost')
    }
  }

  return (
    <div className={`min-h-screen bg-background text-foreground ${theme}`}>
      <header className="p-4 flex justify-between items-center container">
        <div className="flex flex-col items-start">
        <h1 className="text-2xl font-bold">VikRep</h1>
        <p className='text-xs'>Every Rep Counts</p>
        </div>
        <div className="flex items-center space-x-2">
          {streakCount !== 0 && <Button title={`You have ${streakCount} day streak`} variant="outline" size="default" className="flex gap-2 p-2">
            {streakStatus === 'active' && (
            <FlameIcon className="h-6 w-6 text-orange-500" />
          )}
          {streakStatus === 'warning' && (
            <ClockIcon className="h-6 w-6 text-yellow-500" />
          )}
          <span className="font-semibold">{streakCount}</span>
          </Button>}
          
        <Button
          variant="outline"
          size="icon"
          onClick={toggleTheme}
        >
          {theme === 'dark' ? <SunIcon className="h-[1.2rem] w-[1.2rem]" /> : <MoonIcon className="h-[1.2rem] w-[1.2rem]" />}
        </Button>
        </div>
      </header>
      <main className="container mx-auto p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="workout" className="flex flex-col items-center sm:flex-row sm:justify-center">
              <DumbbellIcon className="h-5 w-5 sm:mr-2" />
              {/* <span className="mt-1 sm:mt-0">Workout</span> */}
            </TabsTrigger>
            <TabsTrigger value="custom" className="flex flex-col items-center sm:flex-row sm:justify-center">
              <PlusCircleIcon className="h-5 w-5 sm:mr-2" />
              {/* <span className="mt-1 sm:mt-0">Custom</span> */}
            </TabsTrigger>
            <TabsTrigger value="history" className="flex flex-col items-center sm:flex-row sm:justify-center">
              <ClipboardListIcon className="h-5 w-5 sm:mr-2" />
              {/* <span className="mt-1 sm:mt-0">History</span> */}
            </TabsTrigger>
            <TabsTrigger value="progress" className="flex flex-col items-center sm:flex-row sm:justify-center">
              <LineChartIcon className="h-5 w-5 sm:mr-2" />
              {/* <span className="mt-1 sm:mt-0">Progress</span> */}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="workout">
            <WorkoutInput setActiveTab={setActiveTab} />
          </TabsContent>
          <TabsContent value="custom">
            <CustomWorkout />
          </TabsContent>
          <TabsContent value="history">
            <WorkoutHistory />
          </TabsContent>
          <TabsContent value="progress">
            <ProgressGraph />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}