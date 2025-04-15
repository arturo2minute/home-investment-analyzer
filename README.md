# Home Investment Analyzer (In progress...)

The **Home Investment Analyzer** is a web application that helps users evaluate real time real estate investment opportunities across multiple investment strategies such as:
- Buy & Live & Rent ( Live in property for initial two years)
- Buy & Rent
- Househacking
- BRRRR (Buy, Renovate, Rent, Refinance, Repeat)
- Fix & Flip
- Short-Term Rentals
- Commercial Real Estate

This project combines **React (frontend)**, **FastAPI (backend)**, and **AWS PostgreSQL (RDS)** to deliver a fast, flexible tool for analyzing properties scraped from Realtor.com.

------------------------------------------------------------------------------------------------------------------

## Previews
![image](https://github.com/user-attachments/assets/0aae4a41-2bf3-4b88-bff8-7b6271e0c10e)
![image](https://github.com/user-attachments/assets/2a25f814-705e-4251-8661-d27c9e8ca4bc)
![image](https://github.com/user-attachments/assets/6c92a026-3f5b-4bc1-9f92-0f27922a078f)

------------------------------------------------------------------------------------------------------------------

## Features

- Search properties by ZIP code
- Scrape data from Realtor.com using Home Harvest
- Choose from multiple investment strategies
- Analyze each property as a potential deals with formulas such as cash flow, ROI, CoC return, etc.
- Property previews using Realtor.com links (via Microlink)
- Mobile-responsive with collapsible sidebar navigation
- Real-time FastAPI backend with live property data

------------------------------------------------------------------------------------------------------------------

## Tech Stack

### Frontend:
- React + TailwindCSS
- React Router
- Axios

### Backend:
- FastAPI
- SQLAlchemy
- PostgreSQL (Amazon RDS)
- Microlink API (for property screenshots)
