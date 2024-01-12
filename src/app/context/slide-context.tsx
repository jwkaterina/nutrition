import { createContext, useState } from "react";
import { SlideType } from '@/app/types/types';

type ScrollBehavior = 'auto' | 'smooth';

interface SlideContextProps {
    slide: SlideType,
    setSlide: React.Dispatch<React.SetStateAction<SlideType>>,
    blockScroll: boolean,
    setBlockScroll: React.Dispatch<React.SetStateAction<boolean>>,
    scrollBehavior: ScrollBehavior,
    setScrollBehavior: React.Dispatch<React.SetStateAction<ScrollBehavior>>
}

export const SlideContext = createContext<SlideContextProps>({
    slide: SlideType.FOOD,
    setSlide: () => {},
    blockScroll: false,
    setBlockScroll: () => {},
    scrollBehavior: 'smooth',
    setScrollBehavior: () => {}
});

export const SlideProvider = ({ children }: any) => {

    const [slide, setSlide] = useState<SlideType>(SlideType.FOOD);
    const [blockScroll, setBlockScroll] = useState<boolean>(false);
    const [scrollBehavior, setScrollBehavior] = useState<ScrollBehavior>('smooth');

    return (
        <SlideContext.Provider value={{
            slide,
            setSlide,
            blockScroll,
            setBlockScroll,
            scrollBehavior,
            setScrollBehavior
        }}>
            {children}
        </SlideContext.Provider>
    )
}

