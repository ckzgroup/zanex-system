import {Separator} from "@/components/ui/separator";
import {
    UpcomingIntegrationForm
} from "@/app/(admin)/(projects)/settings/integration/upcoming/upcoming-integration-form";

export default function SettingsNotificationsPage() {
  return (
    <div className="space-y-6">
      <div>
          <h3 className="text-xl text-primary font-heading font-bold ">Upcoming Integrations</h3>
        <p className="text-sm text-muted-foreground">
            Preview of upcoming integrations.
        </p>
      </div>
      <Separator />
      <UpcomingIntegrationForm />
    </div>
  )
}
