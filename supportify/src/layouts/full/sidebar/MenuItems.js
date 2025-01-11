import {
  IconSettings,
  IconHome,
  IconMessages,
} from '@tabler/icons-react';

import { uniqueId } from 'lodash';

const Menuitems = [
  {
    navlabel: true,
    subheader: 'Home',
  },

  {
    id: uniqueId(),
    title: 'Home',
    icon: IconHome,
    href: '/dashboard',
  },
  {
    navlabel: true,
    subheader: 'Utilities',
  },
  {
    id: uniqueId(),
    title: 'Messages',
    icon: IconMessages,
    href: '/messages',
  },
  {
    id: uniqueId(),
    title: 'Settings',
    icon: IconSettings,
    href: '/settings',
  },
];

export default Menuitems;
