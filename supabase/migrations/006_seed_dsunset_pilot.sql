-- D'Sunset Beach pilot restaurant (no owner until they sign up via magic link)
-- Public: /r/dsunset-beach  |  Outside: /r/dsunset-beach/outside
-- Link to owner: UPDATE restaurants SET owner_id = '<uuid>' WHERE id = 'dsunset-beach';

insert into restaurants (
  id,
  slug,
  name,
  logo_url,
  primary_color,
  locale,
  links,
  settings,
  edit_token,
  tier,
  owner_id
) values (
  'dsunset-beach',
  'dsunset-beach',
  'D''Sunset Beach',
  '/demo/logo.jpg',
  '#e07a3a',
  'en',
  '{
    "menu": "https://example.com/menu.pdf",
    "googleMaps": "https://maps.google.com/?q=D+Sunset+Beach+Restaurant",
    "instagram": "https://instagram.com",
    "whatsapp": "https://wa.me/34600000000",
    "payment": "https://stripe.com",
    "tip": "https://buy.stripe.com/test_tip"
  }'::jsonb,
  '{
    "wifi": { "ssid": "DSunset_Guest", "password": "welcome2024" },
    "openingHours": {
      "mon": { "open": "12:00", "close": "23:00" },
      "tue": { "open": "12:00", "close": "23:00" },
      "wed": { "open": "12:00", "close": "23:00" },
      "thu": { "open": "12:00", "close": "23:00" },
      "fri": { "open": "12:00", "close": "00:00" },
      "sat": { "open": "11:00", "close": "00:00" },
      "sun": { "open": "11:00", "close": "22:00" }
    },
    "reservationsEnabled": true,
    "kitchenWhatsApp": "34600000000",
    "tableCount": 12,
    "customDomain": "dsunset.menuhub.app",
    "venueDirections": {
      "title": "How to find us",
      "steps": [
        "Locate the hotel main entrance on the street.",
        "Enter through the ground-floor supermarket (main public entrance).",
        "Take the elevator or stairs to the 1st floor.",
        "Follow the signs to D''Sunset Beach."
      ]
    }
  }'::jsonb,
  'dsunset-pilot-change-me',
  'pro',
  null
) on conflict (id) do nothing;
