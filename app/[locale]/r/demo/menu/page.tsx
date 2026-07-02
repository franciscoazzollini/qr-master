import { setRequestLocale, getTranslations } from "next-intl/server";
import {
  MenuCategoryCard,
  MenuLayout,
} from "@/components/menu/MenuLayout";
import { CATEGORY_COVER_IMAGES, MENU_CATEGORIES } from "@/lib/demo/config";

export default async function DemoMenuPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("demo");
  const tMenu = await getTranslations("demo.menu");

  return (
    <MenuLayout
      restaurantName={t("restaurantName")}
      title={tMenu("title")}
      subtitle={tMenu("subtitle")}
      backHref="/r/demo"
      backLabel={tMenu("backToLanding")}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {MENU_CATEGORIES.map((category) => (
          <MenuCategoryCard
            key={category}
            href={`/r/demo/menu/${category}`}
            title={tMenu(`categories.${category}.title`)}
            subtitle={tMenu(`categories.${category}.subtitle`)}
            imageSrc={CATEGORY_COVER_IMAGES[category]}
            cta={tMenu("viewCategory")}
          />
        ))}
      </div>
    </MenuLayout>
  );
}
