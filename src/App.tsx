import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./store";
import Dashboard from "./components/dashboard";
import { Toaster } from "./components/ui/toaster";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

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
      </PersistGate>
    </Provider>
  );
}

export default MyApp;
