import {ADD_ITEMS} from "../actions";

const initialState = {
    items: [],
};

export default function addItems (state=initialState, action){
    switch (action.type) {
        case ADD_ITEMS:
            return {
                items: action.items
            };
        default:
            return state;
    }

}
