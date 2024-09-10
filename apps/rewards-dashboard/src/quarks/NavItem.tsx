interface NavItemProps {
  item: NavLink;
}

export const NavItem = ({ item }: NavItemProps) => {
  return (
    <a
      href={item.href}
      className={`flex text-white text-sm hover:font-bold whitespace-nowrap ${
        item.active && "font-bold"
      }`}
    >
      {item.label}
    </a>
  );
};
