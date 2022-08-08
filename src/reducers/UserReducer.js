const UserReducer = (state, action) => {
    switch (action.type) {
        case 'SIGNUP':
        case 'LOGIN':
        case 'FETCH':
            return {
                ...state,
                user: action.payload.user,
                isAuth: true
            };

        case 'LOGOUT':
            return {
                ...state,
                user: null,
                isAuth: false
            };

        default:
            return state;
    }
};

export default UserReducer;
