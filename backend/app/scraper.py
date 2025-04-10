# scraper.py
import math
import requests
from homeharvest import scrape_property

#--------------------------------- Helper Functions ---------------------------------

def safe_float(val):
    return 0.0 if val is None or (isinstance(val, float) and math.isnan(val)) else float(val)

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

def acres(lot_size):
    """
    Converts lot size in square feet to acres.
    1 acre = 43,560 square feet
    """
    if not lot_size or lot_size == 0:
        return 0

    try:
        acres = float(lot_size) / 43560
        return round(acres, 4)
    except (ValueError, TypeError):
        return None  # or "--"

def land_type(type):
    if type == "MOBILE":
        return "Mobile"
    elif type == "SINGLE_FAMILY":
        return "Single Family"
    elif type == "LAND":
        return "Land"
    elif type == "MULTI_FAMILY":
        return "Multi Family"

def add_dash(val):
    if val == None or val == "" or val == " ":
        return "--"
    return val

#--------------------------------- Main Functions ---------------------------------
def scrape_redfin(zip_code: str, listingtype: str, pastdays: int):

    try:
        listings = scrape_property(
            location=zip_code,
            listing_type=listingtype,
            past_days=pastdays
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
                "home_type": land_type(row.get("style")),
                "address": remove_none(row.get("street", "Unknown")),
                "unit": row.get("unit"),
                "city": row.get("city"),
                "state": row.get("state"),
                "zipcode": row.get("zip_code", zip_code),
                "beds": safe_float(row.get("beds")),
                "baths": bath_sum(row.get("full_baths"), row.get("half_baths")),
                "sqft": safe_float(row.get("sqft")),
                "year_built": add_dash(row.get("year_built")),
                "listing_price": safe_float(row.get("list_price")),
                "listing_date": row.get("list_date"),
                "sold_price": safe_float(row.get("sold_price")),
                "last_sold_date": row.get("last_sold_date"),
                "lot_size": acres(row.get("lot_size")),
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