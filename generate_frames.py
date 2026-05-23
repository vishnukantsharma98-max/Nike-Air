import os
from PIL import Image
import math

# Configuration
input_image_path = 'public/products/nike_air_mag.png'
output_folder = 'public/frames'
num_frames = 100
bg_color = (0, 0, 0)
target_width = 1920
target_height = 1080

# Ensure output folder exists
os.makedirs(output_folder, exist_ok=True)

# Load the base image
try:
    shoe_img = Image.open(input_image_path).convert("RGBA")
except Exception as e:
    print(f"Error loading {input_image_path}: {e}")
    exit(1)

# Base size of the shoe
base_w, base_h = shoe_img.size

# We want the shoe to be relatively large in the frame
target_shoe_height = int(target_height * 0.7)
scale_ratio = target_shoe_height / float(base_h)
target_shoe_width = int(float(base_w) * scale_ratio)

shoe_img = shoe_img.resize((target_shoe_width, target_shoe_height), Image.Resampling.LANCZOS)

for i in range(num_frames):
    progress = i / (num_frames - 1) # 0.0 to 1.0

    # Animation logic:
    # Scale from 0.3 to 1.1 with an ease-out curve
    ease_progress = 1 - math.pow(1 - progress, 3)
    current_scale = 0.3 + (ease_progress * 0.8)
    
    # Rotate from -180 to 0 degrees
    current_angle = -180 * (1 - ease_progress)

    # Opacity from 0 to 255
    current_alpha = int(255 * min(1.0, progress * 1.5))

    # Apply transformations
    frame_shoe = shoe_img.copy()
    
    # Adjust opacity
    alpha_channel = frame_shoe.getchannel('A')
    alpha_channel = alpha_channel.point(lambda p: int(p * (current_alpha / 255.0)))
    frame_shoe.putalpha(alpha_channel)

    # Scale
    new_w = int(target_shoe_width * current_scale)
    new_h = int(target_shoe_height * current_scale)
    
    # Avoid 0 size
    if new_w <= 0: new_w = 1
    if new_h <= 0: new_h = 1
        
    frame_shoe = frame_shoe.resize((new_w, new_h), Image.Resampling.LANCZOS)

    # Rotate
    frame_shoe = frame_shoe.rotate(current_angle, resample=Image.Resampling.BICUBIC, expand=True)

    # Create background
    bg = Image.new("RGB", (target_width, target_height), bg_color)

    # Paste shoe onto background
    paste_x = (target_width - frame_shoe.width) // 2
    paste_y = (target_height - frame_shoe.height) // 2

    bg.paste(frame_shoe, (paste_x, paste_y), frame_shoe)

    # Save frame
    frame_filename = f"frame_{str(i + 1).zfill(3)}.jpg"
    frame_path = os.path.join(output_folder, frame_filename)
    bg.save(frame_path, "JPEG", quality=85)
    
    if i % 10 == 0:
        print(f"Generated {i}/{num_frames} frames...")

print("Successfully generated 100 frames!")
