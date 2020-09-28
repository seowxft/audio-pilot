import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import StartPage from "./Components/StartPage";
import HeadphoneCheck from "./Components/HeadphoneCheck";
import AudioFreq from "./Components/AudioFreq";
import AudioPilot from "./Components/AudioPilot";
import EndPage from "./Components/EndPage";

import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" component={StartPage} exact />
        <Route path="/HeadphoneCheck" component={HeadphoneCheck} exact />
        <Route path="/AudioFreq" component={AudioFreq} exact />
        <Route path="/AudioPilot" component={AudioPilot} exact />
        <Route path="/EndPage" component={EndPage} exact />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
