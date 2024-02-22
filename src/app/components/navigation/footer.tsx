import styles from "./nav-bar.module.css"
import { useRouter, usePathname } from 'next/navigation'
import { useContext } from "react";
import { AuthContext } from "@/app/context/auth-context";
import { SlideContext } from "@/app/context/slide-context";
import { CardState, AnalysisMode } from "@/app/types/types";
import { CardOpenContext } from "@/app/context/card-context";
import { CurrentRecipeContext } from "@/app/context/recipe-context";
import { CurrentMenuContext } from "@/app/context/menu-context";
import { CurrentFoodContext } from "@/app/context/food-context";
import { StatusContext } from "@/app/context/status-context";
import { StatusType } from "@/app/types/types";

interface FooterProps {
    color: string,
    setFile?: (file: any) => void
}

const Footer = ({ color, setFile }: FooterProps): JSX.Element => {

    const router = useRouter();
    const path = usePathname();
    const { isLoggedIn, logout } = useContext(AuthContext);
    const { setCurrentFood } = useContext(CurrentFoodContext);
    const { setCardOpen } = useContext(CardOpenContext);
    const { setScrollBehavior } = useContext(SlideContext);
    const { setCurrentRecipe } = useContext(CurrentRecipeContext);
    const { setCurrentMenu } = useContext(CurrentMenuContext);
    const { setStatus, setMessage } = useContext(StatusContext);

    const handleAuthClick = () => {
        if (isLoggedIn) {
            logout();   
            setStatus(StatusType.SUCCESS);
            setMessage('Logged out');  
        } else {
            setCardOpen(CardState.CLOSED);
            router.push('/auth')
        }
    }

    const handleHomeClick = () => {
        if(path === '/') {
            setCardOpen(CardState.CLOSING);
        } else {
            setCardOpen(CardState.CLOSED);
            setScrollBehavior('auto');
            router.push('/');
            setTimeout(() => {
                setScrollBehavior('smooth');
            }, 500);
        }
        
        setCurrentFood({food: null, id: null});
        setCurrentRecipe({id: null, recipe: null, image: null, mode: AnalysisMode.VIEW});
		setCurrentMenu({id: null, menu: null, mode: AnalysisMode.VIEW});
        setFile && setFile(null);
    }

    return (
        <nav className={styles.footer} style={{background: color}}>
            <div className={styles.footer_links}>
				<a className={styles.link} onClick={handleHomeClick}>Home</a>
				<a className={styles.link} onClick={handleAuthClick}>{isLoggedIn ? 'Logout' : 'Login'}</a>
		    </div>
        </nav>
    )
}

export default Footer