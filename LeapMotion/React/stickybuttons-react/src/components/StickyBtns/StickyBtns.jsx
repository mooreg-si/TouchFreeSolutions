import React, { Component } from "react";
import propTypes from "prop-types";
import { connect } from "react-redux";
import { addButtons, removeButtons } from "../../actions/btnActions";
import Leap from "leapjs";
import "leapjs-plugins";
import "./stickyBtns.scss";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import debounce from "debounce";
import { jsonEqual } from "../../actions/utilActions";
import IosHandOutline from "react-ionicons/lib/IosHandOutline";
import MdLocate from "react-ionicons/lib/MdLocate";

class StickyBtns extends Component {
  _isMounted = false;
  //X position history
  xHist = [];
  //y position history
  yHist = [];
  //array of button coordinates
  btnCoords;
  constructor(props) {
    super(props);
    this.state = {
      cursorX: 0,
      cursorY: 0,
      selectionTimeout: null,
      cursorShown: false,
    };
  }
  componentDidMount() {
    this._isMounted = true;
    Leap.loop({
      hand: (hand) => {
        debounce(
          this.setState({
            cursorX: this.getAverage(hand.screenPosition()[0], "X"),
            cursorY: this.getAverage(
              hand.screenPosition()[this.props.orientation] +
                window.innerHeight,
              "Y"
            ),
            cursorShown: true,
          }),
          41 //do not run faster than 24 frames per second
        );
      },
      frame: (frame) => {
        //if there are no hands in frame
        if (frame.hands.length === 0) {
          //clear the timeout
          clearTimeout(this.state.selectionTimeout);
          //hide the cursor
          this.setState({ cursorShown: false, selected: null });
        }
      },
    }).use("screenPosition");
  }

  /* Calculate average position over set number of samples */
  getAverage(newest, axis) {
    //get the history for the axis
    let history = axis === "X" ? this.xHist : this.yHist;
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
    clearTimeout(this.state.selectionTimeout);
  }
  componentDidUpdate(prevProps, prevState) {
    //if buttons have changed
    if (
      !jsonEqual(
        Object.keys(this.props.buttons).sort(),
        Object.keys(prevProps.buttons).sort()
      )
    ) {
      //reset the button coordinates
      this.btnCoords = [];
      //loop through each button
      Object.keys(this.props.buttons).forEach((key) => {
        //create a new button object
        let btnObj = {
          name: key,
          bounds: this.props.buttons[key].getBoundingClientRect(),
        };
        //add the button object to the array
        this.btnCoords.push(btnObj);
      });
    }
    //if cursor position has changed
    if (
      this.state.cursorX !== prevState.cursorX ||
      this.state.cursorY !== prevState.cursorY
    ) {
      //if this is in attract mode
      if (this.props.buttons.hasOwnProperty("attractBtn")) {
        if (this._isMounted) {
          const attractBtn = this.props.buttons["attractBtn"];
          attractBtn.click();
          this.setState({ lastSelected: new Date() });
        }
      } else {
        //lowest distance
        let lowest;
        //closest button
        let closest;
        //if attract is shown
        //loop through each button
        this.btnCoords.forEach((button) => {
          //distance between button left and cursor
          let distance = Math.abs(
            button.bounds.x + button.bounds.width / 2 - this.state.cursorX
          );
          //add the vertical distance
          distance += Math.abs(
            button.bounds.y + button.bounds.height / 2 - this.state.cursorY
          );
          //if closer than closest or no lowest yet
          if (!lowest || distance < lowest) {
            //update lowest
            lowest = distance;
            closest = button;
          }
        });
        //if nothing within threshold distance
        if (lowest > 200 && this._isMounted) {
          clearTimeout(this.state.selectionTimeout);
          this.setState({
            selected: null,
          });
        }
        //if selected has changed
        else if (
          this.state.selected !== this.props.buttons[closest.name] &&
          closest
        ) {
          clearTimeout(this.state.selectionTimeout);
          if (this._isMounted) {
            this.setState({
              selectedBounds: closest.bounds,
              selected: this.props.buttons[closest.name],
              selectionTimeout: setTimeout(() => {
                //click the button
                this.state.selected.click();
                this.setState({ selected: null });
              }, this.props.triggerTime),
              lastSelected: new Date(),
            });
          }
        }
      }
    }
  }
  render() {
    const progress =
      (new Date() - this.state.lastSelected) / this.props.triggerTime;
    return (
      <div className="stickyBtns">
        {this.state.cursorShown && (
          <MdLocate
            className="cursor"
            style={{
              left: `${this.state.cursorX}px`,
              top: `${this.state.cursorY}px`,
            }}
            color="green"
          />
        )}

        {
          //if there is a currently selected button
          this.state.selected && (
            <div
              className="selector"
              style={{
                left: `${
                  this.state.selectedBounds.x +
                  this.state.selectedBounds.width / 2
                }px`,
                top: `${
                  this.state.selectedBounds.y +
                  this.state.selectedBounds.height / 2
                }px`,
              }}
            >
              <IosHandOutline style={{ position: "absolute" }} />
              <CircularProgressbar
                minValue={0}
                maxValue={0.75}
                strokeWidth={20}
                value={progress}
              />
            </div>
          )
        }
      </div>
    );
  }
}

StickyBtns.propTypes = {
  buttons: propTypes.object.isRequired,
  orientation: propTypes.number.isRequired,
  triggerTime: propTypes.number.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  return {
    buttons: state.buttons || {},
    orientation: ownProps.orientation || 1, //1=Up 2=Out
    triggerTime: ownProps.triggerTime || 2000, //hover time required before click in ms
  };
};

export default connect(mapStateToProps, {
  addButtons,
  removeButtons,
})(StickyBtns);
