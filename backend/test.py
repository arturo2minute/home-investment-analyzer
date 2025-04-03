from datetime import datetime
from homeharvest import scrape_property

timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")

location = '97478'
listing_type = 'for_sale' # {sold, for_sale, for_rent}
# alternative you can use
# date_from & date_to
past_days = 45

listings = scrape_property(
    location=location,
    listing_type=listing_type,
    past_days=past_days
)

filename = f"realator_{location}_{listing_type}_{timestamp}.csv"
listings.to_csv(filename, index=False)