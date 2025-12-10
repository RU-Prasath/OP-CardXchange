import { ToastContainer } from "react-toastify";
import AppRouter from "./router/AuthRouter";
import { CartProvider } from "./context/CartContext";

function App() {
  return (
    <>
      <CartProvider>
        <AppRouter />
        <ToastContainer />
      </CartProvider>
    </>
  );
}

export default App;
