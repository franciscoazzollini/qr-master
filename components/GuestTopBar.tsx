"use client";

import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeToggle } from "./ThemeToggle";
import { DemoTierSwitch } from "./demo/DemoTierSwitch";
import { BabDemoTierSwitch } from "./bab/demo/BabDemoTierSwitch";

interface GuestTopBarProps {
  showDemoTierSwitch?: boolean;
  demoVertical?: "restaurant" | "bab";
}

export function GuestTopBar({
  showDemoTierSwitch,
  demoVertical = "restaurant",
}: GuestTopBarProps) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      {showDemoTierSwitch ? (
        demoVertical === "bab" ? (
          <BabDemoTierSwitch />
        ) : (
          <DemoTierSwitch />
        )
      ) : (
        <span />
      )}
      <div className="ml-auto flex items-center gap-2">
        <LanguageSwitcher />
        <ThemeToggle />
      </div>
    </div>
  );
}
