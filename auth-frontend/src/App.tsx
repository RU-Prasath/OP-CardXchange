import { ToastContainer } from "react-toastify";
import AppRouter from "./router/AuthRouter";

function App() {
  return (
    <>
      <AppRouter />
      <ToastContainer />
    </>
  );
}

export default App;
