# scraper.py
import requests
from bs4 import BeautifulSoup

def scrape_redfin(zip_code):
    url = f"https://www.redfin.com/zipcode/{zip_code}"
    headers = {"User-Agent": "Mozilla/5.0"}
    response = requests.get(url, headers=headers)

    if response.status_code == 200:
        soup = BeautifulSoup(response.text, 'html.parser')
        # Identify and print listing block samples
        print(soup.prettify()[:1000])