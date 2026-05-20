import {Separator} from "@/components/ui/separator";
import {NotificationMethodForm} from "@/app/(admin)/(projects)/settings/notifications/method/notification-method-form";


export default function SettingsNotificationsPage() {
  return (
    <div className="space-y-6">
      <div>
          <h3 className="text-xl text-primary font-heading font-bold ">Notification Method</h3>
        <p className="text-sm text-muted-foreground">
            Choose how you prefer to receive notifications.
        </p>
      </div>
      <Separator />
      <NotificationMethodForm />
    </div>
  )
}
