import re
import spacy
import csv
import nltk
from wordcloud import WordCloud
from collections import Counter
import numpy as np
import torch
import pandas as pd
import faiss
from transformers import DistilBertTokenizer, DistilBertModel, AutoTokenizer, AutoModel
from dateparser import parse as parse_date
from dateutil import parser
from datetime import datetime

nltk.download('punkt')

nlp = spacy.load('en_core_web_sm')

def load_keywords(file_path):
    with open(file_path, 'r') as file:
        reader = csv.reader(file)
        return set(row[0].lower() for row in reader)
    
# ----------------------------------Extract Name----------------------------------
def extract_name(doc):
    for ent in doc.ents:
        if ent.label_ == 'PERSON':
            names = ent.text.split()
            if len(names) >= 2 and names[0].istitle() and names[1].istitle():
                return names[0], ' '.join(names[1:])
    return "", ""
# --------------------------------------------------------------------------------

# ----------------------------------Extract Email---------------------------------
def extract_email(doc):
    matcher = spacy.matcher.Matcher(nlp.vocab)
    email_pattern = [{'LIKE_EMAIL': True}]
    matcher.add('EMAIL', [email_pattern])

    matches = matcher(doc)
    for match_id, start, end in matches:
        if match_id == nlp.vocab.strings['EMAIL']:
            return doc[start:end].text
    return ""
# --------------------------------------------------------------------------------

# ----------------------------------Extract Ph No---------------------------------
def extract_contact_number_from_resume(doc):
    contact_number = None
    text = doc.text  # Extract text from SpaCy doc object
    pattern = r"\b(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b"
    match = re.search(pattern, text)
    if match:
        contact_number = match.group()
    return contact_number
# --------------------------------------------------------------------------------

# --------------------------------Extract Education-------------------------------
def extract_education_from_resume(doc):
    universities = []

    # Process the document with spaCy
    doc = nlp(doc)

    # Iterate through entities and check for organizations (universities)
    for entity in doc.ents:
        if entity.label_ == "ORG" and ("university" in entity.text.lower() or "college" in entity.text.lower() or "institute" in entity.text.lower()):
            universities.append(entity.text)

    return universities
# --------------------------------------------------------------------------------

# ----------------------------------Extract Skills--------------------------------
def csv_skills(doc):
    skills_keywords = load_keywords('data/newSkills.csv')
    skills = {}

    # Loop through each keyword in document
    for token in doc:
        if token.text.lower() in skills_keywords:
            # If the keyword is found, increment its count in the dictionary
            skills[token.text.lower()] = skills.get(token.text.lower(), 0) + 1
            
    for keyword in skills_keywords:
        if keyword.lower() in doc.text.lower():
            # If the keyword is found, increment its count in the dictionary
            skills[keyword.lower()] = skills.get(keyword.lower(), 0) + 1

    return skills

def is_valid_skill(skill_text):
    # Define criteria for valid skills (modify/add criteria as needed)
    return len(skill_text) > 1 and not any(char.isdigit() for char in skill_text)

def extract_skills(doc):
    skills_csv = csv_skills(doc)
    filtered_skills_csv = {skill: freq for skill, freq in skills_csv.items() if is_valid_skill(skill)}
    return list(filtered_skills_csv.keys()), filtered_skills_csv

# --------------------------------------------------------------------------------

# ----------------------------------Extract Major---------------------------------
def extract_major(doc):
    major_keywords = load_keywords('data/majors.csv')

    for keyword in major_keywords:
        if keyword.lower() in doc.text.lower():
            return keyword

    return ""
# --------------------------------------------------------------------------------

# --------------------------------Extract Experience-------------------------------
    
# Heuristic mapping based on years
def estimate_level_from_years(years):
    if years >= 12:
        return "Executive"
    elif years >= 8:
        return "Director"
    elif years >= 4:
        return "Mid-Senior level"
    elif years >= 1:
        return "Associate"
    else:
        return "Entry level"

