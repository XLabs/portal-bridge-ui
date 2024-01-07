/// <reference types="vite/client" />

type NavLink = {
  label: string;
  active?: boolean;
  href: string;
};

declare const BASE_URL: string;
declare const navBar: NavLink[];
