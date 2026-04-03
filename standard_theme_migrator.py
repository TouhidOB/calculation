import os
import re

# Logic:
# 1. Walk through 'calculation/templates'
# 2. Find internal <style> blocks
# 3. Parse :root definitions
# 4. Map variables to:
#    - primary-color (if fuzzy matches blue, green, primary, etc)
#    - bg-input (if fuzzy matches grey, gray, bg)
#    - border-color (if fuzzy matches border)
# 5. Global replace variable usage in file content
# 6. Remove :root assignment line

TEMPLATES_DIR = '/Users/m3air/Desktop/Files/django project/Calculation/calculation/templates'

def migrate_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Regex to find :root block (assumes basic formatting)
    # This regex looks for :root { ... } content
    root_pattern = re.compile(r':root\s*\{(.*?)\}', re.DOTALL)
    match = root_pattern.search(content)
    
    if not match:
        return False
        
    root_content = match.group(1)
    
    # Parse individual variable lines: --var-name: value;
    var_lines = re.findall(r'(--[\w-]+):\s*([^;]+);', root_content)
    
    if not var_lines:
        return False

    new_content = content
    remapped = False

    for var_name, var_value in var_lines:
        target_var = None
        var_name_lower = var_name.lower()
        var_value_lower = var_value.lower().strip()

        # Heuristic Mapping
        if 'border' in var_name_lower:
            target_var = '--border-color'
        elif any(c in var_name_lower for c in ['bg', 'gray', 'grey', 'white', 'light']):
            target_var = '--bg-input' # or --bg-secondary
        elif any(c in var_name_lower for c in ['blue', 'green', 'red', 'yellow', 'orange', 'purple', 'primary', 'dark', 'main']):
            target_var = '--primary-color'
        elif '#' in var_value_lower:
             # Fallback: if value is dark/saturated -> primary. If light -> bg.
             # Simple check: just map to primary if it's not obviously a background
             target_var = '--primary-color'
        
        if target_var:
            print(f"  Mapping {var_name} -> {target_var}")
            # Replace USAGE: var(--old-name) -> var(--new-name)
            new_content = new_content.replace(f'var({var_name})', f'var({target_var})')
            
            # Remove DEFINITION: remove the line from the :root block in the file
            # We match the specific line in the original content to safely remove it
            # Using simple string replace for the definition line might be risky if duplicates exist,
            # but usually :root defs are unique.
            # let's Regex remove the definition line
            def_pattern = re.compile(fr'\s*{var_name}:\s*[^;]+;')
            new_content = def_pattern.sub('', new_content)
            remapped = True

    if remapped:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        return True
    return False

def main():
    print(f"Scanning {TEMPLATES_DIR}...")
    count = 0
    for root, dirs, files in os.walk(TEMPLATES_DIR):
        for name in files:
            if name.endswith('.html'):
                path = os.path.join(root, name)
                if migrate_file(path):
                    print(f"Migrated: {name}")
                    count += 1
    print(f"Total migrated: {count}")

if __name__ == '__main__':
    main()
