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
    except:
        return []


# -------- SOURCE 2: FakeStore --------
def fetch_fakestore(query):
    try:
        url = "https://fakestoreapi.com/products"
        res = requests.get(url, timeout=5).json()

        items = []
        for p in res:
            if query.lower() in p["title"].lower():
                items.append({
                    "store": "FakeStore",
                    "title": p["title"],
                    "price": p["price"],
                    "rating": p.get("rating", {}).get("rate", 4.0),
                    "image": p.get("image", "")
                })
        return items[:4]
    except:
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

    # 🔁 Redis Cache
    if r:
        cached = r.get(cache_key)
        if cached:
            return json.loads(cached)

    results = []

    # Collect from APIs
    results.extend(fetch_dummyjson(query))
    results.extend(fetch_fakestore(query))

    # If no results → fallback
    if len(results) == 0:
        results = generated_results(query)

    # 🔽 Sort by price (important feature)
    results = sorted(results, key=lambda x: x["price"])

    response = {
        "query": query,
        "timestamp": str(datetime.utcnow()),
        "results": results[:6]
    }

    # Save cache
    if r:
        r.setex(cache_key, 300, json.dumps(response))

    return response


@app.get("/internal/history/{product_id}")
def history(product_id: str):
    base = random.randint(100, 700)

    return {
        "product_id": product_id,
        "history": [
            {"date": "04/01", "price": base + 40},
            {"date": "04/05", "price": base + 20},
            {"date": "04/10", "price": base}
        ]
    }