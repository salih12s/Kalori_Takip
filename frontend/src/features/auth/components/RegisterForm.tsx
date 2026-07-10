import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { routePaths } from "../../../app/router/routes";
import { FormField } from "../../../components/shared/FormField";
import { getApiErrorMessage } from "../../../lib/api";
import { inputClassName, primaryButtonClassName } from "../../../lib/ui";
import { useAuth } from "../hooks/useAuth";
import { registerSchema, type RegisterFormValues } from "../schemas/auth.schema";

export function RegisterForm() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { username: "", password: "", confirmPassword: "" },
  });

  const mutation = useMutation({
    mutationFn: (values: RegisterFormValues) =>
      registerUser({
        username: values.username.trim(),
        password: values.password,
      }),
    onSuccess: () => {
      toast.success("Kayıt başarılı");
      navigate(routePaths.onboarding, { replace: true });
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
          autoComplete="new-password"
          placeholder="En az 6 karakter"
          className={inputClassName}
          {...register("password")}
        />
      </FormField>

      <FormField
        label="Şifre tekrar"
        htmlFor="confirmPassword"
        error={errors.confirmPassword?.message}
      >
        <input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          placeholder="Şifreni tekrar gir"
          className={inputClassName}
          {...register("confirmPassword")}
        />
      </FormField>

      <button type="submit" disabled={mutation.isPending} className={primaryButtonClassName}>
        {mutation.isPending ? "Kayıt oluşturuluyor..." : "Kayıt Ol"}
      </button>
    </form>
  );
}
