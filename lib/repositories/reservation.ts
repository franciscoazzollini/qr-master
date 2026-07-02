import { nanoid } from "nanoid";
import { getSupabase } from "../supabase";
import type {
  CreateReservationInput,
  Reservation,
  ReservationStatus,
} from "../types";

interface ReservationRow {
  id: string;
  restaurant_id: string;
  guest_name: string;
  guest_phone: string;
  reservation_date: string;
  reservation_time: string;
  party_size: number;
  notes: string | null;
  status: ReservationStatus;
  created_at: string;
}

function mapRow(row: ReservationRow): Reservation {
  return {
    id: row.id,
    restaurantId: row.restaurant_id,
    guestName: row.guest_name,
    guestPhone: row.guest_phone,
    reservationDate: row.reservation_date,
    reservationTime: row.reservation_time.slice(0, 5),
    partySize: row.party_size,
    notes: row.notes,
    status: row.status,
    createdAt: row.created_at,
  };
}

export async function createReservation(
  restaurantId: string,
  input: CreateReservationInput,
): Promise<Reservation> {
  const supabase = getSupabase();
  const id = nanoid(12);

  const { data, error } = await supabase
    .from("reservations")
    .insert({
      id,
      restaurant_id: restaurantId,
      guest_name: input.guestName,
      guest_phone: input.guestPhone,
      reservation_date: input.reservationDate,
      reservation_time: input.reservationTime,
      party_size: input.partySize,
      notes: input.notes ?? null,
      status: "pending",
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapRow(data as ReservationRow);
}

export async function listReservations(
  restaurantId: string,
): Promise<Reservation[]> {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from("reservations")
    .select("*")
    .eq("restaurant_id", restaurantId)
    .order("reservation_date", { ascending: true })
    .order("reservation_time", { ascending: true })
    .limit(50);

  if (error) {
    throw new Error(error.message);
  }

  return (data as ReservationRow[]).map(mapRow);
}

export async function updateReservationStatus(
  restaurantId: string,
  reservationId: string,
  status: ReservationStatus,
): Promise<Reservation> {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from("reservations")
    .update({ status })
    .eq("id", reservationId)
    .eq("restaurant_id", restaurantId)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapRow(data as ReservationRow);
}
