import pandas as pd
# Load the uploaded dataset
uploaded_location_path = "JOBDATASET_SENTTO_CESAR_V2.csv"
df_jobdata_v1 = pd.read_csv(uploaded_location_path)

# Create mapping of full state names to abbreviations
state_abbr_map = {
    'Alabama': 'AL', 'Alaska': 'AK', 'Arizona': 'AZ', 'Arkansas': 'AR', 'California': 'CA',
    'Colorado': 'CO', 'Connecticut': 'CT', 'Delaware': 'DE', 'Florida': 'FL', 'Georgia': 'GA',
    'Hawaii': 'HI', 'Idaho': 'ID', 'Illinois': 'IL', 'Indiana': 'IN', 'Iowa': 'IA', 'Kansas': 'KS',
    'Kentucky': 'KY', 'Louisiana': 'LA', 'Maine': 'ME', 'Maryland': 'MD', 'Massachusetts': 'MA',
    'Michigan': 'MI', 'Minnesota': 'MN', 'Mississippi': 'MS', 'Missouri': 'MO', 'Montana': 'MT',
    'Nebraska': 'NE', 'Nevada': 'NV', 'New Hampshire': 'NH', 'New Jersey': 'NJ', 'New Mexico': 'NM',
    'New York': 'NY', 'North Carolina': 'NC', 'North Dakota': 'ND', 'Ohio': 'OH', 'Oklahoma': 'OK',
    'Oregon': 'OR', 'Pennsylvania': 'PA', 'Rhode Island': 'RI', 'South Carolina': 'SC',
    'South Dakota': 'SD', 'Tennessee': 'TN', 'Texas': 'TX', 'Utah': 'UT', 'Vermont': 'VT',
    'Virginia': 'VA', 'Washington': 'WA', 'West Virginia': 'WV', 'Wisconsin': 'WI', 'Wyoming': 'WY',
    'District of Columbia': 'DC'
}

# Convert "State, City" to "City, ST"
def format_location(loc):
    try:
        parts = loc.split(",")
        if len(parts) == 2:
            state_full = parts[0].strip()
            city = parts[1].strip()
            state_abbr = state_abbr_map.get(state_full, state_full)
            return f"{city}, {state_abbr}"
    except Exception:
        pass
    return loc


i = 1000000

def otherformat(loc):
    global i 
    i += 1
    print(i)
    return i


# Apply transformation
df_jobdata_v1["id"] = df_jobdata_v1["id"].apply(otherformat)

# Save the updated CSV
converted_location_path = "JOBDATASET_SENTTO_CESAR_V2_.csv"
df_jobdata_v1.to_csv(converted_location_path, index=False)

converted_location_path
