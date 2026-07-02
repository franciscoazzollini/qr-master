"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { MenuItemCard } from "@/components/menu/MenuLayout";
import { AllergenFilter } from "@/components/menu/AllergenFilter";
import { DEMO_ITEM_ALLERGENS, itemHasAllergen } from "@/lib/menu/hosted-menu";
import { getDishImagePath } from "@/lib/demo/dish-images";
import type { AllergenId } from "@/lib/types";

interface DemoMenuItemsProps {
  itemIds: string[];
}

export function DemoMenuItems({ itemIds }: DemoMenuItemsProps) {
  const tMenu = useTranslations("demo.menu");
  const [selectedAllergens, setSelectedAllergens] = useState<AllergenId[]>([]);

  const visibleIds = itemIds.filter(
    (id) => !itemHasAllergen(DEMO_ITEM_ALLERGENS[id], selectedAllergens),
  );

  return (
    <div className="flex flex-col gap-6">
      <AllergenFilter
        selected={selectedAllergens}
        onChange={setSelectedAllergens}
      />
      <div className="grid gap-5 sm:grid-cols-2">
        {visibleIds.map((itemId) => {
          const tag = tMenu(`items.${itemId}.tag`);
          return (
            <MenuItemCard
              key={itemId}
              name={tMenu(`items.${itemId}.name`)}
              description={tMenu(`items.${itemId}.description`)}
              price={tMenu(`items.${itemId}.price`)}
              imageSrc={getDishImagePath(itemId)}
              tag={tag || undefined}
            />
          );
        })}
      </div>
    </div>
  );
}
