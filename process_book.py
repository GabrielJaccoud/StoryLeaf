
import re
from bs4 import BeautifulSoup

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

    # Extract main content - assuming it's within a div or body after cleaning
    # This part might need adjustment based on the specific HTML structure of each book
    body_content = soup.find('body')
    if body_content:
        # Remove the first div which seems to be empty after header removal
        if body_content.div:
            body_content.div.decompose()
        return str(body_content)
    return str(soup)


if __name__ == '__main__':
    from bs4 import Comment
    import sys

    input_file = sys.argv[1]
    output_file = sys.argv[2]

    with open(input_file, 'r', encoding='utf-8') as f:
        html_content = f.read()

    cleaned_content = clean_html_book(html_content)

    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(cleaned_content)


