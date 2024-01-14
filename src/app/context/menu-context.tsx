// import { createContext, useReducer, useContext} from 'react';
// import { MenuProp } from '@/app/types/types';
// import MenuList from '@/app/data-base/menu-list';
// import { MenuReducer } from './menu-reducer';
// import { getItemFromLocalStorage, setToLocalStorage } from '../services/local-storage';

// let initialMenu: MenuProp[];
// const item = getItemFromLocalStorage('menus');
// if(item) {
//   initialMenu = item;
// } else {
//     initialMenu = MenuList;
//     setToLocalStorage('menus', initialMenu);
// }

// const MenuContext = createContext<MenuProp[]>(initialMenu);

// const MenuDispatchContext = createContext((() => {}) as React.Dispatch<any>);

// export const MenuProvider = ({ children }: any) => {
//   const [menu, dispatch] = useReducer(MenuReducer, initialMenu);

//   return (
//     <MenuContext.Provider value={menu}>
//       <MenuDispatchContext.Provider value={dispatch}>
//         {children}
//       </MenuDispatchContext.Provider>
//     </MenuContext.Provider>
//   );
// }

// export const useMenu = () => {
//   return useContext(MenuContext);
// }
  
// export const  useMenuDispatch = () => {
//   return useContext(MenuDispatchContext);
// }