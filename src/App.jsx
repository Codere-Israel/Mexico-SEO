import { observer } from "mobx-react";
import "./App.css";
import AyudaRoutes from "./routes/AyudaRoutes";
import NavigationBar from "./components/NavigationBar";

const App = observer(() => {
  return (
    <div className="pb-3 scrollbar-none bg-[#252a30] min-h-screen">
      <div className="flex flex-col md:flex-row">
        <NavigationBar />
        <AyudaRoutes />
      </div>
    </div>
  );
});

export default App;
