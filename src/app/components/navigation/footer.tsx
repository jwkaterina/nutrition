import styles from "./nav-bar.module.css"
import { useRouter } from 'next/navigation'
import { useContext } from "react";
import { AuthContext } from "@/app/context/auth-context";
import { SlideContext } from "@/app/context/slide-context";
import { CardState } from "@/app/types/types";
import { CardOpenContext } from "@/app/context/card-context";
import { CurrentRecipeContext } from "@/app/context/recipe-context";
import { CurrentMenuContext } from "@/app/context/menu-context";
import { CurrentFoodContext } from "@/app/context/food-context";

interface FooterProps {
    color: string,
}

const Footer = ({ color }: FooterProps): JSX.Element => {

    const router = useRouter();
    const { isLoggedIn } = useContext(AuthContext);
    const { setCurrentFood } = useContext(CurrentFoodContext);
    const { setCardOpen } = useContext(CardOpenContext);
    const { setScrollBehavior } = useContext(SlideContext);
    const { setCurrentRecipe } = useContext(CurrentRecipeContext);
    const { setCurrentMenu } = useContext(CurrentMenuContext);

    const handleAuthClick = () => {
        if (isLoggedIn) {
            // logout
        } else {
            router.push('/auth')
        }
    }

    const handleHomeClick = () => {
        setCardOpen(CardState.CLOSED);
        setCurrentFood({food: null, id: null});
        setCurrentRecipe({id: null, recipe: null});
		setCurrentMenu({id: null, menu: null});
        setScrollBehavior('auto');
        router.push('/');
        setTimeout(() => {
            setScrollBehavior('smooth');
        }, 500);
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