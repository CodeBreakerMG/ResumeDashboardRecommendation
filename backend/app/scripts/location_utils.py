import pandas as pd
import random

# Load the CSV once at module level
city_df = pd.read_csv("data/us_cities.csv")

# Get a random city location
def get_random_location():
    row = city_df.sample(1).iloc[0]
    return {
        "city": row["city"],
        "state": row["state"],
        "lat": float(row["latitude"]),
        "lng": float(row["longitude"]),
    }