# Try to extract roles based on patterns
def extract_job_titles(text):
    patterns = [
        r"(Intern|Internship|Trainee|Apprentice)",
        # Engineering & Technical roles
        r"(Software Engineer|Data Scientist|ML Engineer|AI Engineer|DevOps Engineer|Backend Engineer|Frontend Engineer|Full Stack Developer|Embedded Engineer|Systems Engineer|Site Reliability Engineer|Cloud Engineer|Data Engineer|Research Engineer|Platform Engineer|Security Engineer)",
        # Analyst & Data roles
        r"(Data Analyst|Business Analyst|Financial Analyst|Product Analyst|Operations Analyst|BI Analyst|Quantitative Analyst)",
        # Product & Project roles
        r"(Product Manager|Project Manager|Program Manager|Scrum Master|Agile Coach)",
        # Leadership roles
        r"(Team Lead|Tech Lead|Manager|Director|VP|Vice President|CTO|CIO|CEO|COO|Chief Product Officer|Chief Data Officer|Founder|Co-Founder|Managing Director|Head of Engineering|Head of Product|Engineering Manager|Principal Engineer)",
        # UX/UI & Design
        r"(UX Designer|UI Designer|UX/UI Designer|Product Designer|Graphic Designer|Visual Designer|Interaction Designer|Design Lead)",
        # Business & Strategy
        r"(Strategy Consultant|Management Consultant|Business Consultant|Growth Manager|Business Development Manager|Sales Manager|Marketing Manager|Account Executive|Customer Success Manager|Operations Manager|Engagement Manager)",
        # Academic & Research
        r"(Research Assistant|Teaching Assistant|Graduate Researcher|Postdoctoral Researcher|Lecturer|Professor|PhD Student|Master’s Student|Research Fellow|Visiting Scholar)",
        # Science and Industrial roles
        r"(Mechanical Engineer|Electrical Engineer|Chemical Engineer|Biomedical Engineer|Civil Engineer|Industrial Engineer|Environmental Engineer)",
        # Miscellaneous
        r"(Content Writer|Technical Writer|Journalist|Editor|Translator|Customer Support Specialist|QA Engineer|Test Engineer|Automation Engineer|IT Support Specialist|Network Engineer|Database Administrator|Solutions Architect|Enterprise Architect)"
    ]

    matches = []
    for pattern in patterns:
        matches.extend(re.findall(pattern, text, re.IGNORECASE))

    # Remove empty or partial matches and format nicely
    cleaned = [match.strip() for match in matches if match and isinstance(match, str)]
    return list(set(cleaned))       

