import os
import re

TEMPLATE_DIR = '/Users/m3air/Desktop/Files/django project/Calculation/calculation/templates'
color_classes = [
    'text-primary', 'text-secondary', 'text-success', 'text-danger', 
    'text-warning', 'text-info', 'text-light', 'text-white', 'text-muted', 'text-black'
]

def process_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        print(f"Error reading {filepath}: {e}")
        return False

    def replacer(match):
        h1_tag = match.group(0)
        
        # Check if there's an inline color style and remove it
        h1_tag = re.sub(r'style="[^"]*color:\s*[^;"]+;?[^"]*"', '', h1_tag)
        h1_tag = re.sub(r"style='[^']*color:\s*[^;']+;?[^']*'", '', h1_tag)
        h1_tag = re.sub(r'style="[^a-zA-Z-]*"', '', h1_tag) # Remove empty style attribute
        
        # Remove unwanted color classes
        for c in color_classes:
            h1_tag = re.sub(r'\b' + c + r'\b', '', h1_tag)
            
        if 'text-dark' not in h1_tag:
            if 'class="' in h1_tag:
                h1_tag = re.sub(r'class="([^"]*)"', lambda m: f'class="{m.group(1)} text-dark"', h1_tag)
            elif "class='" in h1_tag:
                h1_tag = re.sub(r"class='([^']*)'", lambda m: f"class='{m.group(1)} text-dark'", h1_tag)
            else:
                h1_tag = h1_tag.replace('<h1', '<h1 class="text-dark"', 1)
        
        # Clean up multiple spaces within the tag
        h1_tag = re.sub(r'\s+', ' ', h1_tag)
        h1_tag = h1_tag.replace(' >', '>')
        h1_tag = re.sub(r'class="\s+', 'class="', h1_tag)
        h1_tag = re.sub(r'\s+"', '"', h1_tag)
        h1_tag = re.sub(r"class='\s+", "class='", h1_tag)
        h1_tag = re.sub(r"\s+'", "'", h1_tag)
        # Empty class cleanup
        h1_tag = re.sub(r'class=""\s*', '', h1_tag)
        h1_tag = re.sub(r"class=''\s*", '', h1_tag)
        
        return h1_tag

    new_content = re.sub(r'<h1\b[^>]*>', replacer, content)

    if new_content != content:
        try:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            return True
        except Exception as e:
            print(f"Error writing {filepath}: {e}")
            return False
    return False

modified = 0
for root, dirs, files in os.walk(TEMPLATE_DIR):
    for filename in files:
        if filename.endswith('.html'):
            filepath = os.path.join(root, filename)
            if process_file(filepath):
                modified += 1

print(f"Modified {modified} html files.")
