"use client";

import { useTranslations } from "next-intl";
import type { AllergenId } from "@/lib/types";

const ALLERGENS: AllergenId[] = [
  "gluten",
  "dairy",
  "nuts",
  "eggs",
  "fish",
  "shellfish",
  "vegan",
];

interface AllergenFilterProps {
  selected: AllergenId[];
  onChange: (selected: AllergenId[]) => void;
}

export function AllergenFilter({ selected, onChange }: AllergenFilterProps) {
  const t = useTranslations("allergens");

  const toggle = (id: AllergenId) => {
    if (selected.includes(id)) {
      onChange(selected.filter((a) => a !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm font-medium text-foreground">{t("filterLabel")}</p>
      <div className="flex flex-wrap gap-2">
        {ALLERGENS.map((id) => {
          const active = selected.includes(id);
          return (
            <button
              key={id}
              type="button"
              onClick={() => toggle(id)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                active
                  ? "border-accent bg-accent/15 text-accent"
                  : "border-border bg-surface text-muted hover:border-accent/40"
              }`}
            >
              {t(id)}
            </button>
          );
        })}
        {selected.length > 0 ? (
          <button
            type="button"
            onClick={() => onChange([])}
            className="rounded-full px-3 py-1.5 text-xs font-medium text-muted hover:text-foreground"
          >
            {t("clear")}
          </button>
        ) : null}
      </div>
      {selected.length > 0 ? (
        <p className="text-xs text-muted">{t("hideHint")}</p>
      ) : null}
    </div>
  );
}