def extract_experience_years(text):
    current_year = datetime.now().year

    # Define patterns for real job titles (excluding intern roles)
    job_keywords = [
    # 🚀 Technology & Engineering
    "Software Engineer", "Frontend Developer", "Backend Developer", "Full Stack Developer",
    "Data Scientist", "Machine Learning Engineer", "AI Researcher", "Deep Learning Engineer",
    "Computer Vision Engineer", "NLP Engineer", "Data Engineer", "DevOps Engineer",
    "Cloud Engineer", "Site Reliability Engineer", "QA Engineer", "Automation Engineer",
    "Embedded Systems Engineer", "Security Analyst", "Cybersecurity Engineer", "Blockchain Developer",
    "AR/VR Developer", "Game Developer", "Mobile App Developer", "iOS Developer", "Android Developer",
    "Web Developer", "Network Engineer", "Database Administrator", "Systems Engineer",
    "Firmware Engineer", "Hardware Engineer", "Solutions Architect", "Technical Support Engineer",

    # 📊 Business, Product & Project
    "Project Manager", "Product Manager", "Business Analyst", "Product Owner",
    "Scrum Master", "Program Manager", "Business Intelligence Analyst", "Growth Hacker",
    "Operations Manager", "Strategy Consultant", "Risk Analyst", "Account Manager",

    # 📈 Marketing, Sales & Content
    "Marketing Manager", "Digital Marketing Specialist", "SEO Specialist", "Content Strategist",
    "Social Media Manager", "Performance Marketer", "Brand Manager", "Copywriter",
    "Email Marketing Specialist", "Affiliate Manager", "Sales Executive", "Sales Engineer",
    "Customer Success Manager", "Account Executive", "Lead Generation Specialist",

    # 🎨 Design & Creative
    "UX Designer", "UI Designer", "Graphic Designer", "Visual Designer", "Motion Designer",
    "Product Designer", "Interaction Designer", "Creative Director", "Illustrator",
    "Art Director", "Animation Designer", "3D Artist", "Game Designer", "Video Editor",

    # 🧪 Science & Research
    "Research Scientist", "Data Analyst", "Statistician", "Bioinformatician",
    "Environmental Scientist", "Chemist", "Physicist", "Clinical Researcher",
    "Lab Technician", "Mathematician", "Epidemiologist",

    # 🏥 Healthcare & Medicine
    "Doctor", "Nurse", "Pharmacist", "Physician Assistant", "Medical Technician",
    "Dentist", "Therapist", "Psychologist", "Nutritionist", "Radiologist",
    "Surgeon", "Healthcare Administrator", "Paramedic", "Optometrist", "Occupational Therapist",

    # 🏛️ Education & Academia
    "Teacher", "Professor", "Lecturer", "Instructional Designer", "Curriculum Developer",
    "Academic Advisor", "Education Coordinator", "School Counselor", "Librarian", "Tutor",

    # 🧑‍⚖️ Legal & Compliance
    "Lawyer", "Legal Assistant", "Paralegal", "Compliance Officer", "Contract Manager",
    "Judge", "Corporate Counsel", "Legal Consultant", "Regulatory Specialist",

    # 🏢 Finance & Accounting
    "Financial Analyst", "Accountant", "Auditor", "Controller", "Treasury Analyst",
    "Tax Consultant", "Investment Banker", "Portfolio Manager", "Actuary", "Bookkeeper",
    "Risk Manager", "Credit Analyst", "Compliance Analyst", "Wealth Manager",

    # 🔧 Skilled Trades & Logistics
    "Electrician", "Plumber", "Mechanic", "Construction Worker", "Carpenter",
    "HVAC Technician", "Welder", "Truck Driver", "Forklift Operator", "Warehouse Manager",
    "Supply Chain Analyst", "Inventory Manager", "Logistics Coordinator",

    # 🛍️ Hospitality & Services
    "Chef", "Waiter", "Hotel Manager", "Receptionist", "Event Planner", "Housekeeper",
    "Customer Service Representative", "Travel Agent", "Flight Attendant", "Bartender",

    # 🎭 Arts, Media & Entertainment
    "Journalist", "News Reporter", "Radio Host", "TV Anchor", "Author", "Editor",
    "Photographer", "Filmmaker", "Actor", "Musician", "Sound Engineer", "Music Producer",

    # 🧘 Wellness & Fitness
    "Fitness Trainer", "Yoga Instructor", "Life Coach", "Wellness Coach", "Chiropractor",
    "Massage Therapist", "Physical Therapist", "Recreational Therapist"]

    job_pattern = re.compile('|'.join([re.escape(title) for title in job_keywords]), re.IGNORECASE)

    # Skip internships
    internship_pattern = re.compile(r"\bInternship\b|\bIntern\b", re.IGNORECASE)

    # Skip educational institutions
    education_keywords = ["University", "College", "Bachelor", "Master", "PhD", "B.Tech", "M.Tech", "High School", "Academy"]

    # Extract date ranges like "2018 - 2020" or "May 2016 to Jan 2018"
    date_range_pattern = re.compile(
        r'(?P<start>(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)? ?\d{4})\s*(to|-)\s*(?P<end>(Present|\d{4}|(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)? ?\d{4}))',
        re.IGNORECASE
    )

    experience_years = 0
    for match in date_range_pattern.finditer(text):
        span = match.span()
        context_window = text[max(0, span[0]-100):span[1]+100]

        # Filter: skip if context mentions education
        if any(edu.lower() in context_window.lower() for edu in education_keywords):
            continue
        # Filter: skip if context mentions internship
        if internship_pattern.search(context_window):
            continue
        # Proceed if there's a valid job keyword nearby
        if not job_pattern.search(context_window):
            continue

        try:
            start_str = match.group('start')
            end_str = match.group('end')

            start_date = parser.parse(start_str, default=datetime(current_year, 1, 1))
            end_date = (
                datetime.now() if 'present' in end_str.lower()
                else parser.parse(end_str, default=datetime(current_year, 1, 1))
            )

            delta_years = (end_date - start_date).days / 365
            if 0 < delta_years < 40:
                experience_years += delta_years
        except:
            continue

    return round(experience_years, 1)

def extract_experience(resume_text):
    job_titles = extract_job_titles(resume_text)
    total_years = extract_experience_years(resume_text)
    level = estimate_level_from_years(total_years)

    return {
        "job_titles_found": job_titles,
        "experience_years": total_years,
        "estimated_level": level
    }

# -------------------------------- Extract Jobs ----------------------------------

