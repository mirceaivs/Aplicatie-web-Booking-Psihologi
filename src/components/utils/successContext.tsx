import React, { useState } from 'react';



export const SuccessContext = React.createContext({
    success: false,
    setSuccess: (success: boolean) => { }
});

export const SuccessContextProvider = (props: any) => {
    const [success, setSuccess] = useState(false);

    const contextValue = {
        success,
        setSuccess,
    };

    return (
        <SuccessContext.Provider value={contextValue}>
            {props.children}
        </SuccessContext.Provider>
    );
};
