# Standalone HTML Module
This is intended for use on HTML5 interactives where the existing programming cannot be modified. This only requires copying one file into the same folder as the root html file and copying and pasting two lines into that root html. Does not require installation of any additional software. As with the Sticky Buttons component, wave a hand over the device to move a cursor, hover in one place and it clicks. Since this has no way to tell where buttons are, this just clicks whatever is currently under the cursor. Hovering within a set distance for a set time will trigger a click.  

## Running the Demo
Open the `demo.html` file from the `distStandalone` folder in a browser. 

## Using the module
- Make a copy of the folder containing the interactive programming in another location just in case.
- Copy the `standalone.js` file from the `distStandalone` folder to the same folder as the interactive's root html file (likely `index.html`).
- In the root html file,
    - Insert this div at the top of the html body, just after the `<body>` tag, before any other html content. This is where the module will be added
        ~~~~
        <div id="standaloneTarget"></div>
        ~~~~
    - Insert this script tag just before the html `</body>` closing tag. This should be the last thing in the body This will add the `standalone.js` file, which includes everything required.
        ~~~~
        <script src="standalone.js"></script>
        ~~~~
- Save the html file and refresh the interactive browser.
## Optional Parameters
The module accepts four optional parameters 
- `hoverTime` The time in milliseconds the user needs to hover before a click is triggered. Defaults to 2000 milliseconds (2 seconds).
- `orientation` If the Leap Motion is facing upward or outward, towards the user. 1=Up, 2=Out. Defaults to 1 Up. 
- `hoverRange` The distance in pixels the cursor must stay within to be considered hovering. Defaults to 100 pixels.
- `cursorColor` The color of the cursor. Accepts standard css color names(`'green'`)or hex color strings(`'#00FF00'`). Default `'green'`.

To change the parameters
- Edit the values in `src/components/LeapStandalone/params.js`
- If node and npm are not already installed, download and install the appropriate NodeJS package from the [NodeJS Website](https://nodejs.org/en/download/)
- In a command prompt or terminal, cd to the `standalone-html` folder
- Run `npm i` to install dependencies
- Run `npm run build` to rebuild the module with the new values
- Copy the newly compiled `standalone.js` file from the `distStandalone` folder to the same folder as the interactive root html file.


## Known Issues
- Right now, this is only working with the older V2 Leap Motion software. It does not work with the V4 Orion Beta.
- This only works to click on elements with `mousedown` or `onclick` event listeners. 
- This will not work to click and drag or scroll. Without using two hands or gestures that would not work for accesibility, there is no good way to implement a click and drag
- This is harder to use accurately than the Sticky Buttons solution. Since it doesn't know where buttons are, it relies on the user to hold the cursor within a smaller area. It will click at the average position of the last two seconds. This must be over a button to click it. Obviously, smaller buttons are much harder to hit than large ones.

