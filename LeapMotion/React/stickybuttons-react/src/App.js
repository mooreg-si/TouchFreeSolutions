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
          <StickyBtns />
          <Demo />
        </div>
      </Provider>
    );
  }
}
export default App;
