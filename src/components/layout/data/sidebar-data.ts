import {
  IconBriefcase2,
  IconBrowserCheck,
  IconBuildings,
  IconContract,
  IconDeviceImacSearch,
  IconLayoutDashboard,
  IconNotification,
  IconPalette,
  IconSettings,
  IconSocial,
  IconTool,
  IconUserCog,
  IconUsers,
  IconUsersGroup,
  IconCoins,
  IconLanguage,
  IconDatabaseDollar,
  IconHomeBitcoin,
  // IconBasketDollar,
  // IconBarrierBlock,
  // IconBug,
  // IconChecklist,
  // IconError404,
  // IconLock,
  // IconLockAccess,
  // IconMessages,
  // IconPackages,
  // IconServerOff,
  // IconHelp,
  // IconUserOff,
} from '@tabler/icons-react'
import { AudioWaveform, Command, GalleryVerticalEnd } from 'lucide-react'
// import { ClerkLogo } from '@/assets/clerk-logo'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  user: {
    name: 'user',
    email: 'user@gmail.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'Lightman Admin',
      logo: Command,
      plan: 'Vite + ShadcnUI',
    },
    {
      name: 'Acme Inc',
      logo: GalleryVerticalEnd,
      plan: 'Enterprise',
    },
    {
      name: 'Acme Corp.',
      logo: AudioWaveform,
      plan: 'Startup',
    },
  ],
  navGroups: [
    {
      title: 'general',
      items: [
        {
          title: 'dashboard',
          url: '/',
          icon: IconLayoutDashboard,
        },

        {
          title: 'projects',
          icon: IconBriefcase2,
          items: [
            {
              title: 'projects',
              url: '/projects',
            },
            {
              title: 'requested_projects',
              url: '/projects/requested',
            },
          ],
        },
        {
          title: 'network',
          icon: IconSocial,
          items: [
            {
              title: 'types',
              url: '/network/types',
            },
            {
              title: 'categories',
              url: '/network/categories',
            },
            {
              title: 'socials',
              url: '/network/socials',
            },
            {
              title: 'tags',
              url: '/network/tags',
            },
          ],
        },
        {
          title: 'contracts',
          url: '/contracts',
          icon: IconContract,
        },
        // {
        //   title: 'companies',
        //   url: '/companies',
        //   icon: IconBuildings,
        // },
        {
          title: 'companies',
          icon: IconBuildings,
          items: [
            {
              title: 'companies',
              url: '/companies',
            },
            {
              title: 'cards',
              url: '/companies/cards',
            },
          ],
        },
        {
          title: 'expenses',
          url: '/expences',
          icon: IconCoins,
        },
        // {
        //   title: 'deposits',
        //   url: '/deposits',
        //   icon: IconBasketDollar,
        // },
        {
          title: 'loans',
          url: '/loans',
          icon: IconDatabaseDollar,
        },
        {
          title: 'properties',
          url: '/properties',
          icon: IconHomeBitcoin,
        },
        {
          title: 'stakeholders',
          icon: IconUsersGroup,
          items: [
            {
              title: 'founders',
              url: '/stakeholder/founders',
            },
            {
              title: 'distribution',
              url: '/stakeholder/distribution',
            },
          ],
        },
        {
          title: 'users',
          url: '/users',
          icon: IconUsers,
        },

        {
          title: 'user_actions',
          url: '/actions',
          icon: IconDeviceImacSearch,
        },

        // Need to remove
        // {
        //   title: 'Tasks',
        //   url: '/tasks',
        //   icon: IconChecklist,
        // },
        // {
        //   title: 'Apps',
        //   url: '/apps',
        //   icon: IconPackages,
        // },
        // {
        //   title: 'Chats',
        //   url: '/chats',
        //   badge: '3',
        //   icon: IconMessages,
        // },
        // {
        //   title: 'Secured by Clerk',
        //   icon: ClerkLogo,
        //   items: [
        //     {
        //       title: 'Sign In',
        //       url: '/clerk/sign-in',
        //     },
        //     {
        //       title: 'Sign Up',
        //       url: '/clerk/sign-up',
        //     },
        //     {
        //       title: 'User Management',
        //       url: '/clerk/user-management',
        //     },
        //   ],
        // },
      ],
    },
    // {
    //   title: 'Pages',
    //   items: [
    //     {
    //       title: 'Auth',
    //       icon: IconLockAccess,
    //       items: [
    //         {
    //           title: 'Sign In',
    //           url: '/sign-in',
    //         },
    //         {
    //           title: 'Sign In (2 Col)',
    //           url: '/sign-in-2',
    //         },
    //         {
    //           title: 'Sign Up',
    //           url: '/sign-up',
    //         },
    //         {
    //           title: 'Forgot Password',
    //           url: '/forgot-password',
    //         },
    //         {
    //           title: 'OTP',
    //           url: '/otp',
    //         },
    //       ],
    //     },
    //     {
    //       title: 'Errors',
    //       icon: IconBug,
    //       items: [
    //         {
    //           title: 'Unauthorized',
    //           url: '/401',
    //           icon: IconLock,
    //         },
    //         {
    //           title: 'Forbidden',
    //           url: '/403',
    //           icon: IconUserOff,
    //         },
    //         {
    //           title: 'Not Found',
    //           url: '/404',
    //           icon: IconError404,
    //         },
    //         {
    //           title: 'Internal Server Error',
    //           url: '/500',
    //           icon: IconServerOff,
    //         },
    //         {
    //           title: 'Maintenance Error',
    //           url: '/503',
    //           icon: IconBarrierBlock,
    //         },
    //       ],
    //     },
    //   ],
    // },
    {
      title: 'other',
      items: [
        {
          title: 'settings',
          icon: IconSettings,
          items: [
            {
              title: 'profile',
              url: '/settings',
              icon: IconUserCog,
            },
            {
              title: 'account',
              url: '/settings/account',
              icon: IconTool,
            },
            {
              title: 'appearance',
              url: '/settings/appearance',
              icon: IconPalette,
            },
            {
              title: 'notifications',
              url: '/settings/notifications',
              icon: IconNotification,
            },
            {
              title: 'display',
              url: '/settings/display',
              icon: IconBrowserCheck,
            },
            {
              title: 'localization',
              url: '/settings/localization',
              icon: IconLanguage,
            },
          ],
        },
        // {
        //   title: 'help_center',
        //   url: '/help-center',
        //   icon: IconHelp,
        // },
      ],
    },
  ],
}
