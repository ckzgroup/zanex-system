import {Separator} from "@/components/ui/separator";
import {PrivacyForm} from "@/app/(admin)/(projects)/settings/privacy/privacy-form";


export default function SettingsDisplayPage() {
  return (
    <div className="space-y-6">
      <div>
          <h3 className="text-xl text-primary font-heading font-bold ">Change Password</h3>
        <p className="text-sm text-muted-foreground">
            Update password for enhanced account security.
        </p>
      </div>
      <Separator />
      <PrivacyForm />
    </div>
  )
}
