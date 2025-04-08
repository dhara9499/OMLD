import React, {
    createContext,
    useContext,
    useState,
    ReactNode,
    Dispatch,
    SetStateAction,
} from "react";
// import { jwtDecode } from "jwt-decode";

interface StateContextType {
    user: any; // Define user property
    token: string | null;
    notification: string | null;
    setUser: Dispatch<SetStateAction<any>>;
    setToken: (token: string | null) => void;
    setNotification: (message: string | null) => void;
}

const initialState: StateContextType = {
    user: null, // Initialize user property
    token: null,
    notification: null,
    setUser: () => {},
    setToken: () => {},
    setNotification: () => {},
};

const StateContext = createContext<StateContextType>(initialState);

export const ContextProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const getTokenFromLocalStorage = (): string | null => {
        const tokenData = localStorage.getItem("ACCESS_TOKEN");
        if (tokenData) {
            const { token, expiry } = JSON.parse(tokenData);
            console.log(new Date().getTime());
            console.log(expiry);
            console.log(new Date().getTime() < expiry);
            if (new Date().getTime() < expiry) {
                console.log("---------41----------");
                return token; // Return valid token
            } else {
                localStorage.removeItem("ACCESS_TOKEN"); // Remove expired token
            }
        }
        return null;
    };

    const [user, setUser] = useState<any>({});
    const [token, setTokenState] = useState<string | null>(
        getTokenFromLocalStorage()
    );
    const [notification, setNotificationState] = useState<string | null>("");

    // console.log(isTokenExpired(token));

    // if (token && isTokenExpired(token)) {
    //   localStorage.removeItem('authToken');
    //   console.log('Token expired, cleared session');
    // }

    const setToken = (token: string | null) => {
        setTokenState(token);

        if (token) {
            const expiryTime = new Date().getTime() + 60 * 60 * 1000 * 24; // 1 hour expiry
            const tokenData = JSON.stringify({ token, expiry: expiryTime });
            localStorage.setItem("ACCESS_TOKEN", tokenData);
            console.log(localStorage.getItem("ACCESS_TOKEN"));
            setTokenState(token);
        } else {
            localStorage.removeItem("ACCESS_TOKEN");
            setTokenState(null);
        }
    };

    const setNotification = (message: string | null) => {
        setNotificationState(message);

        setTimeout(() => {
            setNotificationState(null);
        }, 5000);
    };

    return (
        <StateContext.Provider
            value={{
                user, // Use user state variable here
                setUser, // Set user state function
                token,
                setToken,
                notification,
                setNotification,
            }}
        >
            {children}
        </StateContext.Provider>
    );
};

export const useStateContext = () => useContext(StateContext);
