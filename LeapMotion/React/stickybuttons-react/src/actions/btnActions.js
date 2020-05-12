import { ADD_BUTTONS, REMOVE_BUTTONS } from './types';

/* Add buttons to the state */
export const addButtons = buttons => dispatch => {
    dispatch({
        type: ADD_BUTTONS,
        payload: buttons
    })
}

/* Remove buttons from the state */
export const removeButtons = buttons => dispatch => {
    dispatch({
        type: REMOVE_BUTTONS,
        payload: buttons
    })
}