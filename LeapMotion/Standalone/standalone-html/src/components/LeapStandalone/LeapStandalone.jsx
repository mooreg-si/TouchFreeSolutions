import React, { Component } from "react";
import ReactDOM from "react-dom";
import Leap from "leapjs";
import "leapjs-plugins";
import "./leapStandalone.scss";
import debounce from "debounce";
import MdLocate from "react-ionicons/lib/MdLocate";
import params from "./params";

class LeapStandalone extends Component {
  constructor(props) {
    super(props);
    this._isMounted = false;
    //X cursor history
    this.xCursHist = [];
    //y cursor history
    this.yCursHist = [];
    //selector history
    this.selectorHistory = [];
    //store x and y selector sums so we don't have to recalculate every time
    this.selectorSums = { x: 0, y: 0 };
    //if the hoverTimeout is running
    this.timeoutRunning = false;

    this.state = {
      cursorX: 0,
      cursorY: 0,
      selectorX: 0,
      selectorY: 0,
      hoverTimeout: null,
      selectorTimeout: null,
      cursorShown: false,
      selectorShown: true,
      clickTriggered: false,
    };
  }

  componentDidMount() {
    this._isMounted = true;
    Leap.loop({
      hand: (hand) => {
        debounce(
          this.updateHand(hand.screenPosition()),
          41 //do not run faster than 24 frames per second
        );
      },
      frame: (frame) => {
        //if there are no hands in frame
        if (frame.hands.length === 0) {
          //clear the timeout
          clearTimeout(this.state.hoverTimeout);
          //clear the selector history
          this.selectorHistory = [];
          this.selectorSums = { x: 0, y: 0 };
          //hide the cursor
          this.setState({ cursorShown: false, selectorShown: false });
        }
      },
    }).use("screenPosition");
  }

  componentDidUpdate(prevState) {
    //if the clicktriggered flag has changed and is true
    if (
      prevState.clickTriggered !== this.state.clickTriggered &&
      this.state.clickTriggered
    ) {
      //trigger the click
      this.simClick();
    }
  }

  /* handle updates to the hand */
  updateHand(hand) {
    //update the selector
    this.updateSelector(hand);
    this.setState({
      //set the cursor position
      cursorX: this.getCursorAverage(hand[0], "X"),
      cursorY: this.getCursorAverage(
        hand[params.orientation] + window.innerHeight, //automatically adjust to screen size
        "Y"
      ),
      cursorShown: true,
    });
  }

  /* update the selector */
  updateSelector(coords) {
    //push the new position to the history
    this.selectorHistory.push({
      x: coords[0],
      y: coords[params.orientation],
      timestamp: new Date(),
    });
    //make sure the history is in order
    this.selectorHistory.sort((a, b) => a.timestamp - b.timestamp);
    //add the new position to the sum
    this.selectorSums.x += coords[0];
    this.selectorSums.y += coords[params.orientation];
    //store current time
    const now = new Date();
    //get any records older than two seconds
    for (let i = 0; i < this.selectorHistory.length; i++) {
      const record = this.selectorHistory[i];
      //if new enough stop looking
      if (now - record.timestamp <= params.hoverTime) {
        break;
      }
      //subtract the record from the sum
      this.selectorSums.x -= record.x;
      this.selectorSums.y -= record.y;
      //remove the record from history
      this.selectorHistory.shift();
    }
    //store the new positions
    const newX = this.selectorSums.x / this.selectorHistory.length;
    const newY =
      this.selectorSums.y / this.selectorHistory.length + window.innerHeight;
    //get the distance to the last selector position
    let distance = Math.abs(coords[0] - this.state.selectorX);
    distance += Math.abs(
      coords[params.orientation] + window.innerHeight - this.state.selectorY
    );

    //user is hovering if position has shifted less than 100
    const hovering = distance <= params.hoverRange;

    //object to be set as state
    let newState = {
      selectorX: newX,
      selectorY: newY,
      selectorShown: hovering, //show the selector if position within 200 of average
    };

    //if the user is not hovering
    if (!hovering) {
      //clear the timeouts
      clearTimeout(this.state.hoverTimeout);
      clearTimeout(this.state.selectorTimeout);
      this.timeoutRunning = false;
    }
    //if no timeout running yet
    else if (!this.timeoutRunning) {
      newState.hoverTimeout = setTimeout(() => {
        this.setState({
          clickTriggered: true, //set flag to trigger click
          selectorShown: false, //hide the selector so we can't click it
          cursorShown: false, //hide the cursor so we can't click it
        });
      }, params.hoverTime);
      this.timeoutRunning = true;
    }
    //update the selector position
    this.setState(newState);
  }
  /* Calculate average position over set number of samples */
  getCursorAverage(newest, axis) {
    //get the history for the axis
    let history = axis === "X" ? this.xCursHist : this.yCursHist;
    //add the new position to the array
    history.push(newest);
    //if the array is too long
    if (history.length > 10) {
      //remove the oldest item
      history.shift();
    }
    let average = 0;
    //add each value to the average
    history.forEach((value) => (average += value));
    average = average / history.length;
    return average;
  }

  componentWillUnmount() {
    this._isMounted = false;
    //clean up the timeout
    clearTimeout(this.state.hoverTimeout);
    clearTimeout(this.state.selectorTimeout);
  }

  /* Simulate a mouse click */
  simClick() {
    //store the x and y coordinates
    const x = Math.round(this.state.selectorX)+25;//add 25 to get the center not left
    const y = Math.round(this.state.selectorY)+25;//add 25 to get the center not top
    //get the element under the selector
    const el = document.elementFromPoint(x, y);
    //generate a simulated mousedown
    const evDown = new MouseEvent("mousedown", {
      view: window,
      bubbles: true,
      cancelable: true,
      screenX: x,
      screenY: y,
    });
    //generate a simulated mouseup
    const evUp = new MouseEvent("mouseup", {
      view: window,
      bubbles: true,
      cancelable: true,
      screenX: x,
      screenY: y,
    });

    //dispatch the mouse down
    el.dispatchEvent(evDown);
    //also click for click listeners
    el.click();
    //wait ten milliseconds then mouseup
    setTimeout(el.dispatchEvent(evUp), 10);
    //reset the clickTriggered flag
    this.setState({ clickTriggered: false, cursorShown: true });
  }

  render() {
    return (
      <div className="leapStandalone">
        {this.state.cursorShown && (
          <MdLocate
            className="cursor"
            style={{
              left: `${this.state.cursorX}px`,
              top: `${this.state.cursorY}px`,
            }}
            color={params.cursorColor}
          />
        )}
        {
          //if the selector is shown
          this.state.selectorShown && (
            <div
              className="selector"
              style={{
                left: `${this.state.selectorX}px`,
                top: `${this.state.selectorY}px`,
              }}
            >
              <div className="indicator" />
            </div>
          )
        }
      </div>
    );
  }
}

export default LeapStandalone;

const wrapper = document.getElementById("standaloneTarget");
wrapper ? ReactDOM.render(<LeapStandalone />, wrapper) : false;
