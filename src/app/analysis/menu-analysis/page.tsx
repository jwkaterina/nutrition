'use client'

import NavBar from '@/app/components/navigation/nav-bar';
import AnalysisMenu from '@/app/components/navigation/menus/analysis-menu';

const MenuSearch = (): JSX.Element => {

  const secondaryColor: string = "var(--secondary-color)";

  return (<>
    <NavBar color={secondaryColor}>
        <AnalysisMenu title="Menu"/>
    </NavBar>
      <h1>Menu Search</h1>
  </>
  )
}

export default MenuSearch
