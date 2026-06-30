import { Link } from "react-router-dom";

import { routePaths } from "../../../app/router/routes";
import { LoginForm } from "../components/LoginForm";

export function LoginPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1 text-center">
        <h1 className="text-xl font-bold text-stone-900">Giriş Yap</h1>
        <p className="text-sm text-stone-500">Hesabına giriş yaparak takibe devam et.</p>
      </div>

      <LoginForm />

      <p className="text-center text-sm text-stone-500">
        Hesabın yok mu?{" "}
        <Link
          to={routePaths.register}
          className="font-medium text-emerald-600 hover:text-emerald-700"
        >
          Kayıt ol
        </Link>
      </p>
    </div>
  );
}
