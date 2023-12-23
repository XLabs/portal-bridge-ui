interface NavItemProps {
  item: NavLink;
}

export const NavItem = ({ item }: NavItemProps) => {
  return (
    <a
      href={item.href}
      className={`text-white text-sm
    hover:cursor-pointer hover:underline hover:underline-offset-8
    whitespace-nowrap
    ${item.active && "underline underline-offset-8"}
    `}
    >
      {item.label}
    </a>
  );
};

export const MobileNavItem = ({ item }: NavItemProps) => {
  return (
    <a
      href={item.href}
      className={`text-white
    hover:cursor-pointer
    hover:bg-white hover:bg-opacity-10 duration-200
    py-3
    pl-4 ml-2
    `}
    >
      {item.label}
    </a>
  );
};
