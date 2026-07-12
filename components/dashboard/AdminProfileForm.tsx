"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LockKeyhole, Save, UserRoundCog } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { toast } from "@/lib/toast";
import {
  useUpdateAdminPasswordMutation,
  useUpdateAdminProfileMutation,
} from "@/hooks/use-auth-mutations";
import {
  adminPasswordChangeSchema,
  adminProfileSchema,
  type AdminPasswordChangeInput,
  type AdminProfileInput,
} from "@/lib/auth/validation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

type AdminProfileFormProps = {
  admin: {
    email: string;
    name: string;
  };
};

export function AdminProfileForm({ admin }: AdminProfileFormProps) {
  const t = useTranslations("dashboard.profile");
  const router = useRouter();
  const profileMutation = useUpdateAdminProfileMutation();
  const passwordMutation = useUpdateAdminPasswordMutation();

  const profileForm = useForm<AdminProfileInput>({
    resolver: zodResolver(adminProfileSchema) as never,
    defaultValues: {
      name: admin.name,
      email: admin.email,
    },
  });

  const passwordForm = useForm<AdminPasswordChangeInput>({
    resolver: zodResolver(adminPasswordChangeSchema) as never,
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onProfileSubmit = profileForm.handleSubmit((values) => {
    profileMutation.mutate(values, {
      onSuccess: (response) => {
        profileForm.reset({
          name: response.admin.name,
          email: response.admin.email,
        });
        toast.success(t("profileSaved"));
        router.refresh();
      },
    });
  });

  const onPasswordSubmit = passwordForm.handleSubmit((values) => {
    passwordMutation.mutate(values, {
      onSuccess: () => {
        passwordForm.reset({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        toast.success(t("passwordSaved"));
      },
    });
  });

  return (
    <div className="grid gap-6">
      <section className="rounded-[28px] border border-border/70 bg-dashboard-surface p-6 shadow-dashboard sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-dashboard-ink-muted">{t("eyebrow")}</p>
            <h1 className="mt-2 text-2xl font-semibold text-dashboard-ink">{t("title")}</h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-dashboard-ink-muted">
              {t("subtitle")}
            </p>
          </div>
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-dashboard-gulf-light text-dashboard-gulf">
            <UserRoundCog className="h-5 w-5" />
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="border-border/70 bg-dashboard-surface shadow-dashboard">
          <CardHeader className="border-b border-border/50 px-6 py-5">
            <CardTitle className="flex items-center gap-2 text-lg">
              <UserRoundCog className="h-4 w-4 text-dashboard-gulf" />
              {t("profileCardTitle")}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6 py-6">
            <Form {...profileForm}>
              <form onSubmit={onProfileSubmit} className="grid gap-5">
                <FormField
                  control={profileForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("name")}</FormLabel>
                      <FormControl>
                        <Input {...field} className="h-11 rounded-xl" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={profileForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("email")}</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" className="h-11 rounded-xl" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  size="lg"
                  className="justify-self-start rounded-xl bg-dashboard-gulf text-brand-on hover:bg-brand-deep"
                  disabled={profileMutation.isPending}
                >
                  <Save className="h-4 w-4" />
                  {profileMutation.isPending ? t("saving") : t("saveProfile")}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card className="border-border/70 bg-dashboard-surface shadow-dashboard">
          <CardHeader className="border-b border-border/50 px-6 py-5">
            <CardTitle className="flex items-center gap-2 text-lg">
              <LockKeyhole className="h-4 w-4 text-dashboard-coral" />
              {t("passwordCardTitle")}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6 py-6">
            <Form {...passwordForm}>
              <form onSubmit={onPasswordSubmit} className="grid gap-5">
                <FormField
                  control={passwordForm.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("currentPassword")}</FormLabel>
                      <FormControl>
                        <Input {...field} type="password" className="h-11 rounded-xl" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={passwordForm.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("newPassword")}</FormLabel>
                      <FormControl>
                        <Input {...field} type="password" className="h-11 rounded-xl" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={passwordForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("confirmPassword")}</FormLabel>
                      <FormControl>
                        <Input {...field} type="password" className="h-11 rounded-xl" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  size="lg"
                  className="justify-self-start rounded-xl bg-dashboard-coral text-white hover:bg-dashboard-coral/90"
                  disabled={passwordMutation.isPending}
                >
                  <LockKeyhole className="h-4 w-4" />
                  {passwordMutation.isPending ? t("saving") : t("savePassword")}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
