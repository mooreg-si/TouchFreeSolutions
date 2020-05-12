import "./demo.scss";
import { connect } from "react-redux";
import React, { Component } from "react";
import { addButtons, removeButtons } from "../../actions/btnActions";

class Demo extends Component {
  constructor(props) {
    super(props);
    this.state = { buttonStates: [false, false] };
    this.ref1 = React.createRef();
    this.ref2 = React.createRef();
  }

  componentDidMount() {
    this.props.addButtons({ ref1: this.ref1.current, ref2: this.ref2.current });
  }

  componentWillUnmount() {
    this.props.removeButtons(["ref1", "ref2"]);
  }

  /* Handle Clicks on the button */
  handleBtnClick(btn) {
    //current button states
    let buttonStates = this.state.buttonStates;
    //toggle the button
    buttonStates[btn] = !buttonStates[btn];
    //toggle the button
    this.setState({ buttonStates });
  }

  render() {
    return (
      <div className="demo">
        <div
          ref={this.ref1}
          className={`btn${this.state.buttonStates[0] ? " active" : ""}`}
          id="btn1"
          onClick={() => this.handleBtnClick(0)}
        >
          Click to turn {this.state.buttonStates[0] ? "Off" : "On"}
        </div>
        <div
          ref={this.ref2}
          className={`btn${this.state.buttonStates[1] ? " active" : ""}`}
          id="btn2"
          onClick={() => this.handleBtnClick(1)}
        >
          Click to turn {this.state.buttonStates[1] ? "Off" : "On"}
        </div>
      </div>
    );
  }
}

export default connect(null, { addButtons, removeButtons })(Demo);
