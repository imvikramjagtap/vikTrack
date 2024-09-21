import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../store'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { MoonIcon, SunIcon, DumbbellIcon, PlusCircleIcon, ClipboardListIcon, LineChartIcon } from 'lucide-react'
import WorkoutInput from './workout-input'
import CustomWorkout from './custom-workout'
import WorkoutHistory from './workout-history'
import ProgressGraph from './progress-graph'

export default function App() {
  const currentTheme: "light" | "dark" | null = localStorage.getItem('theme') as "light" | "dark" | null;
  const [activeTab, setActiveTab] = useState('workout')
  const [theme, setTheme] = useState<'light' | 'dark'>(currentTheme || 'light')
  const muscleGroups = useSelector((state: RootState) => state.workout.muscleGroups)

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

  return (
    <div className={`min-h-screen bg-background text-foreground ${theme}`}>
      <header className="p-4 flex justify-between items-center container">
        <h1 className="text-2xl font-bold">Gym Workout Tracker</h1>
        <Button
          variant="outline"
          size="icon"
          onClick={toggleTheme}
        >
          {theme === 'dark' ? <SunIcon className="h-[1.2rem] w-[1.2rem]" /> : <MoonIcon className="h-[1.2rem] w-[1.2rem]" />}
        </Button>
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