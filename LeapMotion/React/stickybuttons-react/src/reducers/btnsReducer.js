import {
    ADD_BUTTONS,
    REMOVE_BUTTONS
} from "../actions/types";

export default function (state = {}, action) {
    switch (action.type) {
        case ADD_BUTTONS:
            return {
                ...state,
                ...action.payload//add payload to state
            };
        case REMOVE_BUTTONS:
            //loop through each key in payload
            action.payload.forEach(key => {
                //remove key from state
                delete state[key];
            })
            return {
                ...state
            };
        default:
            return state;
    }
}