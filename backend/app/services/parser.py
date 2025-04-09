import docx
import re

known_skills = [
    "python", "java", "react", "django", "sql", "git", "docker", "fastapi",
    "machine learning", "data analysis", "html", "css", "linux", "aws"
]

def extract_text_from_pdf(file_bytes: bytes) -> str:
    import fitz
    text = ""
    with fitz.open(stream=file_bytes, filetype="pdf") as doc:
        for page in doc:
            text += page.get_text()
    return text

def extract_text_from_docx(file_bytes: bytes) -> str:
    with open("temp.docx", "wb") as f:
        f.write(file_bytes)
    doc = docx.Document("temp.docx")
    return "\n".join(p.text for p in doc.paragraphs)

def parse_skills(text: str) -> list:
    text = text.lower()
    return [skill for skill in known_skills if skill in text]

def smart_split_skills(raw_skills: str) -> list[str]:
    # Handle None or NaNs
    if not isinstance(raw_skills, str):
        return []

    # Replace parentheses content with comma-separated inside
    raw_skills = re.sub(r'\(([^)]+)\)', lambda m: m.group(1).replace(",", "|"), raw_skills)

    # Split by commas or pipes
    parts = re.split(r",|\|", raw_skills)

    # Fallback: also split by multiple spaces if no commas
    if len(parts) == 1:
        parts = re.split(r"\s{2,}|(?<!\w)\s(?!\w{1,2}\.)", raw_skills)

    # Clean and normalize
    return [p.strip().rstrip(".").lower() for p in parts if p.strip()]
