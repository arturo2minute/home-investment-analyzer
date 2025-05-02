# Valora (In progress...)

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
![image](https://github.com/user-attachments/assets/0ed074c0-b30f-45fd-aaee-ad9ed82d420b)
![image](https://github.com/user-attachments/assets/978274a8-fda6-48f6-aced-a2fbb79c88d7)
![image](https://github.com/user-attachments/assets/180f9c03-b57e-4bfd-b58a-9c6b29ce1271)
![image](https://github.com/user-attachments/assets/e0151365-2801-4d69-9c9d-70eb4cb76195)

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
