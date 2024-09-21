import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./store";
import Dashboard from "./components/dashboard";
import { Toaster } from "./components/ui/toaster";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import packageJson from '../package.json';

function MyApp() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Dashboard />,
    },
  ]);
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <RouterProvider router={router} />
        <Toaster />
        <p className='w-full text-center border-t p-2'>©️ Vikram Jagtap | v{packageJson.version}</p>
      </PersistGate>
    </Provider>
  );
}

export default MyApp;
