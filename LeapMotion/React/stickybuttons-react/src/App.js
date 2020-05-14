import React, { Component } from "react";
import { Provider } from "react-redux";
import "./App.scss";
import store from "./store";
import StickyBtns from "./components/StickyBtns/StickyBtns";
import Demo from "./components/demo/Demo";

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <div className="app">
          <StickyBtns orientation={1} triggerTime={2000} selectRadius={200} />
          <Demo />
        </div>
      </Provider>
    );
  }
}
export default App;
