import { createContext, useState } from "react";
import { SlideType } from '@/app/types/types';

export const SlideContext = createContext<SlideType>(SlideType.FOOD);
export const SetSlideContext = createContext((() => {}) as React.SetStateAction<any>);
export const BlockScrollContext = createContext<boolean>(false);
export const SetBlockScrollContext = createContext((() => {}) as React.SetStateAction<any>);

export const SlideProvider = ({ children }: any) => {

    const [slide, setSlide] = useState(SlideType.FOOD);
    const [blockScroll, setBlockScroll] = useState(false);

    return (
        <SlideContext.Provider value={slide}>
            <SetSlideContext.Provider value={setSlide}>
                <BlockScrollContext.Provider value={blockScroll}>
                    <SetBlockScrollContext.Provider value={setBlockScroll}>
                        {children}
                    </SetBlockScrollContext.Provider>
                </BlockScrollContext.Provider>
            </SetSlideContext.Provider>
        </SlideContext.Provider>
    )
}

