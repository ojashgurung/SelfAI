import re
import markdown
from pdfminer.high_level import extract_text
from docx import Document


def extract_text_from_pdf(file_path: str) -> str:
    """Extracts text from a PDF file."""
    return extract_text(file_path).strip()

def extract_text_from_docx(file_path: str) -> str:
    """Extracts text from a DOCX file."""
    doc = Document(file_path)
    return '\n'.join([para.text.strip() for para in doc.paragraphs])

def extract_text_from_md_html(file_path: str) -> str:
    """Extracts text from a Markdown or HTML file."""
    with open(file_path, "r", encoding="utf-8") as f:
        md_content = f.read()
    
    html_content = markdown.markdown(md_content)
    # Clean up the HTML by removing unnecessary tags (keeping only text)
    text = re.sub(r'<[^>]+>', '', html_content) 
    
    # Clean up extra spaces and join text
    text = ' '.join(text.split())

    return text
    
def clean_text(text: str) -> str:
    """Preprocess and clean extracted text while preserving currency symbols and percent signs.."""
    if not text:
        return ""

    text = " ".join(text.split())
    text = re.sub(r"[^a-zA-Z0-9\s$€£¥₹%://.]", "", text)
    text = text.strip().lower()  # Normalize text
    return text