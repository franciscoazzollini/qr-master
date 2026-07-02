"use client";

import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeToggle } from "./ThemeToggle";

export function GuestTopBar() {
  return (
    <div className="flex items-center justify-end gap-2">
      <LanguageSwitcher />
      <ThemeToggle />
    </div>
  );
}
