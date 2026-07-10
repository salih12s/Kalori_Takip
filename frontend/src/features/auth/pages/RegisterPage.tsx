import { motion } from "motion/react";
import { Link } from "react-router-dom";

import { routePaths } from "../../../app/router/routes";
import { RegisterForm } from "../components/RegisterForm";

export function RegisterPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className="space-y-6"
    >
      <div className="space-y-1 text-center">
        <h1 className="text-xl font-bold text-stone-900">Kayıt Ol</h1>
      </div>

      <RegisterForm />

      <p className="text-center text-sm text-stone-500">
        Zaten hesabın var mı?{" "}
        <Link
          to={routePaths.login}
          className="font-medium text-emerald-600 hover:text-emerald-700"
        >
          Giriş yap
        </Link>
      </p>
    </motion.div>
  );
}
