import {Separator} from "@/components/ui/separator";
import {AccountForm} from "@/app/(admin)/(projects)/settings/account/account-form";


export default function SettingsAccountPage() {
  return (
    <div className="space-y-6">
      <div>
          <h3 className="text-xl text-primary font-heading font-bold ">Account</h3>
        <p className="text-sm text-muted-foreground">
          Update your account settings. Set your preferred language and
          timezone.
        </p>
      </div>
      <Separator />
      <AccountForm />
    </div>
  )
}
