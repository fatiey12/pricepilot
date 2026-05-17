from fastapi import FastAPI
from datetime import datetime
import requests
import redis
import json
import random
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service
app = FastAPI()

# =====================================================
# REDIS CONNECTION
# =====================================================
try:
    r = redis.Redis(
        host="redis",
        port=6379,
        decode_responses=True
    )

    r.ping()

except:
    r = None


# =====================================================
# HEALTH CHECK
# =====================================================
@app.get("/internal/health")
def health():

    return {
        "status": "Collector healthy",
        "redis": "connected" if r else "not connected"
    }


# =====================================================
# BOOKS TO SCRAPE 
# =====================================================
def scrape_books(query):

    try:

        headers = {
            "User-Agent":
            (
                "Mozilla/5.0 "
                "(Windows NT 10.0; Win64; x64)"
            )
        }

        url = "https://books.toscrape.com/"

        response = requests.get(
            url,
            headers=headers,
            timeout=10
        )

        print(
            "Books Status:",
            response.status_code
        )

        soup = BeautifulSoup(
            response.text,
            "html.parser"
        )

        books = soup.find_all(
            "article",
            class_="product_pod"
        )

        print(
            "Books Found:",
            len(books)
        )

        items = []

        for book in books:

            title = (
                book.h3.a["title"]
            )

            
            if query.lower() not in title.lower():
             continue

            price_tag = book.find(
                "p",
                class_="price_color"
            )

            image_tag = book.find("img")

            if not price_tag:
                continue

            price_text = price_tag.text

            clean_price = ""

            for c in price_text:
             if c.isdigit() or c == ".":
              clean_price += c

            if clean_price == "":
             continue

            price = float(clean_price)

            image = (
                "https://books.toscrape.com/"
                + image_tag["src"]
            )

            items.append({
                "store": "BooksToScrape",
                "title": title,
                "price": price,
                "rating": round(
                    random.uniform(3.5, 5.0),
                    1
                ),
                "image": image
            })

        print(
            "Books Results:",
            len(items)
        )

        return items[:8]

    except Exception as e:

        print(
            "Books Error:",
            e
        )

        return []
# =====================================================
# WEB SCRAPING SOURCE — 
# =====================================================
def scrape_webscraper(query):

    try:

        headers = {
            "User-Agent":
            (
                "Mozilla/5.0 "
                "(Windows NT 10.0; Win64; x64)"
            )
        }

        url = (
                      "https://webscraper.io/"
    "test-sites/e-commerce/allinone/computers/laptops"
)
        

        response = requests.get(
            url,
            headers=headers,
            timeout=10
        )

        print(
            "WebScraper Status:",
            response.status_code
        )

        soup = BeautifulSoup(
            response.text,
            "html.parser"
        )

        products = soup.select(
            ".thumbnail"
        )

        print(
            "WebScraper Products Found:",
            len(products)
        )

        items = []

        for p in products:

            title_tag = p.select_one(
                ".title"
            )

            price_tag = p.select_one(
                ".price"
            )

            image_tag = p.select_one(
                "img"
            )

            if not title_tag or not price_tag:
                continue

            title = (
                title_tag.get("title", "")
            )

            if (
                query.lower()
                not in title.lower()
            ):
                continue

            price_text = (
                price_tag.text
            )

            clean_price = ""

            for c in price_text:
                if c.isdigit() or c == ".":
                    clean_price += c

            if clean_price == "":
                continue

            image = (
                "https://webscraper.io"
                + image_tag["src"]
                if image_tag else ""
            )

            items.append({
                "store": "WebScraper.io",
                "title": title,
                "price": float(clean_price),
                "rating": round(
                    random.uniform(3.5, 5.0),
                    1
                ),
                "image": image
            })

        print(
            "WebScraper Results:",
            len(items)
        )

        return items[:8]

    except Exception as e:

        print(
            "WebScraper Error:",
            e
        )

        return []
# =====================================================

