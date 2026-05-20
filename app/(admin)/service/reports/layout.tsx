import { Badge } from "@/components/ui/badge";

export default function BaseLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { slug: string[] };
}) {
  return (
    <div>
        {children}
    </div>
  );
}
