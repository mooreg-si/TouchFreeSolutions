# Touch Free Solutions
## A library of touch-free solutions to replace touch in museums

This is a work-in-progress repo to host multiple solutions to replace touch interaction in museums. 

## Leap Motion
### React "Sticky Buttons" component
An example project to use a Leap Motion gesture control device to control interactive touchscreens developed in React and using Redux for state management. Uses the [LeapJS Framework](https://github.com/leapmotion/leapjs). Move a hand over the device to move a cursor. Closest button to the cursor will be selected. If the same button remains selected for a set period the button will be clicked. The StickyButtons component is added at a top level of the hierarchy. In sub-components, refs to clickable items are added to the redux state by an addButtons action. The StickyButtons component pulls the buttons from the redux state. 
### Standalone HTML Module
This is intended for use on HTML5 interactives where the existing programming cannot be modified. This only requires copying one file into the same folder as the root html file and copying and pasting two lines into that root html. Does not require installation of any additional software. As with the Sticky Buttons component, wave a hand over the device to move a cursor, hover in one place and it clicks. Since this has no way to tell where buttons are, this just clicks whatever is currently under the cursor. Hovering within a set distance for a set time will trigger a click.  
