import {Separator} from "@/components/ui/separator";
import {AppearanceForm} from "@/app/(admin)/(projects)/settings/appearance/appearance-form";


export default function SettingsAppearancePage() {
  return (
    <div className="space-y-6">
      <div>
          <h3 className="text-xl text-primary font-heading font-bold ">Appearance</h3>
        <p className="text-sm text-muted-foreground">
          Customize the appearance of the app. Automatically switch between day
          and night themes.
        </p>
      </div>
      <Separator />
      <AppearanceForm />
    </div>
  )
}
