interface NavItemProps {
  item: NavLink;
}

export const NavItem = ({ item }: NavItemProps) => {
  return (
    <a
      href={item.href}
      className={`flex text-white text-sm navbar-item whitespace-nowrap ${
        item.active && "navbar-item-active"
      }`}
    >
      {item.label}
    </a>
  );
};
