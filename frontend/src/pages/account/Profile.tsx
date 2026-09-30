import { type FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "@/store/auth";
import { useDeleteAccount, useUpdatePassword, useUpdateProfile } from "@/hooks/useAuth";
import { useToastStore } from "@/store/toast";
import { getErrorMessage } from "@/lib/api";
import { AccountLayout } from "@/components/layout/AccountLayout";
import { Input } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";

export function Profile() {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const push = useToastStore((s) => s.push);
  const navigate = useNavigate();
  const updateProfile = useUpdateProfile();
  const updatePassword = useUpdatePassword();
  const deleteAccount = useDeleteAccount();

  const [info, setInfo] = useState({ name: user?.name ?? "", email: user?.email ?? "", phone: user?.phone ?? "" });
  const [passwords, setPasswords] = useState({ current_password: "", password: "", password_confirmation: "" });
  const [deletePassword, setDeletePassword] = useState("");
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  function handleInfoSubmit(e: FormEvent) {
    e.preventDefault();
    updateProfile.mutate(info, {
      onSuccess: () => push(t("account.profile.profileUpdated")),
      onError: (err) => push(getErrorMessage(err), "error"),
    });
  }

  function handlePasswordSubmit(e: FormEvent) {
    e.preventDefault();
    updatePassword.mutate(passwords, {
      onSuccess: () => {
        push(t("account.profile.passwordUpdated"));
        setPasswords({ current_password: "", password: "", password_confirmation: "" });
      },
      onError: (err) => push(getErrorMessage(err), "error"),
    });
  }

  function handleDelete(e: FormEvent) {
    e.preventDefault();
    deleteAccount.mutate(deletePassword, {
      onSuccess: () => navigate("/"),
      onError: (err) => push(getErrorMessage(err), "error"),
    });
  }

  return (
    <AccountLayout>
      <div className="max-w-lg space-y-14">
        <section>
          <h2 className="mb-6 font-display text-xl">{t("account.profile.personalInformation")}</h2>
          <form onSubmit={handleInfoSubmit} className="space-y-5">
            <Input id="name" label={t("account.profile.fullName")} required value={info.name} onChange={(e) => setInfo({ ...info, name: e.target.value })} />
            <Input id="email" type="email" label={t("account.profile.email")} required value={info.email} onChange={(e) => setInfo({ ...info, email: e.target.value })} />
            <Input id="phone" label={t("account.profile.phone")} required value={info.phone} onChange={(e) => setInfo({ ...info, phone: e.target.value })} />
            <Button type="submit" loading={updateProfile.isPending}>
              {t("account.profile.saveChanges")}
            </Button>
          </form>
        </section>

        <section>
          <h2 className="mb-6 font-display text-xl">{t("account.profile.changePassword")}</h2>
          <form onSubmit={handlePasswordSubmit} className="space-y-5">
            <Input
              id="current_password"
              type="password"
              label={t("account.profile.currentPassword")}
              required
              value={passwords.current_password}
              onChange={(e) => setPasswords({ ...passwords, current_password: e.target.value })}
            />
            <Input
              id="new_password"
              type="password"
              label={t("account.profile.newPassword")}
              required
              value={passwords.password}
              onChange={(e) => setPasswords({ ...passwords, password: e.target.value })}
            />
            <Input
              id="new_password_confirmation"
              type="password"
              label={t("account.profile.confirmNewPassword")}
              required
              value={passwords.password_confirmation}
              onChange={(e) => setPasswords({ ...passwords, password_confirmation: e.target.value })}
            />
            <Button type="submit" loading={updatePassword.isPending}>
              {t("account.profile.updatePassword")}
            </Button>
          </form>
        </section>

        <section className="border-t border-line pt-10">
          <h2 className="mb-2 font-display text-xl text-rust">{t("account.profile.deleteAccount")}</h2>
          <p className="mb-6 text-sm text-ink-soft">{t("account.profile.deleteAccountWarning")}</p>
          {confirmingDelete ? (
            <form onSubmit={handleDelete} className="space-y-4">
              <Input
                id="delete_password"
                type="password"
                label={t("account.profile.confirmPassword")}
                required
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
              />
              <div className="flex gap-3">
                <Button type="submit" variant="danger" loading={deleteAccount.isPending}>
                  {t("account.profile.confirmDelete")}
                </Button>
                <Button type="button" variant="ghost" onClick={() => setConfirmingDelete(false)}>
                  {t("account.profile.cancel")}
                </Button>
              </div>
            </form>
          ) : (
            <Button variant="outline" onClick={() => setConfirmingDelete(true)}>
              {t("account.profile.deleteMyAccount")}
            </Button>
          )}
        </section>
      </div>
    </AccountLayout>
  );
}
