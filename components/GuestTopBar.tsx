"use client";

import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeToggle } from "./ThemeToggle";
import { DemoTierSwitch } from "./demo/DemoTierSwitch";

interface GuestTopBarProps {
  showDemoTierSwitch?: boolean;
}

export function GuestTopBar({ showDemoTierSwitch }: GuestTopBarProps) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      {showDemoTierSwitch ? <DemoTierSwitch /> : <span />}
      <div className="ml-auto flex items-center gap-2">
        <LanguageSwitcher />
        <ThemeToggle />
      </div>
    </div>
  );
}
