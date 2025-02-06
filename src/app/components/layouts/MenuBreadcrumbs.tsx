/* eslint-disable @typescript-eslint/no-explicit-any */

import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import HomeIcon from '@mui/icons-material/Home';

export default function MenuBreadcrumbs({ url, menu }: any) {
  return (
    <div className='breadcrumbs_wrap'>
      <Breadcrumbs className='breadcrumbs' separator="›" aria-label="breadcrumb" sx={{ color: 'white' }}>
        <Link underline="hover" sx={{ display: 'flex', alignItems: 'center' }} color="inherit" href="/">
          <HomeIcon fontSize="inherit" />
        </Link>
        <Link underline="hover" sx={{ display: 'flex', alignItems: 'center' }} color="inherit" href={url}>
          {menu}
        </Link>
      </Breadcrumbs>
    </div>
  );
}