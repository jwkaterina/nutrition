'use client'

import styles from './nav-bar.module.css'
import { useContext } from "react"
import { SetCardOpenContext } from "@/app/context/card-context"

interface OpenCardMenuProps {
    cardOpen: number | null,
}

const AnalysisMenu = ({ cardOpen }: OpenCardMenuProps): JSX.Element => {

    const setCardOpen = useContext(SetCardOpenContext);

    const addToFavorites = (index: number | null): void => {
        //TODO: add to favorites
    }

    return <>
        <div className={styles.links}>
            <a className={styles.link} onClick={() => setCardOpen(0)}>Back</a>
            <a className={styles.link} onClick={() => addToFavorites(cardOpen)} >Add To Favorites</a>
        </div>
    </>
}

export default AnalysisMenu