# scraper.py
import math
import requests
from homeharvest import scrape_property

#--------------------------------- Helper Functions ---------------------------------

def safe_float(value):
    return None if value is None or (isinstance(value, float) and math.isnan(value)) else value

def bath_sum(a, b):
    """Safely adds two numbers, treating None/NaN as 0."""
    a = 0 if a is None or (isinstance(a, float) and math.isnan(a)) else a
    b = 0 if b is None or (isinstance(b, float) and math.isnan(b)) else b
    return a + (b * 0.5)

def remove_none(val):
    if not val:
        return "--"
    
    cleaned_words = []
    for word in str(val).split():
        if word.lower() != "none":
            cleaned_words.append(word)

    return " ".join(cleaned_words) if cleaned_words else "--"

def acres(lot_sqft):
    """
    Converts lot size in square feet to acres.
    1 acre = 43,560 square feet
    """
    if not lot_sqft or lot_sqft == 0:
        return 0

    try:
        acres = float(lot_sqft) / 43560
        return round(acres, 4)
    except (ValueError, TypeError):
        return None  # or "--"

#--------------------------------- Main Functions ---------------------------------
def scrape_redfin(zip_code: str):
    listing_type = 'for_sale'
    past_days = 35

    try:
        listings = scrape_property(
            location=zip_code,
            listing_type=listing_type,
            past_days=past_days
        )

        # Transform into list of dicts
        results = []
        for _, row in listings.iterrows():

            # Handle composite address
            street = row.get("street")
            unit = row.get("unit")
            city = row.get("city")
            address_parts = [part for part in [street, unit, city] if part and str(part).strip()]
            address = " ".join(address_parts) if address_parts else "--"

            results.append({
                "property_url": row.get("property_url"),
                "mls": row.get("mls"),
                "mls_id": row.get("mls_id"),
                "status": row.get("status"),
                "home_type": row.get("style"),
                "address": remove_none(row.get("street", "Unknown")),
                "unit": row.get("unit"),
                "city": row.get("city"),
                "state": row.get("state"),
                "zipcode": row.get("zip_code", zip_code),
                "beds": safe_float(row.get("beds")),
                "baths": safe_float(bath_sum(row.get("full_baths"), row.get("half_baths"))),
                "sqft": safe_float(row.get("sqft")),
                "year_built": safe_float(row.get("year_built")),
                "listing_price": row.get("list_price"),
                "listing_date": safe_float(row.get("list_date")),
                "sold_price": safe_float(row.get("sold_price")),
                "last_sold_date": row.get("last_sold_date"),
                "lot_sqft": acres(row.get("lot_sqft")),
                "price_per_sqft": safe_float(row.get("price_per_sqft")),
                "latitude": safe_float(row.get("latitude")),
                "longitude": safe_float(row.get("longitude")),
                "stories": safe_float(row.get("stories")),
                "hoa_fee": safe_float(row.get("hoa_fee")),
                "parking_garage": row.get("parking_garage"),
            })

        return results

    except Exception as e:
        print(f"[ERROR] Scraping failed: {e}")
        return []