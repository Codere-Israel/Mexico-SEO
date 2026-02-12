import { observer } from "mobx-react";
import "./App.css";
import SeoRoutes from "./routes/SeoRoutes";
import NavigationBar from "./components/NavigationBar";

const App = observer(() => {
  return (
    <div className="pb-3 scrollbar-none bg-[#252a30]">
      <NavigationBar />
      <SeoRoutes />
    </div>
  );
});

export default App;
