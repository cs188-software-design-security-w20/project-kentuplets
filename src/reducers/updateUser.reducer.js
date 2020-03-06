import {UPDATE_USERNAME} from '../actions';

export const initialState = {
    username: '',
};

export default function updateUsername (state = initialState, action) {
    switch (action.type) {
        case UPDATE_USERNAME:
            return {
                username: action.username
            };
        default:
            return state;
    }
};
