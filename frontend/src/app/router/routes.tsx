import {
  Activity,
  Award,
  LayoutDashboard,
  Settings,
  Trophy,
  User,
  Users,
  Utensils,
  type LucideIcon,
} from "lucide-react";

/** Centralized route paths so links stay consistent across the app. */
export const routePaths = {
  login: "/login",
  register: "/register",
  onboarding: "/onboarding",
  dashboard: "/dashboard",
  nutrition: "/nutrition",
  activity: "/activity",
  leaderboard: "/leaderboard",
  challenges: "/challenges",
  badges: "/badges",
  friends: "/friends",
  profile: "/profile",
  settings: "/settings",
} as const;

export interface NavItem {
  to: string;
  /** Turkish user-facing label. */
  label: string;
  icon: LucideIcon;
}

/** Primary navigation, shared by the sidebar and the mobile nav. */
export const navItems: NavItem[] = [
  { to: routePaths.dashboard, label: "Dashboard", icon: LayoutDashboard },
  { to: routePaths.nutrition, label: "Yemek Günlüğü", icon: Utensils },
  { to: routePaths.activity, label: "Aktivite", icon: Activity },
  { to: routePaths.leaderboard, label: "Liderlik", icon: Trophy },
  { to: routePaths.badges, label: "Rozetler", icon: Award },
  { to: routePaths.friends, label: "Arkadaşlar", icon: Users },
  { to: routePaths.profile, label: "Profil", icon: User },
  { to: routePaths.settings, label: "Ayarlar", icon: Settings },
];
