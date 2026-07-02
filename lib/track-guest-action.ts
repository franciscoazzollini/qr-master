export function trackGuestAction(restaurantId: string, action: string): void {
  fetch(`/api/restaurants/${restaurantId}/analytics`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path: `/action/${action}` }),
  }).catch(() => {});
}
