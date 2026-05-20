import {Separator} from "@/components/ui/separator";
import {SessionSettingsForm} from "@/app/(admin)/(projects)/settings/privacy/sessions/session-settings-form";


export default function SettingsNotificationsPage() {
  return (
    <div className="space-y-6">
      <div>
          <h3 className="text-xl text-primary font-heading font-bold "> Active Sessions </h3>
        <p className="text-sm text-muted-foreground">
            Monitor and manage all your active sessions.
        </p>
      </div>
      <Separator />
      <SessionSettingsForm/>
    </div>
  )
}
