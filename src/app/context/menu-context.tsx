import { createContext, useState, useMemo } from 'react';
import { MenuProp, AnalysisMode } from '@/app/types/types';

export interface CurrentMenu  {
    menu: MenuProp | null,
    id: string | null,
    mode: AnalysisMode
}

interface CurrentMenuContextProps {
    currentMenu: CurrentMenu,
    setCurrentMenu: React.SetStateAction<any>
}

export const CurrentMenuContext = createContext<CurrentMenuContextProps>({
    currentMenu: {
        menu: null,
        id: null,
        mode: AnalysisMode.VIEW
    },
    setCurrentMenu: () => {}
});

export const CurrentMenuProvider = ({ children }: any) => {
    const [currentMenu, setCurrentMenu] = useState<CurrentMenu>({
        menu: null,
        id: null,
        mode: AnalysisMode.VIEW
    });

    const contextValue = useMemo(() => ({
        currentMenu,
        setCurrentMenu
    }), [currentMenu, setCurrentMenu]);

  return (
    <CurrentMenuContext.Provider value={contextValue}>
        {children}
    </CurrentMenuContext.Provider>
  );
}