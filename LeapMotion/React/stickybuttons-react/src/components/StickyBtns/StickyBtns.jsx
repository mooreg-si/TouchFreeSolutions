import React, { Component } from "react";
import propTypes from "prop-types";
import { connect } from "react-redux";
import { addButtons, removeButtons } from "../../actions/btnActions";
import Leap from "leapjs";
import "leapjs-plugins";
import "./stickyBtns.scss";
import debounce from "debounce";
import { jsonEqual } from "../../actions/utilActions";
import MdLocate from "react-ionicons/lib/MdLocate";
import styled from "styled-components";

/*
 * Add this component in your primary app container
 * Accepts optional orientation(1=up 2=outward) and triggerTime(ms) props
 */

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
      hoverTimeout: null,
      selectorTimeout: null,
      cursorShown: false,
      selectorShown: true,
    };
    this.Selector = this.getSelector();
  }

  componentDidMount() {
    this._isMounted = true;
    Leap.loop({
      hand: (hand) => {
        debounce(
          this.setState({
            //set the cursor position
            cursorX: this.getAverage(hand.screenPosition()[0], "X"),
            cursorY: this.getAverage(
              hand.screenPosition()[this.props.orientation] +
                window.innerHeight, //automatically adjust to screen size
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
          clearTimeout(this.state.hoverTimeout);
          //hide the cursor
          this.setState({ cursorShown: false, selected: null });
        }
      },
    }).use("screenPosition");
  }

  /*
   * Get the styled selector component
   * Doing it this way so the animation time can be set dynamically
   * :before and :after couldn't be set as inline style
   */
  getSelector() {
    //get timeout in seconds from milliseconds
    const timeoutSecs = this.props.triggerTime / 1000;
    const Selector = styled.div`
      .selector {
        .indicator {
          &:before {
            animation: pulse1 ${timeoutSecs}s ease-in-out;
          }
          &:after {
            animation: pulse2 ${timeoutSecs}s ease-in-out;
          }
        }
      }
      @keyframes pulse1 {
        50% {
          opacity: 1;
        }
        100% {
          opacity: 0;
        }
      }

      @keyframes pulse2 {
        0% {
          transform: translate(-50%, -50%) scale(1);
          opacity: 0;
        }
        75% {
          opacity: 1;
        }
        100% {
          transform: translate(-50%, -50%) scale(0);
          opacity: 1;
        }
      }
    `;
    return Selector;
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
    clearTimeout(this.state.hoverTimeout);
    clearTimeout(this.state.selectorTimeout);
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
        if (lowest > this.props.selectRadius && this._isMounted) {
          //stop the timeout
          clearTimeout(this.state.hoverTimeout);
          //nothing selected
          this.setState({
            selected: null,
          });
        }
        //if selected has changed
        else if (
          this.state.selected !== this.props.buttons[closest.name] &&
          closest
        ) {
          //clear any running timeout
          clearTimeout(this.state.hoverTimeout);
          clearTimeout(this.state.selectorTimeout);
          if (this._isMounted) {
            this.setState({
              selectedBounds: closest.bounds,
              selected: this.props.buttons[closest.name],
              //start a new timeout to click
              hoverTimeout: setTimeout(() => {
                //click the button
                this.state.selected.click();
                this.setState({ selected: null });
              }, this.props.triggerTime),
              lastSelected: new Date(), //store the time the selection last changed
              selectorShown: false, //hide the selector to force redraw and animation restart
              //reshow the selector after timeout
              selectorTimeout: setTimeout(
                () => this.setState({ selectorShown: true }),
                10
              ),
            });
          }
        }
      }
    }
  }

  render() {
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
          //if there is a currently selected button and the selector is shown
          this.state.selected && this.state.selectorShown && (
            <this.Selector>
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
                <div className="indicator" />
              </div>
            </this.Selector>
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
  selectRadius: propTypes.number.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  return {
    buttons: state.buttons || {},
    orientation: ownProps.orientation || 1, //1=Up 2=Out
    triggerTime: ownProps.triggerTime || 2000, //hover time required before click in milliseconds
    selectRadius: ownProps.selectRadius || 200, //distance cursor needs to be from button center to select. Pixels
  };
};

export default connect(mapStateToProps, {
  addButtons,
  removeButtons,
})(StickyBtns);
