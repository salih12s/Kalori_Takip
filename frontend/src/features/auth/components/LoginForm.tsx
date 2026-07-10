import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { routePaths } from "../../../app/router/routes";
import { FormField } from "../../../components/shared/FormField";
import { getApiErrorMessage } from "../../../lib/api";
import { inputClassName, primaryButtonClassName } from "../../../lib/ui";
import { onboardingApi } from "../../onboarding/api/onboarding.api";
import { useAuth } from "../hooks/useAuth";
import { loginSchema, type LoginFormValues } from "../schemas/auth.schema";

export function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "" },
  });

  const mutation = useMutation({
    mutationFn: async (values: LoginFormValues) => {
      await login(values);
      const goal = await onboardingApi.getActiveGoal();
      return Boolean(goal);
    },
    onSuccess: (hasGoal) => {
      toast.success("Giriş başarılı");
      navigate(hasGoal ? routePaths.dashboard : routePaths.onboarding, { replace: true });
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  return (
    <form
      noValidate
      onSubmit={handleSubmit((values) => mutation.mutate(values))}
      className="space-y-4"
    >
      <FormField label="Kullanıcı adı" htmlFor="username" error={errors.username?.message}>
        <input
          id="username"
          type="text"
          autoComplete="username"
          placeholder="kullanici_adi"
          className={inputClassName}
          {...register("username")}
        />
      </FormField>

      <FormField label="Şifre" htmlFor="password" error={errors.password?.message}>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••"
          className={inputClassName}
          {...register("password")}
        />
      </FormField>

      <button type="submit" disabled={mutation.isPending} className={primaryButtonClassName}>
        {mutation.isPending ? "Giriş yapılıyor..." : "Giriş Yap"}
      </button>
    </form>
  );
}
