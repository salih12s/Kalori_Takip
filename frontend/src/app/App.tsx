import { AppProviders } from "./providers/AppProviders";
import { AppRouter } from "./router/AppRouter";
import { SplashVideo } from "../components/branding/SplashVideo";

export function App() {
  return (
    <AppProviders>
      <SplashVideo />
      <AppRouter />
    </AppProviders>
  );
}
