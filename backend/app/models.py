# models.py
import math
from sqlalchemy import Column, Integer, String, Float, Boolean, UniqueConstraint
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Property(Base):
    __tablename__ = "properties"
    
    id = Column(Integer, primary_key=True, index=True)
    address = Column(String, nullable=False)
    zipcode = Column(String, nullable=False)
    state = Column(String)
    city = Column(String)
    unit = Column(String)

    listing_price = Column(Integer)
    listing_date = Column(String)
    listing_terms = Column(String)
    status = Column(String)

    beds = Column(String)
    baths = Column(Float)
    sqft = Column(Integer)
    lot_size = Column(Float)
    year_built = Column(Integer)
    home_type = Column(String)
    subtype = Column(String)

    property_url = Column(String)
    mls = Column(String)
    mls_id = Column(String)
    sold_price = Column(Integer)
    last_sold_date = Column(String)

    price_per_sqft = Column(Float)
    latitude = Column(Float)
    longitude = Column(Float)
    stories = Column(Integer)

    has_hoa = Column(Boolean)
    hoa_fee = Column(Integer)
    parking_garage = Column(String)
    sewer = Column(String)
    water = Column(String)
    utilities = Column(String)
    annual_tax = Column(Float)

    __table_args__ = (
        UniqueConstraint('address', 'zipcode', name='uix_address_zipcode'),
    )
    
    
    def to_dict(self):
        return {
            "id": self.id,
            "address": self.address,
            "zipcode": self.zipcode,
            "city": self.city,
            "state": self.state,
            "listing_price": self.listing_price,
            "listing_date": self.listing_date,
            "listing_terms": self.listing_terms,
            "status": self.status,
            "beds": self.beds,
            "baths": self.baths,
            "sqft": self.sqft,
            "lot_size": self.lot_size,
            "year_built": self.year_built,
            "home_type": self.home_type,
            "subtype": self.subtype,
            "property_url": self.property_url,
            "mls": self.mls,
            "mls_id": self.mls_id,
            "sold_price": self.sold_price,
            "last_sold_date": self.last_sold_date,
            "price_per_sqft": self.price_per_sqft,
            "latitude": self.latitude,
            "longitude": self.longitude,
            "stories": self.stories,
            "has_hoa": self.has_hoa,
            "hoa_fee": self.hoa_fee,
            "parking_garage": self.parking_garage,
            "sewer": self.sewer,
            "water": self.water,
            "utilities": self.utilities,
            "annual_tax": self.annual_tax,
            "unit": self.unit,
        }