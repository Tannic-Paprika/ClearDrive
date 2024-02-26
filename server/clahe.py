import torch
from PIL import Image
import numpy as np
import cv2

# Load YOLOv5 model
model = torch.hub.load('ultralytics/yolov5', 'yolov5s', pretrained=True)

# Function to adjust contrast using CLAHE
def adjust_contrast(image):
    # Apply CLAHE to each channel separately
    clahe = cv2.createCLAHE(clipLimit=5)
    cl_r = clahe.apply(image[:,:,0])
    cl_g = clahe.apply(image[:,:,1])
    cl_b = clahe.apply(image[:,:,2])

    # Merge the CLAHE output into an RGB image
    final_img = cv2.merge((cl_r, cl_g, cl_b))
    
    return final_img

# Read the image
image_path = "Fog\\76527851.png"
image = cv2.imread(image_path)

# Resize the image for compatibility
image = cv2.resize(image, (500, 600))

# Adjust contrast using CLAHE
image = adjust_contrast(image)

# Perform inference
results = model(image)

# Get number of detected objects
num_objects = len(results.xyxy[0])

# Print the number of objects detected
print("Number of objects detected:", num_objects)

# Visualize results
results.show()
