"use client";

import { useState } from "react";
import { MenuItemCard } from "@/components/menu/MenuLayout";
import { AllergenFilter } from "@/components/menu/AllergenFilter";
import { itemHasAllergen } from "@/lib/menu/hosted-menu";
import type { AllergenId, HostedMenuItem } from "@/lib/types";

interface HostedMenuItemsProps {
  items: HostedMenuItem[];
}

export function HostedMenuItems({ items }: HostedMenuItemsProps) {
  const [selectedAllergens, setSelectedAllergens] = useState<AllergenId[]>([]);

  const visibleItems = items.filter(
    (item) => !itemHasAllergen(item.allergens, selectedAllergens),
  );

  return (
    <div className="flex flex-col gap-6">
      <AllergenFilter
        selected={selectedAllergens}
        onChange={setSelectedAllergens}
      />
      <div className="grid gap-5 sm:grid-cols-2">
        {visibleItems.map((item) => (
          <MenuItemCard
            key={item.id}
            name={item.name}
            description={item.description}
            price={item.price}
            imageSrc={item.imageSrc}
            tag={item.tag}
          />
        ))}
      </div>
      {visibleItems.length === 0 ? (
        <p className="text-center text-sm text-muted">
          No dishes match your filter.
        </p>
      ) : null}
    </div>
  );
}
