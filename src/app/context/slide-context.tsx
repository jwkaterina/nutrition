'use client';
import { createContext, useState, useMemo } from "react";
import { SlideType } from '@/app/types/types';

type ScrollBehavior = 'auto' | 'smooth';

interface SlideContextProps {
    slide: SlideType,
    setSlide: React.Dispatch<React.SetStateAction<SlideType>>,
    blockScroll: boolean,
    setBlockScroll: React.Dispatch<React.SetStateAction<boolean>>,
    scrollBehavior: ScrollBehavior,
    setScrollBehavior: React.Dispatch<React.SetStateAction<ScrollBehavior>>,
    scrollRatio: number,
    setScrollRatio: React.Dispatch<React.SetStateAction<number>>
}

export const SlideContext = createContext<SlideContextProps>({
    slide: SlideType.FOOD,
    setSlide: () => {},
    blockScroll: false,
    setBlockScroll: () => {},
    scrollBehavior: 'smooth',
    setScrollBehavior: () => {},
    scrollRatio: 0,
    setScrollRatio: () => {}
});

export const SlideProvider = ({ children }: any) => {

    const [slide, setSlide] = useState<SlideType>(SlideType.FOOD);
    const [blockScroll, setBlockScroll] = useState<boolean>(false);
    const [scrollBehavior, setScrollBehavior] = useState<ScrollBehavior>('smooth');
    const [scrollRatio, setScrollRatio] = useState<number>(0);

    const contextValue = useMemo(() => ({
        slide,
        setSlide,
        blockScroll,
        setBlockScroll,
        scrollBehavior,
        setScrollBehavior,
        scrollRatio,
        setScrollRatio
    }), [slide, setSlide, blockScroll, setBlockScroll, scrollBehavior, setScrollBehavior, scrollRatio, setScrollRatio]);

    return (
        <SlideContext.Provider value={contextValue}>
            {children}
        </SlideContext.Provider>
    );
}

