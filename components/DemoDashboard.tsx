"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { AppHeader } from "@/components/AppHeader";
import { CopyLinkButton } from "@/components/CopyLinkButton";
import { QRDisplay } from "@/components/QRDisplay";
import { TableQRPreview } from "@/components/TableQRPreview";
import {
  RestaurantForm,
  type RestaurantFormValues,
} from "@/components/RestaurantForm";

interface TableQRItem {
  tableId: string;
  qrDataUrl: string;
  tableUrl: string;
}

interface DemoDashboardProps {
  initialValues: RestaurantFormValues;
  publicUrl: string;
  qrDataUrl: string;
  tableQRs: TableQRItem[];
}

export function DemoDashboard({
  initialValues,
  publicUrl,
  qrDataUrl,
  tableQRs,
}: DemoDashboardProps) {
  const t = useTranslations("dashboard");
  const tDemo = useTranslations("demo.dashboard");
  const tCommon = useTranslations("common");
  const [demoNotice, setDemoNotice] = useState(false);

  const handleSubmit = async () => {
    setDemoNotice(true);
    setTimeout(() => setDemoNotice(false), 3000);
  };

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <AppHeader backHref="/guide" backLabel={tCommon("back")} />

        <div className="rounded-2xl border border-accent/30 bg-accent/10 px-4 py-3 text-sm font-medium text-foreground">
          {tDemo("banner")}
        </div>

        <div>
          <h1 className="text-3xl font-bold text-foreground">{tDemo("title")}</h1>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="flex flex-col gap-6">
            <CopyLinkButton url={publicUrl} />
            <Link
              href="/r/demo"
              className="text-sm font-medium text-accent hover:underline"
              target="_blank"
            >
              {t("viewPage")} →
            </Link>
            <QRDisplay dataUrl={qrDataUrl} restaurantName={initialValues.name} />

            <div>
              <h2 className="text-lg font-semibold text-foreground">
                {tDemo("tableQrTitle")}
              </h2>
              <p className="mt-1 text-sm text-muted">{tDemo("tableQrHint")}</p>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {tableQRs.map((item) => (
                  <TableQRPreview key={item.tableId} {...item} />
                ))}
              </div>
              <Link
                href="/r/demo/table/12"
                className="mt-3 inline-block text-sm font-medium text-accent hover:underline"
              >
                Try table 12 demo →
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-6">
            <RestaurantForm
              initialValues={initialValues}
              submitLabel={tCommon("save")}
              onSubmit={handleSubmit}
            />
            {demoNotice ? (
              <p className="mt-4 rounded-xl border border-border bg-surface-elevated px-4 py-3 text-sm text-muted">
                {tDemo("saveDisabled")}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
