import axios from "axios";
import { createContext, useContext, useEffect, useReducer } from "react";
/**
 * @typedef TAuthContext
 * @property {boolean} isLoggedIn
 * @property {{id:number,username:string}|null} user
 * @property {()=>void} logoutUser
 * @property {(id:number|string)=>Promise<any[]>} loginUser
 */

const reducer = (state, action) => {
    switch (action.type) {
        case "LOG_IN":
            localStorage.setItem("user", JSON.stringify(action.payload));
            return { ...state, isLoggedIn: true, user: action.payload };
        case "LOG_OUT":
            localStorage.setItem("user", null);
            return { ...state, isLoggedIn: false, user: null };
        default:
            return state;
    }
};
/**
 * @type {React.Context<TAuthContext>}
 */
export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
    const [state, dispatch] = useReducer(reducer, {
        isLoggedIn: false,
        user: null,
    });

    useEffect(() => {
        const user = localStorage.getItem("user");

        if (!!JSON.parse(user)) {
            dispatch({
                type: "LOG_IN",
                payload: JSON.parse(user),
            });
        }
    }, [state.isLoggedIn]);

    async function loginUser(id) {
        return axios(`https://jsonplaceholder.typicode.com/users/${id}`)
            .then((res) => {
                dispatch({
                    type: "LOG_IN",
                    payload: {
                        id: res.data.id,
                        username: res.data.username,
                    },
                });
                return [res.data, null];
            })
            .catch((err) => {
                //Handle Error
                return [null, err];
            });
    }
    function logoutUser() {
        dispatch({ type: "LOG_OUT" });
    }
    return (
        <AuthContext.Provider
            value={{
                user: state.user,
                isLoggedIn: state.isLoggedIn,
                loginUser,
                logoutUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
