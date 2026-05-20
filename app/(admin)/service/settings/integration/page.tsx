import {Separator} from "@/components/ui/separator";
import {IntegrationForm} from "@/app/(admin)/(projects)/settings/integration/integration-form";


export default function SettingsNotificationsPage() {
  return (
    <div className="space-y-6">
      <div>
          <h3 className="text-xl text-primary font-heading font-bold ">Integrations</h3>
        <p className="text-sm text-muted-foreground">
            Connect and sync with essential tools and platforms.
        </p>
      </div>
      <Separator />
      <IntegrationForm />
    </div>
  )
}
