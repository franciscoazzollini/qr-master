import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  const t = useTranslations("errors");
  const tCommon = useTranslations("common");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-4">
      <h1 className="text-2xl font-bold text-foreground">{t("notFound")}</h1>
      <Button href="/" variant="secondary">
        {tCommon("home")}
      </Button>
    </div>
  );
}
