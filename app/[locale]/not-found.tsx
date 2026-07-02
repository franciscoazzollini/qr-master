import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

export default function NotFound() {
  const t = useTranslations("errors");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4">
      <h1 className="text-2xl font-bold">{t("notFound")}</h1>
      <Link href="/" className="text-blue-600 hover:underline">
        Home
      </Link>
    </div>
  );
}
