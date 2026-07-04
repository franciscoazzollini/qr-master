export type RestaurantTier = "free" | "pro";

export type AllergenId =
  | "gluten"
  | "dairy"
  | "nuts"
  | "eggs"
  | "fish"
  | "shellfish"
  | "vegan";

export type DayOfWeek =
  | "mon"
  | "tue"
  | "wed"
  | "thu"
  | "fri"
  | "sat"
  | "sun";

export interface DayHours {
  open: string;
  close: string;
}

export interface RestaurantWifi {
  ssid: string;
  password: string;
}

export interface DailySpecial {
  title: string;
  description: string;
  price?: string;
  active: boolean;
}

export interface HostedMenuItem {
  id: string;
  name: string;
  description: string;
  price: string;
  imageSrc: string;
  tag?: string;
  allergens?: AllergenId[];
}

export interface HostedMenuSection {
  id: string;
  title: string;
  subtitle: string;
  coverImage: string;
  items: HostedMenuItem[];
}

export interface HostedMenu {
  sections: HostedMenuSection[];
}

export interface RestaurantSettings {
  wifi?: RestaurantWifi;
  openingHours?: Partial<Record<DayOfWeek, DayHours | null>>;
  dailySpecial?: DailySpecial;
  kitchenWhatsApp?: string;
  tableCount?: number;
  customDomain?: string;
  hostedMenu?: HostedMenu;
  venueDirections?: {
    title?: string;
    steps: string[];
  };
  reservationsEnabled?: boolean;
}

export interface RestaurantLinks {
  menu?: string;
  googleMaps?: string;
  instagram?: string;
  whatsapp?: string;
  payment?: string;
  tip?: string;
}

export interface Restaurant {
  id: string;
  name: string;
  logoUrl?: string | null;
  primaryColor: string;
  locale: string;
  links: RestaurantLinks;
  settings: RestaurantSettings;
  editToken: string;
  tier: RestaurantTier;
  createdAt: string;
  updatedAt: string;
}

export interface PublicRestaurant {
  id: string;
  name: string;
  logoUrl?: string | null;
  primaryColor: string;
  locale: string;
  links: RestaurantLinks;
  settings: RestaurantSettings;
  tier: RestaurantTier;
}

export interface CreateRestaurantInput {
  name: string;
  logoUrl?: string;
  primaryColor?: string;
  locale?: string;
  links?: RestaurantLinks;
  settings?: RestaurantSettings;
}

export interface UpdateRestaurantInput {
  name?: string;
  logoUrl?: string | null;
  primaryColor?: string;
  locale?: string;
  links?: RestaurantLinks;
  settings?: RestaurantSettings;
}

export type LinkKey = keyof RestaurantLinks;

export type ReservationStatus = "pending" | "confirmed" | "cancelled";

export interface Reservation {
  id: string;
  restaurantId: string;
  guestName: string;
  guestPhone: string;
  reservationDate: string;
  reservationTime: string;
  partySize: number;
  notes?: string | null;
  status: ReservationStatus;
  createdAt: string;
}

export interface CreateReservationInput {
  guestName: string;
  guestPhone: string;
  reservationDate: string;
  reservationTime: string;
  partySize: number;
  notes?: string;
}

export interface ViewCounts {
  total7d: number;
  total30d: number;
  topPaths: { path: string; count: number }[];
}

export interface RestaurantMetrics {
  viewsToday: number;
  views7d: number;
  views30d: number;
  viewsPrev7d: number;
  viewsTrend: number;
  reservations7d: number;
  reservationsPending: number;
  reservationsConfirmed: number;
  covers7d: number;
  upcomingReservations: number;
  conversionRate: number;
  reservationsTrend: number;
  coversTrend: number;
  payments7d: number;
  paymentsTrend: number;
  avgTicket: number;
  avgTicketTrend: number;
  funnel: {
    outsideScans: number;
    scans: number;
    menuViews: number;
    reservations: number;
    payments: number;
  };
  actions: {
    outside: number;
    landing: number;
    menu: number;
    reserve: number;
    table: number;
    payment: number;
  };
  viewsByDay: { date: string; count: number }[];
  prevWeekViewsByDay: { date: string; count: number }[];
}
