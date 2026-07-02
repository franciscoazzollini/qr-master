import Image from "next/image";

interface TableQRPreviewProps {
  tableId: string;
  qrDataUrl: string;
  tableUrl: string;
}

export function TableQRPreview({
  tableId,
  qrDataUrl,
  tableUrl,
}: TableQRPreviewProps) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-xl border border-border bg-surface-elevated p-3">
      <p className="text-xs font-semibold text-foreground">Table {tableId}</p>
      <Image
        src={qrDataUrl}
        alt={`Table ${tableId} QR`}
        width={96}
        height={96}
        unoptimized
        className="rounded-lg"
      />
      <p className="max-w-full truncate text-[10px] text-muted">{tableUrl}</p>
    </div>
  );
}
