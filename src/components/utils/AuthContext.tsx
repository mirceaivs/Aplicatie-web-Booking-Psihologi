import React, { useState, useEffect } from "react";
import type { User } from "../../models/models";
import axios from 'axios';

export const AuthContext = React.createContext({
    user: null as User | null,
    setUser: (user: User | null) => { },
    isLoggedIn: false,
    setIsLoggedIn: (isLoggedIn: boolean) => { }
});

export const AuthProvider = (props: any) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const checkStatus = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/user/islogged', {
                    withCredentials: true
                });
                setUser(response.data.user);
                setIsLoggedIn(response.data.logged);
            } catch (error) {
                console.log(error);
            }
        };

        checkStatus();
    }, []);

    const value = {
        user,
        setUser,
        isLoggedIn,
        setIsLoggedIn
    }

    return (
        <AuthContext.Provider value={value}>
            {props.children}
        </AuthContext.Provider>
    );
}
