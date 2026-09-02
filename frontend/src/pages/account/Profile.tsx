import { type FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth";
import { useDeleteAccount, useUpdatePassword, useUpdateProfile } from "@/hooks/useAuth";
import { useToastStore } from "@/store/toast";
import { getErrorMessage } from "@/lib/api";
import { AccountLayout } from "@/components/layout/AccountLayout";
import { Input } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";

export function Profile() {
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
      onSuccess: () => push("Profile updated."),
      onError: (err) => push(getErrorMessage(err), "error"),
    });
  }

  function handlePasswordSubmit(e: FormEvent) {
    e.preventDefault();
    updatePassword.mutate(passwords, {
      onSuccess: () => {
        push("Password updated.");
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
          <h2 className="mb-6 font-display text-xl">Personal Information</h2>
          <form onSubmit={handleInfoSubmit} className="space-y-5">
            <Input id="name" label="Full Name" required value={info.name} onChange={(e) => setInfo({ ...info, name: e.target.value })} />
            <Input id="email" type="email" label="Email" required value={info.email} onChange={(e) => setInfo({ ...info, email: e.target.value })} />
            <Input id="phone" label="Phone" required value={info.phone} onChange={(e) => setInfo({ ...info, phone: e.target.value })} />
            <Button type="submit" loading={updateProfile.isPending}>
              Save Changes
            </Button>
          </form>
        </section>

        <section>
          <h2 className="mb-6 font-display text-xl">Change Password</h2>
          <form onSubmit={handlePasswordSubmit} className="space-y-5">
            <Input
              id="current_password"
              type="password"
              label="Current Password"
              required
              value={passwords.current_password}
              onChange={(e) => setPasswords({ ...passwords, current_password: e.target.value })}
            />
            <Input
              id="new_password"
              type="password"
              label="New Password"
              required
              value={passwords.password}
              onChange={(e) => setPasswords({ ...passwords, password: e.target.value })}
            />
            <Input
              id="new_password_confirmation"
              type="password"
              label="Confirm New Password"
              required
              value={passwords.password_confirmation}
              onChange={(e) => setPasswords({ ...passwords, password_confirmation: e.target.value })}
            />
            <Button type="submit" loading={updatePassword.isPending}>
              Update Password
            </Button>
          </form>
        </section>

        <section className="border-t border-line pt-10">
          <h2 className="mb-2 font-display text-xl text-rust">Delete Account</h2>
          <p className="mb-6 text-sm text-ink-soft">This will permanently remove your account and order history.</p>
          {confirmingDelete ? (
            <form onSubmit={handleDelete} className="space-y-4">
              <Input
                id="delete_password"
                type="password"
                label="Confirm Password"
                required
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
              />
              <div className="flex gap-3">
                <Button type="submit" variant="danger" loading={deleteAccount.isPending}>
                  Confirm Delete
                </Button>
                <Button type="button" variant="ghost" onClick={() => setConfirmingDelete(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <Button variant="outline" onClick={() => setConfirmingDelete(true)}>
              Delete My Account
            </Button>
          )}
        </section>
      </div>
    </AccountLayout>
  );
}
