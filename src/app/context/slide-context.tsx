import { createContext, useState } from "react";
import { SlideType } from '@/app/types/types';

export const SlideContext = createContext<SlideType>(SlideType.FOOD);
export const SetslideContext = createContext((() => {}) as React.SetStateAction<any>);
export const BlockScrollContext = createContext<boolean>(false);
export const SetblockScrollContext = createContext((() => {}) as React.SetStateAction<any>);

export const SlideProvider = ({ children }: any) => {

    const [slide, setslide] = useState(SlideType.FOOD);
    const [blockScroll, setblockScroll] = useState(false);

    return (
        <SlideContext.Provider value={slide}>
            <SetslideContext.Provider value={setslide}>
                <BlockScrollContext.Provider value={blockScroll}>
                    <SetblockScrollContext.Provider value={setblockScroll}>
                        {children}
                    </SetblockScrollContext.Provider>
                </BlockScrollContext.Provider>
            </SetslideContext.Provider>
        </SlideContext.Provider>
    )
}

