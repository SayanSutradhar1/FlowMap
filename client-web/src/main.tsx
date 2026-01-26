import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { Toaster } from "./components/ui/sonner";
import "./index.css";
import { Provider } from "react-redux";
import store from "./lib/store";

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
      <Toaster
        style={{
          color: "ButtonText",
          background: "black",
        }}
      />
    </BrowserRouter>
  </Provider>
);
