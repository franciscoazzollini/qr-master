export {
  buildTableWhatsAppUrl,
  getTablePath,
  type TableServiceIntent,
} from "../table-service";

export function getDemoTablePath(tableId: string): string {
  return `/r/demo/table/${tableId}`;
}
