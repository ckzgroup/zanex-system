import {Separator} from "@/components/ui/separator";
import {
    IntegrationSuggestionForm
} from "@/app/(admin)/(projects)/settings/integration/suggestion/integration-suggestion-form";


export default function SettingsDisplayPage() {
  return (
    <div className="space-y-6">
      <div>
          <h3 className="text-xl text-primary font-heading font-bold ">Make a Suggestion</h3>
        <p className="text-sm text-muted-foreground">
            Recommend an Integration to help us.
        </p>
      </div>
      <Separator />
      <IntegrationSuggestionForm/>
    </div>
  )
}
