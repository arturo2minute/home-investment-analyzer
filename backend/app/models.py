# models.py
from sqlalchemy import Column, Integer, String, Float, Boolean
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Property(Base):
    __tablename__ = 'properties'

    id = Column(Integer, primary_key=True, index=True)
    listing_price = Column(Integer)
    address = Column(String)
    beds = Column(Float)
    baths = Column(Float)
    sqft = Column(Integer)
    lot_sqft = Column(Integer)
    home_type = Column(String)
    subtype = Column(String)
    year_built = Column(Integer)
    annual_tax = Column(Float)
    listing_terms = Column(String)
    has_hoa = Column(Boolean)
    sewer = Column(String)
    water = Column(String)
    utilities = Column(String)