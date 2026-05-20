import {Separator} from "@/components/ui/separator";
import {DisplayForm} from "@/app/(admin)/(projects)/settings/display/display-form";


export default function SettingsDisplayPage() {
  return (
    <div className="space-y-6">
      <div>
          <h3 className="text-xl text-primary font-heading font-bold ">Display</h3>
        <p className="text-sm text-muted-foreground">
          Turn items on or off to control what&apos;s displayed in the app.
        </p>
      </div>
      <Separator />
      <DisplayForm />
    </div>
  )
}
