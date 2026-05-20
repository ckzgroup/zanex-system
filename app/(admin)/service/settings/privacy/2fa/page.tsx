import {Separator} from "@/components/ui/separator";
import {FaSettingsForm} from "@/app/(admin)/(projects)/settings/privacy/2fa/2fa-settings-form";


export default function SettingsNotificationsPage() {
  return (
    <div className="space-y-6">
      <div>
          <h3 className="text-xl text-primary font-heading font-bold "> 2FA Security </h3>
        <p className="text-sm text-muted-foreground">
            Enable two-factor authentication to your account.
        </p>
      </div>
      <Separator />
      <FaSettingsForm/>
    </div>
  )
}
