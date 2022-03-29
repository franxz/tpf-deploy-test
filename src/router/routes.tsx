import { Home } from "../pages/home/home";
import { Login } from "../pages/login/login";
import { ReactComponent } from "../lib/types";

type Page = "HOME" | "LOGIN";

type Route = {
  path: string;
  component: ReactComponent;
};

const PATHS: Record<Page, string> = {
  HOME: "/",
  LOGIN: "/ingresar",
};

export const ROUTES: Route[] = [
  { path: PATHS.HOME, component: Home },
  { path: PATHS.LOGIN, component: Login },
];
