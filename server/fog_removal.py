import os
import cv2
import pymongo
import torch

client = pymongo.MongoClient("mongodb://localhost:27017/")
db = client["gitlab_data"]  
collection = db["avi_data"]  

model = torch.hub.load('ultralytics/yolov5', 'yolov5s', pretrained=True)

# Function to insert avi data with GPS coordinates into MongoDB
def insert_avi_data(image_path, avi_data, latitude, longitude, clip_limit):

    avi_document = {
        "avi": clip_limit,
        "coordinates": {"type": "Point", "coordinates": [longitude, latitude]},
        "image_path": image_path,   
    }
    collection.insert_one(avi_document)

    print(f"AVI data with GPS coordinates ({latitude}, {longitude}) inserted into MongoDB.")

folder_path = "Fog"  

for filename in os.listdir(folder_path):
    if filename.endswith(".png"):  
        # Extract coordinates from filename
        filename_without_extension = os.path.splitext(filename)[0]
        coordinates = filename_without_extension.split('_')
        latitude, longitude = float(coordinates[0]), float(coordinates[1])

        image_path = os.path.join(folder_path, filename)
        image = cv2.imread(image_path)

        # Initializing clip limit
        clip_limit = 1

        while True:
            clahe = cv2.createCLAHE(clipLimit=clip_limit)
            cl_image = clahe.apply(cv2.cvtColor(image, cv2.COLOR_BGR2GRAY))

            results = model(cl_image)
            num_objects = len(results.xyxy[0])
            if num_objects > 5:
                break

        insert_avi_data(image_path, clip_limit, latitude, longitude, clip_limit)
