import React from "react";
//Libraries
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
//Pages
import Login from "./Pages/Login";
import Home from "./Pages/Home";
import Cancellations from "./Pages/Cancellations";
import CancellationDetail from "./Pages/CancellationDetail";
import CreateCancellation from "./Pages/CreateCancellation";
import CancellationMessage from "./Pages/CancellationMessage";
//Context
import { useData } from "./Context/DataContext";

const App = () => {
  const { isLoged } = useData();
  if (isLoged) {
    return (
      <Router>
        <Switch>
          <Route path="/" component={Home} exact />
          <Route path="/cancellations" component={Cancellations} exact />
          <Route
            path="/cancellations/:id"
            component={CancellationDetail}
            exact
          />
          <Route
            path="/createCancellation"
            component={CreateCancellation}
            exact
          />
          <Route
            path="/cancellationMessage"
            component={CancellationMessage}
            exact
          />
        </Switch>
      </Router>
    );
  }
  return <Login />;
};

export default App;
