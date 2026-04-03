import os
import re

# Antigravity Palette Mapping
HEX_MAP = {
    r'#4e73df': 'var(--ag-primary)',
    r'#4f46e5': 'var(--ag-primary)',
    r'#4338ca': 'var(--ag-primary)',
    r'#224abe': 'var(--ag-primary)',
    r'#4a69bd': 'var(--ag-primary)',
    r'#1e3a8a': 'var(--ag-primary)',
    r'#1d4ed8': 'var(--ag-primary)',
    
    r'#36b9cc': 'var(--ag-secondary)',
    r'#007ea7': 'var(--ag-secondary)',
    r'#007EA7': 'var(--ag-secondary)',
    r'#0284c7': 'var(--ag-secondary)',
    r'#93c5fd': 'var(--ag-secondary)',
    
    r'#1cc88a': 'var(--ag-accent)',
    r'#10b981': 'var(--ag-accent)',
    r'#0ea5e9': 'var(--ag-accent)',
    r'#00a8e8': 'var(--ag-accent)',
    r'#00A8E8': 'var(--ag-accent)',
    r'#38bdf8': 'var(--ag-accent)',
    r'#6ee7b7': 'var(--ag-accent)',
    
    r'#1e293b': 'var(--ag-text)',
    r'#0f172a': 'var(--ag-text)',
    r'#3a3b45': 'var(--ag-text)',
    r'#2d3748': 'var(--ag-text)',
    r'#00171F': 'var(--ag-text)',
    
    r'#f8fafc': 'var(--ag-bg)',
    r'#f1f5f9': 'var(--ag-bg)',
    r'#f8f9fc': 'var(--ag-bg)',
    r'#f7f9fd': 'var(--ag-bg)',
    r'#ffffff': 'var(--ag-bg)',
    r'#FFFFFF': 'var(--ag-bg)',
}

# var -> var
VAR_MAP = {
    r'var\(--primary-indigo\)': 'var(--ag-primary)',
    r'var\(--blue-deep\)': 'var(--ag-primary)',
    r'var\(--blue-dark\)': 'var(--ag-primary)',
    r'var\(--primary-blue\)': 'var(--ag-primary)',
    r'var\(--main-color\)': 'var(--ag-primary)',
    r'var\(--blue-accent\)': 'var(--ag-secondary)',
    r'var\(--secondary-blue\)': 'var(--ag-secondary)',
    r'var\(--blue-light\)': 'var(--ag-accent)',
    r'var\(--blue-vlight\)': 'var(--ag-accent)',
    r'var\(--blue-lightest\)': 'var(--ag-bg)',
    r'var\(--blue-pale\)': 'var(--ag-bg)',
    r'var\(--blue-minterm-bg\)': 'var(--ag-accent)',
    r'var\(--blue-table-border\)': 'var(--ag-secondary)',
    r'var\(--text-color\)': 'var(--ag-text)',
    r'var\(--bg-card\)': 'var(--ag-bg)',
    # Mapping Bootstrap variables if they appear in var()
    r'var\(--primary\)': 'var(--ag-primary)',
    r'var\(--secondary\)': 'var(--ag-secondary)',
    r'var\(--info\)': 'var(--ag-accent)',
}

# Regex to find :root blocks
ROOT_PATTERN = re.compile(r':root\s*\{.*?\}', re.DOTALL)

TEMPLATES_DIR = 'calculation/templates'

def migrate_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    new_content = content
    modified = False

    # 1. Replace hardcoded HEX values
    # Sort HEX_MAP keys by length descending to avoid partial matches if any
    hex_keys = sorted(HEX_MAP.keys(), key=len, reverse=True)
    for hex_val in hex_keys:
        var_name = HEX_MAP[hex_val]
        if hex_val in new_content or hex_val.upper() in new_content:
            pattern = re.compile(re.escape(hex_val), re.IGNORECASE)
            new_content = pattern.sub(var_name, new_content)
            modified = True

    # 2. Replace internal variables
    for old_var, new_var in VAR_MAP.items():
        if re.search(old_var, new_content):
            new_content = re.sub(old_var, new_var, new_content)
            modified = True

    # 3. Handle internal :root blocks
    if ':root' in new_content:
        new_content = ROOT_PATTERN.sub('', new_content)
        modified = True

    # 4. Clean up empty style tags
    new_content = re.sub(r'<style>\s*</style>', '', new_content)

    if modified:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        return True
    return False

def main():
    print(f"Starting FINAL Antigravity Color Migration (REFINED) in {TEMPLATES_DIR}...")
    success_count = 0
    total_files = 0
    
    for root, dirs, files in os.walk(TEMPLATES_DIR):
        for name in files:
            if name.endswith('.html'):
                total_files += 1
                path = os.path.join(root, name)
                if migrate_file(path):
                    success_count += 1
                    if success_count % 50 == 0:
                        print(f"Processed {success_count} files...")

    print(f"Migration Complete!")
    print(f"Total HTML files scanned: {total_files}")
    print(f"Total files modified: {success_count}")

if __name__ == '__main__':
    main()
