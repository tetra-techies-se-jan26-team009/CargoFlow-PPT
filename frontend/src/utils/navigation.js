import {
  ChartPieIcon,
  CursorArrowRaysIcon,
  SquaresPlusIcon,
  ArrowPathIcon,
  FingerPrintIcon
} from "@heroicons/react/24/outline";


import { UserIcon } from "@heroicons/react/24/solid"


export const SERVICES = [
  {
    name: "Analytics",
    to: "#",
    icon: ChartPieIcon,
  },
  {
    name: "Engagement",
    to: "#",
    icon: CursorArrowRaysIcon,
  },
  {
    name: "Security",
    to: "#",
    icon: FingerPrintIcon,
  },
  {
    name: "Integrations",
    to: "#",
    icon: SquaresPlusIcon,
  },
  {
    name: "Automations",
    to: "#",
    icon: ArrowPathIcon,
  },
];


export const SOLUTIONS = [
  {
    name: "E-commerce",
    to: "#",
    icon: UserIcon
  },
  {
    name: "Logistics",
    to: "#",
    icon: UserIcon

  },
];

export const PARTNER = [
  {
    name: "Affiliates",
    to: "#",
    icon: UserIcon

  },
  {
    name: "Resellers",
    to: "#",
    icon: UserIcon

  },
];

export const COMPANY = [
  {
    name: "About Us",
    to: "/about_us",
    icon: UserIcon
  },
  {
    name: "Careers",
    to: "#",
    icon: UserIcon

  },
];

export const LOGIN_OPTIONS = [
  {
    name: "Business Shipments", to: "/login", icon: UserIcon
  },
  {
    name: "National Delivery", to: "/login", icon: UserIcon
  },
];