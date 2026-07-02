import { setRequestLocale, getTranslations } from "next-intl/server";
import { TableServicePage } from "@/components/TableServicePage";

export function generateStaticParams() {
  return ["1", "2", "3", "4", "5", "12"].map((tableId) => ({ tableId }));
}

export default async function DemoTablePage({
  params,
}: {
  params: Promise<{ locale: string; tableId: string }>;
}) {
  const { locale, tableId } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("demo");

  return (
    <TableServicePage tableId={tableId} restaurantName={t("restaurantName")} />
  );
}
