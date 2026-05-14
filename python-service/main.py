from fastapi import FastAPI
from datetime import datetime
import requests
import redis
import json
import random

app = FastAPI()

try:
    r = redis.Redis(host="redis", port=6379, decode_responses=True)
    r.ping()
except:
    r = None


@app.get("/internal/health")
def health():
    return {
        "status": "Collector healthy",
        "redis": "connected" if r else "not connected"
    }


# -------- SOURCE 1: DummyJSON --------
def fetch_dummyjson(query):
    try:
        url = f"https://dummyjson.com/products/search?q={query}"

        res = requests.get(url, timeout=5).json()

        items = []

        for p in res.get("products", [])[:4]:
            items.append({
                "store": "DummyJSON",
                "title": p["title"],
                "price": p["price"],
                "rating": p.get("rating", 4.0),
                "image": p.get("thumbnail", "")
            })

        return items

    except Exception as e:
        print("DummyJSON Error:", e)
        return []


# -------- SOURCE 2: MercadoLibre --------
def fetch_mercadolibre(query):
    try:
        url = f"https://api.mercadolibre.com/sites/MLA/search?q={query}"

        res = requests.get(url, timeout=5).json()

        items = []

        for p in res.get("results", [])[:4]:
            items.append({
                "store": "MercadoLibre",
                "title": p.get("title", "Unknown Product"),
                "price": p.get("price", 0),
                "rating": 4.5,
                "image": p.get("thumbnail", "")
            })

        return items

    except Exception as e:
        print("MercadoLibre Error:", e)
        return []


# -------- FALLBACK GENERATOR --------
def generated_results(query):
    brands = ["PrimeTech", "NovaStore", "MarketHub"]

    results = []

    for i in range(3):
        results.append({
            "store": brands[i],
            "title": f"{query.title()} Model {i+1}",
            "price": random.randint(80, 900),
            "rating": round(random.uniform(3.5, 5.0), 1),
            "image": ""
        })

    return results


@app.get("/internal/prices")
def get_prices(q: str):
    query = q.strip()

    cache_key = f"prices:{query.lower()}"

    # Redis Cache
    if r:
        cached = r.get(cache_key)

        if cached:
            return json.loads(cached)

    results = []

    # Collect from APIs
    results.extend(fetch_dummyjson(query))
    results.extend(fetch_mercadolibre(query))

    # Fallback if no results
    if len(results) == 0:
        results = generated_results(query)

    # Sort by lowest price
    results = sorted(results, key=lambda x: x["price"])

    response = {
        "query": query,
        "timestamp": str(datetime.utcnow()),
        "results": results[:8]
    }

    # Save cache
    if r:
        r.setex(cache_key, 300, json.dumps(response))

    return response


@app.get("/internal/history/{product_id}")
def history(product_id: str):

    base = random.randint(100, 1000)

    history_data = []

    current_price = base

    for day in range(1, 8):

        change = random.randint(-50, 40)

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