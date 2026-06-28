"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm, type FieldErrors } from "react-hook-form";
import { useTranslations } from "next-intl";
import { handleFormValidationFailure } from "@/lib/cms/form-submit";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useLoginAdminMutation } from "@/hooks/use-auth-mutations";
import { adminLoginSchema, type AdminLoginInput } from "@/lib/auth/validation";
import { cn } from "@/lib/utils";

type AdminLoginFormProps = {
  className?: string;
};

export function AdminLoginForm({ className }: AdminLoginFormProps) {
  const t = useTranslations("adminAuth");
  const router = useRouter();
  const searchParams = useSearchParams();
  const loginMutation = useLoginAdminMutation();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<AdminLoginInput>({
    resolver: zodResolver(adminLoginSchema) as never,
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  const onSubmit = form.handleSubmit(
    (values) => {
      loginMutation.mutate(values, {
        onSuccess: () => {
          const next = searchParams.get("next") || "/dashboard";
          router.replace(next);
          router.refresh();
        },
      });
    },
    (errors: FieldErrors<AdminLoginInput>) => {
      handleFormValidationFailure(form, errors, {
        validationMessage: () => t("validationFailed"),
      });
    },
  );

  return (
    <div className={cn("flex w-full max-w-md flex-col", className)}>
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-ink">
          {t("title")}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">{t("subtitle")}</p>
      </div>

      <Form {...form}>
        <form onSubmit={onSubmit} className="grid gap-5">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("email")}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    autoComplete="email"
                    placeholder={t("emailPlaceholder")}
                    className="h-11 rounded-xl px-3"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("password")}</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder={t("passwordPlaceholder")}
                      className="h-11 rounded-xl px-3 pe-11"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      className="absolute inset-y-0 end-0 grid w-11 place-items-center text-muted-foreground transition-colors hover:text-foreground"
                      aria-label={showPassword ? t("hidePassword") : t("showPassword")}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="remember"
            render={({ field }) => (
              <FormItem className="flex items-center gap-2">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(checked) => field.onChange(checked === true)}
                  />
                </FormControl>
                <FormLabel className="m-0 font-normal text-sm text-muted-foreground">
                  {t("remember")}
                </FormLabel>
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={loginMutation.isPending}
            className="h-11 rounded-xl bg-brand text-brand-on hover:bg-brand-deep"
          >
            {loginMutation.isPending ? t("signingIn") : t("signIn")}
          </Button>
        </form>
      </Form>
    </div>
  );
}