tokenizer = AutoTokenizer.from_pretrained("microsoft/deberta-v3-base")
model = AutoModel.from_pretrained("microsoft/deberta-v3-base")
model.eval()

device = torch.device("cpu")
model = model.to(device)

def get_embedding(text):
    inputs = tokenizer(text, return_tensors='pt', truncation=True, padding=True, max_length=512).to(device)
    with torch.no_grad():
        outputs = model(**inputs)
    return outputs.last_hidden_state[:, 0, :].squeeze(0).numpy()

index = faiss.read_index("saved_data/DeBERTa/job_faiss.index")
df = pd.read_pickle("saved_data/DeBERTa/job_metadata.pkl")

def match_jobs(resume_text, df_jobs, job_embeddings, experience_level, top_k=10):
    # 1. Filter jobs based on experience level
    filtered_jobs = df_jobs[df_jobs['formatted_experience_level'] == experience_level].reset_index(drop=True)
    
    if filtered_jobs.empty:
        print(f"No jobs found for experience level: {experience_level}.")
        return []

    # 2. Get corresponding filtered embeddings
    filtered_embeddings = []
    for idx in filtered_jobs.index:
        filtered_embeddings.append(job_embeddings[idx])  # assuming job_embeddings[i] matches df_jobs.iloc[i]

    filtered_embeddings = np.vstack(filtered_embeddings).astype("float32")

    # 3. Get resume embedding
    resume_embedding = get_embedding(resume_text).astype('float32').reshape(1, -1)
    faiss.normalize_L2(resume_embedding)  # Normalize the resume embedding

    # 4. Set up FAISS index with filtered embeddings
    index = faiss.IndexFlatIP(resume_embedding.shape[1])  # Using Inner Product (cosine similarity if normalized)
    faiss.normalize_L2(filtered_embeddings)  # Normalize the job embeddings
    index.add(filtered_embeddings)

    # 5. Search the index for top_k similar jobs
    distances, indices = index.search(resume_embedding, top_k)

    # 6. Fetch top results from the DataFrame
    results_df = filtered_jobs.iloc[indices[0]].copy()  # Fetch the rows of the top k matches
    results_df['similarity'] = distances[0]  # Add similarity score to the DataFrame

    # if salary  == 286497.1164575069, set it to 0
    results_df['salary'] = results_df['salary'].replace(286497.1164575069, 0)

    # remove job_matching column from results_df
    return results_df.drop(columns=['job_matching'])

# --------------------------------------------------------------------------------

# -------------------------------------Utils--------------------------------------

def load_positions_keywords(file_path):
    positions_keywords = {}
    with open(file_path, 'r') as file:
        reader = csv.DictReader(file)
        for row in reader:
            position = row['position']
            keywords = [keyword.lower()
                        for keyword in row['keywords'].split(',')]
            positions_keywords[position] = keywords
    return positions_keywords

def get_skills_wordcloud(skill_freq):
    # Generate word cloud
    wordcloud = WordCloud(
        width=1000,
        height=500,
        background_color=None,  # Transparent background
        mode="RGBA",  # Enables transparency in output
        colormap="coolwarm",  # Color theme for words
        max_words=100,
        contour_color='steelblue',
        contour_width=2,
        max_font_size=150
    ).generate_from_frequencies(skill_freq)

    # Save word cloud to a file with transparency
    file_path = "wordcloud.png"
    wordcloud.to_file(file_path)

    return file_path


def extract_resume_info(doc):
    raw_text = doc
    doc = nlp(doc)
    job_embeddings = np.load("saved_data/DeBERTa/job_embeddings.npy").astype("float32")
    first_name, last_name = extract_name(doc)
    email = extract_email(doc)
    skills, skills_frequency = extract_skills(doc)
    degree_major = extract_major(doc)
    experience = extract_experience(raw_text)
    wordcloud_path = get_skills_wordcloud(skills_frequency)
    skills_combined = " ".join(skills)
    matched_jobs = match_jobs(skills_combined, df, job_embeddings, experience['estimated_level'])
    
    return {'first_name': first_name, 
            'last_name': last_name, 
            'email': email, 
            'degree_major': degree_major, 
            'skills': skills, 
            'experience': experience, 
            'skills_frequency': skills_frequency,
            'wordcloud_path': wordcloud_path,
            'matched_jobs': matched_jobs.to_dict(orient='records')
    }