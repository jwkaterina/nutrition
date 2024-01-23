import { createContext, useState, useMemo } from 'react';
import { MenuProp } from '@/app/types/types';

interface CurrentMenu  {
    menu: MenuProp | null,
    id: string | null
}

interface CurrentMenuContextProps {
    currentMenu: CurrentMenu,
    setCurrentMenu: React.SetStateAction<any>
}

export const CurrentMenuContext = createContext<CurrentMenuContextProps>({
    currentMenu: {
        menu: null,
        id: null
    },
    setCurrentMenu: () => {}
});

export const CurrentMenuProvider = ({ children }: any) => {
    const [currentMenu, setCurrentMenu] = useState<CurrentMenu>({
        menu: null,
        id: null
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