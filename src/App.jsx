import ChartComponent from "./components/ChartComponent";
import jsonData from "./components/NPS-2024-04-08.json";
import "../src/App.css";

const App = () => {
  const data = jsonData;

  return (
    <div className="container">
      <div className="containerChart">
        <h1>Evolución de NPS Global</h1>
        <ChartComponent data={data} station="C1" />
        <ChartComponent data={data} station="C2" />
      </div>
    </div>
  );
};

export default App;
