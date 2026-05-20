import {Separator} from "@/components/ui/separator";
import {NotificationsForm} from "@/app/(admin)/(projects)/settings/notifications/notifications-form";


export default function SettingsNotificationsPage() {
  return (
    <div className="space-y-6">
      <div>
          <h3 className="text-xl text-primary font-heading font-bold ">Notification Preferences</h3>
        <p className="text-sm text-muted-foreground">
            Choose what notifications you want to receive.
        </p>
      </div>
      <Separator />
      <NotificationsForm />
    </div>
  )
}
