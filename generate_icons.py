"""
Generate placeholder icons for the PWA
Install required packages: pip install Pillow
"""

from PIL import Image, ImageDraw
import os

# Create img directory if it doesn't exist
img_dir = 'www/img'
os.makedirs(img_dir, exist_ok=True)

# Define color palette
PRIMARY_COLOR = '#776B5D'
SECONDARY_COLOR = '#B0A695'
LIGHT_COLOR = '#F3EEEA'

# Convert hex to RGB
def hex_to_rgb(hex_color):
    hex_color = hex_color.lstrip('#')
    return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))

primary_rgb = hex_to_rgb(PRIMARY_COLOR)
secondary_rgb = hex_to_rgb(SECONDARY_COLOR)
light_rgb = hex_to_rgb(LIGHT_COLOR)

def create_icon(size, filename, is_maskable=False):
    """Create a simple icon with the app's brand colors"""
    img = Image.new('RGBA', (size, size), (255, 255, 255, 0) if is_maskable else light_rgb + (255,))
    draw = ImageDraw.Draw(img)
    
    # Add background circle for maskable icons
    if is_maskable:
        draw.ellipse([0, 0, size, size], fill=primary_rgb + (255,))
    
    # Draw a light symbol - a circle with a dot (representing light/clarity)
    margin = size // 8
    circle_bbox = [margin, margin, size - margin, size - margin]
    
    if is_maskable:
        draw.ellipse(circle_bbox, fill=light_rgb + (255,), outline=light_rgb + (255,), width=2)
        dot_size = size // 6
        dot_pos = [
            size // 2 - dot_size // 2,
            size // 2 - dot_size // 2,
            size // 2 + dot_size // 2,
            size // 2 + dot_size // 2
        ]
        draw.ellipse(dot_pos, fill=light_rgb + (255,))
    else:
        draw.ellipse(circle_bbox, fill=primary_rgb + (255,), outline=primary_rgb + (255,), width=2)
        dot_size = size // 6
        dot_pos = [
            size // 2 - dot_size // 2,
            size // 2 - dot_size // 2,
            size // 2 + dot_size // 2,
            size // 2 + dot_size // 2
        ]
        draw.ellipse(dot_pos, fill=secondary_rgb + (255,))
    
    img.save(os.path.join(img_dir, filename))
    print(f"Created {filename}")

# Create icons of various sizes
print("Generating PWA icons...")

# Standard sizes
create_icon(16, 'favicon-16x16.png')
create_icon(32, 'favicon-32x32.png')
create_icon(96, 'icon-96x96.png')
create_icon(192, 'icon-192x192.png')
create_icon(512, 'icon-512x512.png')

# Maskable icons (for adaptive icons on Android)
create_icon(192, 'icon-192x192-maskable.png', is_maskable=True)
create_icon(512, 'icon-512x512-maskable.png', is_maskable=True)

print("All icons generated successfully!")
