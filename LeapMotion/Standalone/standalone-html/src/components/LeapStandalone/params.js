/* Parameters to adjust performance */

const params = {
    /* 
    * Orientation of the Leap Motion device 
    * 1 = Up
    * 2 = Out
    * default=1
    */
    orientation: 1,
    /*
    *  How long a user needs to hover to click in milliseconds
    *  default 2000
    */
    hoverTime: 2000,
    /* 
    * Size of the radius a user needs to keep the cursor within to be considered hovering
    * default 100 pixels
    */
    hoverRange: 100,
    /* Cursor color */
    cursorColor:'green'
}

export default params;