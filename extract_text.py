import os
from bs4 import BeautifulSoup
from PyPDF2 import PdfReader

def extract_text_from_html(html_file_path):
    with open(html_file_path, 'r', encoding='utf-8') as f:
        soup = BeautifulSoup(f, 'html.parser')
        return soup.get_text()

def extract_text_from_pdf(pdf_file_path):
    text = ''
    with open(pdf_file_path, 'rb') as f:
        reader = PdfReader(f)
        for page in reader.pages:
            text += page.extract_text() or ''
    return text

def process_book_file(file_path):
    if file_path.endswith('.html'):
        return extract_text_from_html(file_path)
    elif file_path.endswith('.pdf'):
        return extract_text_from_pdf(file_path)
    else:
        return 'Unsupported file type'

if __name__ == '__main__':
    # Example usage (replace with actual file paths)
    html_example = '/home/ubuntu/upload/Alice_in_Wonderland.html'
    pdf_example = '/home/ubuntu/upload/iracema.pdf'

    print(f'\n--- Text from {html_example} ---\n')
    print(process_book_file(html_example)[:500]) # Print first 500 characters

    print(f'\n--- Text from {pdf_example} ---\n')
    print(process_book_file(pdf_example)[:500]) # Print first 500 characters


