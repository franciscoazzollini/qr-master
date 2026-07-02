import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { MenuLayout } from "@/components/menu/MenuLayout";
import { HostedMenuItems } from "@/components/menu/HostedMenuItems";
import { getPublicRestaurant } from "@/lib/repositories/restaurant";

export default async function HostedMenuCategoryPage({
  params,
}: {
  params: Promise<{ locale: string; id: string; category: string }>;
}) {
  const { id, category } = await params;
  setRequestLocale((await params).locale);

  const restaurant = await getPublicRestaurant(id);
  const section = restaurant?.settings.hostedMenu?.sections.find(
    (s) => s.id === category,
  );

  if (!restaurant || !section) {
    notFound();
  }

  return (
    <MenuLayout
      restaurantName={restaurant.name}
      title={section.title}
      subtitle={section.subtitle}
      backHref={`/r/${id}/menu`}
      backLabel="Menu"
    >
      <HostedMenuItems items={section.items} />
    </MenuLayout>
  );
}
