import { createContext, useContext } from "react";

interface SidebarContextType {
    collapsed: boolean;
    setCollapsed: (collapsed: boolean) => void;
    toggle: () => void;
}

export const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const useSidebarContext = () => {
    const context = useContext(SidebarContext);
    if (!context) {
        throw new Error("useSidebarContext must be used within a SidebarProvider");
    }
    return context;
};
