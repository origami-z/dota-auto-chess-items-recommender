import { useState } from "react";
import { Provider, darkTheme, RadioGroup, Radio } from "@adobe/react-spectrum";

import Table from "./Table";
import Grid from "./Grid";

import "./App.css";

function App() {
  const [displayMode, setDisplayMode] = useState("Grid");

  return (
    <Provider theme={darkTheme}>
      {/* <RadioGroup
        label="Display mode"
        orientation="horizontal"
        value={displayMode}
        onChange={setDisplayMode}
      >
        <Radio value="Table">Table</Radio>
        <Radio value="Grid">Grid</Radio>
      </RadioGroup> */}
      <div className="App">
        <h1>Dota Auto Chess Items</h1>
        {displayMode === "Table" ? <Table /> : <Grid />}
      </div>
    </Provider>
  );
}

export default App;
