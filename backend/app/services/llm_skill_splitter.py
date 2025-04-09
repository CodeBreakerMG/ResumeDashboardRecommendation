import ollama

def split_skills_with_llm(skill_text: str) -> list[str]:
    prompt = f"""
You are a helpful assistant.

Split the following unstructured text into a clean Python list of professional skills.

Return ONLY a valid Python list of strings. No explanations.

Text:
{skill_text}
"""

    try:
        response = ollama.chat(
            model='mistral',
            messages=[{"role": "user", "content": prompt}]
        )

        content = response['message']['content'].strip()
        skills = eval(content)

        if isinstance(skills, list):
            return [s.strip() for s in skills if isinstance(s, str)]
    except Exception as e:
        print(f"❌ Error parsing LLM response: {e}")

    return []
