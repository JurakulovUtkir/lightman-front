import { ReactNode } from 'react'
import { Link, useLocation } from '@tanstack/react-router'
import { ChevronRight } from 'lucide-react'
import { useLang } from '@/hooks/useLang'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from '@/components/ui/sidebar'
import LongText from '../long-text'
import { Badge } from '../ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { NavCollapsible, NavItem, NavLink, type NavGroup } from './types'

export function NavGroup({ title, items }: NavGroup) {
  const { state, isMobile } = useSidebar()
  const { lang, general } = useLang()
  const t = general[lang].sidebar

  const href = useLocation({ select: (location) => location.href })
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{t[title as keyof typeof t]}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const key = `${item.title}-${item.url || 'collapsible'}`

          if (!item.items)
            return <SidebarMenuLink key={key} item={item} href={href} t={t} />

          if (state === 'collapsed' && !isMobile)
            return (
              <SidebarMenuCollapsedDropdown
                key={key}
                item={item}
                href={href}
                t={t}
              />
            )

          return (
            <SidebarMenuCollapsible key={key} item={item} href={href} t={t} />
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}

const NavBadge = ({ children }: { children: ReactNode }) => (
  <Badge className='rounded-full px-1 py-0 text-xs'>{children}</Badge>
)

const SidebarMenuLink = ({
  item,
  href,
  t,
}: {
  item: NavLink
  href: string
  t: (typeof import('@/translations/general.json'))['uz']['sidebar']
}) => {
  const { setOpenMobile } = useSidebar()
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={checkIsActive(href, item)}
        tooltip={t[item.title as keyof typeof t]}
      >
        <Link to={item.url} onClick={() => setOpenMobile(false)}>
          {item.icon && <item.icon />}
          <span>{t[item.title as keyof typeof t]}</span>
          {item.badge && <NavBadge>{item.badge}</NavBadge>}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

const SidebarMenuCollapsible = ({
  item,
  href,
  t,
  depth = 0,
}: {
  item: NavCollapsible
  href: string
  t: (typeof import('@/translations/general.json'))['uz']['sidebar']
  depth?: number
}) => {
  // const { setOpenMobile } = useSidebar()

  return (
    <Collapsible
      asChild
      defaultOpen={checkIsActive(href, item, true)}
      className='group/collapsible'
    >
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton tooltip={t[item.title as keyof typeof t]}>
            {item.icon && <item.icon />}
            <span>{t[item.title as keyof typeof t]}</span>
            {item.badge && <NavBadge>{item.badge}</NavBadge>}
            <ChevronRight className='ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90' />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent className='CollapsibleContent'>
          <SidebarMenuSub>
            {item.items.map((subItem) => (
              <NestedMenuItem
                key={subItem.title}
                item={subItem}
                href={href}
                t={t}
                depth={depth + 1}
              />
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  )
}

const NestedMenuItem = ({
  item,
  href,
  t,
  depth,
}: {
  item: NavItem
  href: string
  t: (typeof import('@/translations/general.json'))['uz']['sidebar']
  depth: number
}) => {
  const { setOpenMobile } = useSidebar()

  if (!item.items) {
    return (
      <SidebarMenuSubItem>
        <SidebarMenuSubButton asChild isActive={checkIsActive(href, item)}>
          <Link to={item.url} onClick={() => setOpenMobile(false)}>
            {item.icon && <item.icon />}
            <LongText overflow>{t[item.title as keyof typeof t]}</LongText>
            {item.badge && <NavBadge>{item.badge}</NavBadge>}
          </Link>
        </SidebarMenuSubButton>
      </SidebarMenuSubItem>
    )
  }

  return (
    <Collapsible
      asChild
      defaultOpen={checkIsActive(href, item, true)}
      className='group/collapsible-nested'
    >
      <SidebarMenuSubItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuSubButton>
            {item.icon && <item.icon />}
            <LongText overflow>{t[item.title as keyof typeof t]}</LongText>
            {item.badge && <NavBadge>{item.badge}</NavBadge>}
            <ChevronRight className='ml-auto transition-transform duration-200 group-data-[state=open]/collapsible-nested:rotate-90' />
          </SidebarMenuSubButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {item.items.map((nestedItem) => (
              <NestedMenuItem
                key={nestedItem.title}
                item={nestedItem}
                href={href}
                t={t}
                depth={depth + 1}
              />
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuSubItem>
    </Collapsible>
  )
}

const SidebarMenuCollapsedDropdown = ({
  item,
  href,
  t,
}: {
  item: NavCollapsible
  href: string
  t: (typeof import('@/translations/general.json'))['uz']['sidebar']
}) => {
  return (
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton
            tooltip={t[item.title as keyof typeof t]}
            isActive={checkIsActive(href, item)}
          >
            {item.icon && <item.icon />}
            <span>{t[item.title as keyof typeof t]}</span>
            {item.badge && <NavBadge>{item.badge}</NavBadge>}
            <ChevronRight className='ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90' />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent side='right' align='start' sideOffset={4}>
          <DropdownMenuLabel>
            {t[item.title as keyof typeof t]}{' '}
            {item.badge ? `(${item.badge})` : ''}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {renderDropdownItems(item.items, href, t)}
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  )
}

function renderDropdownItems(
  items: NavItem[],
  href: string,
  t: (typeof import('@/translations/general.json'))['uz']['sidebar']
): React.ReactNode {
  return items.map((sub) => {
    if (!sub.items) {
      return (
        <DropdownMenuItem key={`${sub.title}-${sub.url}`} asChild>
          <Link
            to={sub.url}
            className={`${checkIsActive(href, sub) ? 'bg-secondary' : ''}`}
          >
            {sub.icon && <sub.icon />}
            <span className='max-w-52 text-wrap'>
              {t[sub.title as keyof typeof t]}
            </span>
            {sub.badge && <span className='ml-auto text-xs'>{sub.badge}</span>}
          </Link>
        </DropdownMenuItem>
      )
    }

    return (
      <DropdownMenu key={sub.title}>
        <DropdownMenuTrigger asChild>
          <div className='hover:bg-accent flex cursor-pointer items-center justify-between rounded-sm px-2 py-1.5 text-sm'>
            <div className='flex items-center gap-2'>
              {sub.icon && <sub.icon />}
              <span>{t[sub.title as keyof typeof t]}</span>
            </div>
            <ChevronRight className='size-4' />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent side='right' align='start' sideOffset={4}>
          <DropdownMenuLabel>
            {t[sub.title as keyof typeof t]}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {renderDropdownItems(sub.items, href, t)}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  })
}

function checkIsActive(href: string, item: NavItem, mainNav = false): boolean {
  return (
    href === item.url ||
    href.split('?')[0] === item.url ||
    !!item?.items?.some((i) => checkIsActive(href, i)) ||
    (mainNav &&
      href.split('/')[1] !== '' &&
      href.split('/')[1] === item?.url?.split('/')[1])
  )
}
