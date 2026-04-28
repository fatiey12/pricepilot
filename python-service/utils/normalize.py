def normalize_prices(prices):
    normalized = []

    for item in prices:
        if item["currency"] == "EUR":
            item["price"] = round(item["price"] * 1.08, 2)
            item["currency"] = "USD"

        normalized.append(item)

    return normalized