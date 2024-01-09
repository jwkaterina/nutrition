'use client'

import NavBar from '@/app/components/navigation/nav-bar';
import AnalysisMenu from '@/app/components/navigation/menus/analysis-menu';

const MenuSearch = (): JSX.Element => {

  return (<>
    <NavBar color={'var(--secondary-color)'}>
        <AnalysisMenu title="Menu"/>
    </NavBar>
      <h1>Menu Search</h1>
  </>
  )
}

export default MenuSearch
