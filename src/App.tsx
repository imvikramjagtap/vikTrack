import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from './store'
import Dashboard from './components/dash'


function MyApp() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
          <Dashboard />
      </PersistGate>
    </Provider>
  )
}

export default MyApp