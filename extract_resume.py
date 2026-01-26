
import os
from pypdf import PdfReader

def extract_text(file_path, output_file):
    with open(output_file, 'a', encoding='utf-8') as f:
        f.write(f"--- Extracting {file_path} ---\n")
        try:
            reader = PdfReader(file_path)
            for i, page in enumerate(reader.pages):
                f.write(f"--- Page {i+1} ---\n")
                f.write(page.extract_text())
                f.write("\n\n")
        except Exception as e:
            f.write(f"Error reading {file_path}: {e}\n")

base_dir = r"c:\Users\bdour\IDrive-Sync\Work\Coding\Github\online-portfolio\portfolio"
resume_path = os.path.join(base_dir, "Benjamin Dourthe Resume.pdf")
cv_path = os.path.join(base_dir, "Benjamin Dourthe CV.pdf")
output_txt = r"c:\Users\bdour\IDrive-Sync\Work\Coding\Github\online-portfolio\resume_text_utf8.txt"

if os.path.exists(output_txt):
    os.remove(output_txt)

extract_text(resume_path, output_txt)
extract_text(cv_path, output_txt)
