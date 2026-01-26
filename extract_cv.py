from pypdf import PdfReader
import re

pdf_path = r"c:\Users\bdour\IDrive-Sync\Work\Coding\Github\online-portfolio\portfolio\Benjamin Dourthe CV.pdf"

try:
    reader = PdfReader(pdf_path)
    text = ""
    for page in reader.pages:
        text += page.extract_text() + "\n"
    
    # Save to a text file for inspection
    with open("cv_content.txt", "w", encoding="utf-8") as f:
        f.write(text)
        
    print("Successfully extracted text to cv_content.txt")
    print(text[:2000]) # Print first 2000 chars to stdout for quick check

except Exception as e:
    print(f"Error reading PDF: {e}")