def scrape_amazon(query):

    try:

        from selenium import webdriver
        from selenium.webdriver.chrome.options import Options
        from selenium.webdriver.common.by import By
        from selenium.webdriver.support.ui import WebDriverWait
        from selenium.webdriver.support import expected_conditions as EC

        headers_user_agent = (
            "Mozilla/5.0 "
            "(Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 "
            "(KHTML, like Gecko) "
            "Chrome/120.0 Safari/537.36"
        )

        options = Options()

        options.binary_location = "/usr/bin/chromium"

        options.add_argument("--headless=new")
        options.add_argument("--no-sandbox")
        options.add_argument("--disable-dev-shm-usage")
        options.add_argument(
    "--disable-blink-features=AutomationControlled"
)

        options.add_experimental_option(
    "excludeSwitches",
    ["enable-automation"]
)

        options.add_experimental_option(
    "useAutomationExtension",
    False
)
        options.add_argument(
            f"user-agent={headers_user_agent}"
        )

        driver = webdriver.Chrome(options=options)

        url = (
            f"https://www.amazon.com/s?rh=n%3A172282&q={query}"
        )

        print("Opening Amazon:", url)

        driver.get(url)
        import time
        time.sleep(5)
        # WAIT FOR PRODUCTS TO LOAD
        WebDriverWait(driver, 15).until(
            EC.presence_of_element_located(
                (
                    By.CSS_SELECTOR,
                    'div[data-component-type="s-search-result"]'
                )
            )
        )

        html = driver.page_source
        print(html[:5000])
        soup = BeautifulSoup(
            html,
            "html.parser"
        )

        driver.quit()

        item_selector = (
            'div[data-component-type="s-search-result"]'
        )

        title_selector = "h2 span"

        price_selector = (
            "span.a-price > span.a-offscreen"
        )

        rating_selector = "span.a-icon-alt"

        image_selector = "img"

        products = soup.select(item_selector)

        print(
            "Amazon Products Found:",
            len(products)
        )

        items = []

        for item in products[:10]:

            title_el = item.select_one(
                title_selector
            )

            price_el = item.select_one(
                price_selector
            )

            rating_el = item.select_one(
                rating_selector
            )

            image_el = item.select_one(
                image_selector
            )

            if not title_el:
                continue

            if not price_el:
                continue

            title = (
                title_el.get_text(strip=True)
            )

            price_text = (
                price_el.get_text(strip=True)
            )

            clean_price = ""

            for c in price_text:
                if c.isdigit() or c == ".":
                    clean_price += c

            if clean_price == "":
                continue

            try:
                price = float(clean_price)

            except:
                continue

            rating = (
                rating_el.get_text(strip=True)
                if rating_el else "4.0"
            )

            image = (
                image_el["src"]
                if image_el else ""
            )

            items.append({

                "store": "Amazon",

                "title": title,

                "price": price,

                "rating": rating,

                "image": image
            })

        print(
            "Amazon Results:",
            len(items)
        )

        return items

    except Exception as e:

        print(
            "Amazon Error:",
            e
        )

        return []
# DATA PREPROCESSING
# =====================================================
def preprocess_results(results):

    cleaned = []

    seen_titles = set()

    for item in results:

        # Remove invalid prices
        if item["price"] <= 0:
            continue

        # Deduplicate products
        normalized_title = (
            item["title"]
            .lower()
            .strip()
        )

        if normalized_title in seen_titles:
            continue

        seen_titles.add(
            normalized_title
        )

        cleaned.append(item)

    # Sort by lowest price
    cleaned = sorted(
        cleaned,
        key=lambda x: x["price"]
    )

    return cleaned


# =====================================================
# MAIN AGGREGATION ENDPOINT
# =====================================================
@app.get("/internal/prices")
def get_prices(q: str):

    query = q.strip()

    cache_key = (
        f"prices:{query.lower()}"
    )

    # =================================================
    # REDIS CACHE CHECK
    # =================================================
    if r:

        cached = r.get(cache_key)

        if cached:

            return json.loads(cached)

    results = []

    results.extend(scrape_webscraper(query))
    results.extend(scrape_books(query))
    results.extend(scrape_amazon(query))

    # =================================================
    # DATA PREPROCESSING
    # =================================================
    processed_results = preprocess_results(
        results
    )

    response = {
        "query": query,
        "timestamp": str(
            datetime.utcnow()
        ),
        "total_results":
            len(processed_results),
        "results":
            processed_results[:12]
    }

    # =================================================
    # CACHE SAVE
    # =================================================
    if r:

        r.setex(
            cache_key,
            300,
            json.dumps(response)
        )

    return response


# =====================================================
# PRICE HISTORY ANALYTICS
# =====================================================
@app.get("/internal/history/{product_id}")
def history(product_id: str):

    base = random.randint(
        100,
        1000
    )

    history_data = []

    current_price = base

    for day in range(1, 8):

        change = random.randint(
            -50,
            40
        )

        current_price += change

        if current_price < 50:
            current_price = 50

        history_data.append({
            "date": f"04/0{day}",
            "price": current_price
        })

    return {
        "product_id": product_id,
        "history": history_data
    }