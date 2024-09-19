import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MoonIcon, SunIcon } from 'lucide-react'
import { WorkoutInputComponent } from './workout-input'
import CustomWorkout from './custom-workout'
import WorkoutHistory from './workout-history'
import ProgressGraph from './progress-graph'

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('workout')
  const [ theme, setTheme ] = useState("light")

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="p-4 flex justify-between items-center bg-primary text-primary-foreground">
        <h1 className="text-2xl font-bold">Gym Workout Tracker</h1>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
        </Button>
      </header>
      <main className="container mx-auto p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="workout">Workout</TabsTrigger>
            <TabsTrigger value="custom">Custom Workout</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
          </TabsList>
          <TabsContent value="workout">
            <WorkoutInputComponent />
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