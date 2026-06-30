import { motion } from "motion/react";
import { Link } from "react-router-dom";

import { routePaths } from "../../../app/router/routes";
import { LoginForm } from "../components/LoginForm";

export function LoginPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className="space-y-6"
    >
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
    </motion.div>
  );
}
