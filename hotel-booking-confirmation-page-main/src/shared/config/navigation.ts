export interface NavItem {
  name: string
  path: string
  icon: string
  badge: number
}

export const navItems: NavItem[] = [
  { name: 'Your stay', path: '/your-stay', icon: 'icon-bed.svg', badge: 1 },
  { name: 'The House', path: '/the-house', icon: 'icon-house.svg', badge: 0 },
  { name: 'Around Town', path: '/around-town', icon: 'icon-pin.svg', badge: 0 },
  { name: 'Breakfast', path: '/breakfast', icon: 'icon-breakfast-outline.svg', badge: 0 },
  { name: 'Messages', path: '/messages', icon: 'icon-mail.svg', badge: 0 }
]

export const currentPath = '/your-stay'
