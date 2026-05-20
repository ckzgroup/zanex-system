import { Separator } from "@/components/ui/separator"
import {GeneralSettingsForm} from "@/app/(admin)/(projects)/settings/(general)/general-settings-form";

export default function SettingsProfilePage() {
  return (
            <div className="space-y-6">
                <div>
                    <h3 className="text-xl text-primary font-heading font-bold ">Regional Preferences</h3>
                    <p className="text-sm text-muted-foreground">
                        Select your preferences for your region.
                    </p>
                </div>
                <Separator/>
                <GeneralSettingsForm/>
            </div>
)
}
