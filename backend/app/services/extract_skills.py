import spacy
import nltk
import csv

# Additional libraries
nltk.download('punkt')

# Load the spaCy model for English
nlp = spacy.load('en_core_web_sm')

def load_keywords(file_path):
    with open(file_path, 'r') as file:
        reader = csv.reader(file)
        return set(row[0] for row in reader)

def csv_skills(doc):
    skills_keywords = load_keywords('data/newSkills.csv')
    skills = {}

    # Loop through each keyword in the skills list
    for keyword in skills_keywords:
        if keyword.lower() in doc.text.lower():
            # If the keyword is found, increment its count in the dictionary
            if keyword in skills:
                skills[keyword] += 1
            else:
                skills[keyword] = 1

    return skills

nlp_skills = spacy.load('data/skills')  # Load the trained NER model for skills

def extract_skills_from_ner(doc):
    non_skill_labels = {'DATE', 'TIME', 'PERCENT', 'MONEY', 'QUANTITY', 'ORDINAL', 'CARDINAL', 'EMAIL'}
    
    skills = set()
    for ent in nlp_skills(doc.text).ents:
        if ent.label_ == 'SKILL':
            # Check if the entity text is not in the non-skill labels set
            if ent.label_ not in non_skill_labels and not ent.text.isdigit():
                # Filter out non-alphabetic characters
                skill_text = ''.join(filter(str.isalpha, ent.text))
                if skill_text:
                    skills.add(skill_text)
    return skills

def is_valid_skill(skill_text):
    # Define criteria for valid skills (modify/add criteria as needed)
    return len(skill_text) > 1 and not any(char.isdigit() for char in skill_text)

def extract_skills(resume_text):
    doc = nlp(resume_text)
    skills_csv = csv_skills(doc)
    # skills_ner = extract_skills_from_ner(doc)
    
    filtered_skills_csv = {skill: freq for skill, freq in skills_csv.items() if is_valid_skill(skill)}
    
    # return list(combined_skills)  # Return combined filtered skills as a list
    return filtered_skills_csv