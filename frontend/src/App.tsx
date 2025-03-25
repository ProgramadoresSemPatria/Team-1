import "./App.css";
import { Header } from "./components/Header/Header";

function App() {
  return (
    <>
      <Header
        options={["Features", "Case Studies", "Pricing", "Applications"]}
      />
    </>
  );
}

export default App;
