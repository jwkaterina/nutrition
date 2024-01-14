import Slide from './slide'
import Button from '@/app/components/slider/button'

interface MenuSlideProps {
    menuDeleted: boolean
}

const MenuSlide = ({ menuDeleted }: MenuSlideProps): JSX.Element => {

    return (
        <Slide>
            {/* {menuList} */}
            <Button search={'analysis/menu-analysis'}/>
        </Slide>    
    )
}

export default MenuSlide