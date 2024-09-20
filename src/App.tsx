import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from './store'
import Dashboard from './components/dashboard'
import { Toaster } from './components/ui/toaster'


function MyApp() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
          <Dashboard />
          <Toaster />
      </PersistGate>
    </Provider>
  )
}

export default MyApp