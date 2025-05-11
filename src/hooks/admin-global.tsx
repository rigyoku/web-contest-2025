import { createContext, ReactNode, useContext, Dispatch, useState, SetStateAction } from "react";

type Global = {
    loading: boolean,
    user: {
        id: number,
        username: string,
        mail: string,
        roles: number[],
    },
}

const initGlobalContext: {
    adminGlobal: Global,
    setGlobal: Dispatch<SetStateAction<Global>>,
} = {
    adminGlobal: {
        loading: false,
        user: {
            id: 0,
            username: '',
            mail: '',
            roles: [],
        },
    },
    setGlobal: () => { },
}

const GlobalContext = createContext(initGlobalContext);

export const useAdminGlobal = () => useContext(GlobalContext);

// 管理端全局变量
export const GlobalProvider = ({ children }: { children: ReactNode }) => {
    const [adminGlobal, setGlobal] = useState(initGlobalContext.adminGlobal);
    return (
        <GlobalContext.Provider value={{ adminGlobal, setGlobal }}>
            {children}
        </GlobalContext.Provider>
    )
}