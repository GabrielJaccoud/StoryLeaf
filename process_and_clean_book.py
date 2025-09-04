


import os
import re
import sys
from bs4 import BeautifulSoup, Comment
from PyPDF2 import PdfReader
import unicodedata

def clean_html_book(html_content):
    soup = BeautifulSoup(html_content, 'html.parser')

    # Remove Project Gutenberg boilerplate
    for section_id in ['pg-header', 'pg-footer']:
        section = soup.find('section', id=section_id)
        if section:
            section.decompose()

    # Remove any remaining script or style tags
    for script_or_style in soup(['script', 'style']):
        script_or_style.decompose()

    # Remove comments
    for comment in soup.find_all(string=lambda text: isinstance(text, Comment)):
        comment.extract()

    # Extract main content
    body_content = soup.find('body')
    if body_content:
        if body_content.div:
            body_content.div.decompose()
        return body_content.get_text()
    return soup.get_text()

def extract_text_from_pdf(pdf_file_path):
    text = ''
    with open(pdf_file_path, 'rb') as f:
        reader = PdfReader(f)
        for page in reader.pages:
            text += page.extract_text() or ''
    return text

def clean_text(text):
    # Remove multiple spaces, newlines, and tabs
    text = re.sub(r'\s+', ' ', text).strip()
    # Remove non-alphanumeric characters (keeping some punctuation)
    text = re.sub(r'[^\w\s.,!?;:()\[\]-]', '', text)
    return text

def normalize_text(text):
    # Convert to lowercase
    text = text.lower()
    # Remove accents
    text = unicodedata.normalize('NFKD', text).encode('ascii', 'ignore').decode('utf-8')
    return text

def process_book_file(file_path):
    raw_text = ''
    if file_path.endswith('.html'):
        with open(file_path, 'r', encoding='utf-8') as f:
            html_content = f.read()
        raw_text = clean_html_book(html_content)
    elif file_path.endswith('.pdf'):
        raw_text = extract_text_from_pdf(file_path)
    else:
        return 'Unsupported file type'

    cleaned_text = clean_text(raw_text)
    normalized_text = normalize_text(cleaned_text)
    return normalized_text

def save_text_to_markdown(text, output_file_path):
    with open(output_file_path, 'w', encoding='utf-8') as f:
        f.write(text)

if __name__ == '__main__':
    if len(sys.argv) != 3:
        print("Usage: python process_and_clean_book.py <input_file> <output_file>")
        sys.exit(1)

    input_file = sys.argv[1]
    output_file = sys.argv[2]

    processed_text = process_book_file(input_file)
    save_text_to_markdown(processed_text, output_file)

    print(f'Successfully processed {input_file} and saved to {output_file}')


