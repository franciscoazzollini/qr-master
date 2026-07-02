import { setRequestLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { MenuLayout } from "@/components/menu/MenuLayout";
import { DemoMenuItems } from "@/components/menu/DemoMenuItems";
import { MENU_CATEGORIES, MENU_ITEMS, type MenuCategory } from "@/lib/demo/menu";

interface MenuCategoryPageProps {
  params: Promise<{ locale: string; category: string }>;
}

export function generateStaticParams() {
  return MENU_CATEGORIES.map((category) => ({ category }));
}

export default async function DemoMenuCategoryPage({
  params,
}: MenuCategoryPageProps) {
  const { locale, category } = await params;
  setRequestLocale(locale);

  if (!MENU_CATEGORIES.includes(category as MenuCategory)) {
    notFound();
  }

  const menuCategory = category as MenuCategory;
  const itemIds = MENU_ITEMS[menuCategory];

  const t = await getTranslations("demo");
  const tMenu = await getTranslations("demo.menu");

  return (
    <MenuLayout
      restaurantName={t("restaurantName")}
      title={tMenu(`categories.${menuCategory}.title`)}
      subtitle={tMenu(`categories.${menuCategory}.subtitle`)}
      backHref="/r/demo/menu"
      backLabel={tMenu("title")}
    >
      <DemoMenuItems itemIds={itemIds} />
    </MenuLayout>
  );
}
