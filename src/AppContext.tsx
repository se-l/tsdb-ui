import React from "react";
import { AppContextDiscover } from "./components/discover/AppContext";

interface IAppContextApp {
    apiUrl: string;
    layoutDrawerOpen: boolean;
    setLayoutDrawerOpen: any;
}

const AppContextApp: IAppContextApp = {
    apiUrl: "",
    layoutDrawerOpen: true,
    setLayoutDrawerOpen: null
}

export const AppContext = React.createContext({
    ...AppContextApp,
    ...AppContextDiscover,
})
