This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

# Running the Demo
## Install Node and NPM
Node can be downloaded from [Node's Website](https://nodejs.org/en/download/) They have pre-built installers for multiple platforms. Pick the best for your system. Once installed, make sure npm is in your path by running `npm -v` to check the node version. 
## Install Dependencies
In command prompt or terminal, cd to the stickybuttons-react folder. In this folder, run `npm i` to install the dependencies.
## Run the Demo
In the same folder, run `npm start`. This will start the node development server and launch the demo app in your default browser. 

# Using the StickyBtns Component
Since interactive programming will vary widely, I can only provide general guidelines. 
- Copy the actions, reducers, and the StickyBtns component folder to your project. Where you put them and how they are incorporated into your app will depend on your file structure and programming.
- Put the StickyBtns component at the same level as the component you want to control. Your redux provider should enclose both. For example
    ~~~~
    <Provider store={store}>
        <div className="app">
          <StickyBtns orientation={1} triggerTime={2000}/>
          <Demo />
        </div>
    </Provider>
    ~~~~
- In each component with buttons you want to be clickable.
    - import the addButtons and removeButtons actions. Add them to the redux connect function
        ~~~~
        import {addButtons, removeButtons} from '../../actions/btnActions`
        --------
        export default connect(null, { addButtons, removeButtons })(Demo);
        ~~~~
    
    - Create a ref for each button that you want to be clickable
    - In the `componentDidMount` lifecycle method, call the `addButtons` action. The function takes an object where each button has a unique name as the key and the current element as the value.
        ~~~~
        this.props.addButtons({ ref1: this.ref1.current, ref2: this.ref2.current });
        ~~~~
        In components with a large number of buttons, these can be defined in an object in the constructor
        ~~~~
        constructor(props) {
            super(props);
            this.clickables={
                ref1:React.createRef(),
                ref2:React.createRef()
            }
        }
        --------
        this.props.addButtons(this.clickables);

        ~~~~
    - In the `componentWillUnmount` lifecycle method, call the `removeButtons` action. The function takes an array with each button name to be removed.
        ~~~~
        this.props.removeButtons(["ref1", "ref2"]);
        ~~~~
        If clickables are defined as an object, you can remove them by removing the object keys
        ~~~~
        this.props.removeButtons(Object.keys(this.clickables));
        ~~~~
## Component Props
The StickBtns component accepts two props. 
- `triggerTime` The time in milliseconds a button needs to remain selected before being clicked. Defaults to 2000 milliseconds (2 seconds).
- `orientation` If the Leap Motion is facing upward or outward, towards the user. 1=Up, 2=Out. Defaults to 1 Up. 


## Known Issues
Right now, this is only working with the older V2 Leap Motion software. It does not work with the V4 Orion Beta.

# Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `npm run build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
