import { createContext, useReducer } from 'react';

// reducer imports
import UserReducer from '../reducers/UserReducer';

// import initial states
import initUserState from '../initStates/UserState';

// context creation and export
export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
    // member reducer
    const [userState, dispatchUser] = useReducer(UserReducer, initUserState);

    return (
        <AppContext.Provider
            value={{
                userState,
                dispatchUser
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;
