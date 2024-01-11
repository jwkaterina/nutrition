import { createContext, useState } from "react";
import { SlideType } from '@/app/types/types';

type ScrollBehavior = 'auto' | 'smooth';

export const SlideContext = createContext<SlideType>(SlideType.FOOD);
export const SetSlideContext = createContext((() => {}) as React.SetStateAction<any>);
export const BlockScrollContext = createContext<boolean>(false);
export const SetBlockScrollContext = createContext((() => {}) as React.SetStateAction<any>);
export const ScrollBehaviorContext = createContext<ScrollBehavior | undefined>('smooth');
export const SetScrollBehaviorContext = createContext((() => {}) as React.SetStateAction<any>);

export const SlideProvider = ({ children }: any) => {

    const [slide, setSlide] = useState(SlideType.FOOD);
    const [blockScroll, setBlockScroll] = useState(false);
    const [scrollBehavior, setScrollBehavior] = useState<ScrollBehavior>('smooth');

    return (
        <SlideContext.Provider value={slide}>
            <SetSlideContext.Provider value={setSlide}>
                <BlockScrollContext.Provider value={blockScroll}>
                    <SetBlockScrollContext.Provider value={setBlockScroll}>
                        <ScrollBehaviorContext.Provider value={scrollBehavior}>
                            <SetScrollBehaviorContext.Provider value={setScrollBehavior}>
                                {children}
                            </SetScrollBehaviorContext.Provider>
                        </ScrollBehaviorContext.Provider>
                    </SetBlockScrollContext.Provider>
                </BlockScrollContext.Provider>
            </SetSlideContext.Provider>
        </SlideContext.Provider>
    )
}

