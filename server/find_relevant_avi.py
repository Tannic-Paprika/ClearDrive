from flask import Flask, request, jsonify
from pymongo import MongoClient
from flask_cors import CORS
import json
from math import sqrt

app = Flask(__name__)
CORS(app)
# Function to calculate distance between two coordinates
def distance(coord1, coord2):
    return sqrt((coord1[0] - coord2[0])**2 + (coord1[1] - coord2[1])**2)

@app.route('/process_trail', methods=['POST'])
def find_rel_avi():
    # Load road trail coordinates from frontend
    trail_data = request.json
    # path_id = trail_data['path_id']
    client = MongoClient('mongodb://localhost:27017/')
    db = client['gitlab_data'] 
    avi_collection = db['avi_data']  
    
    avi_data = list(avi_collection.find({}))
    
    avi_data = avi_data[0]['avi_coordinates']
    # print(avi_data[0]['avi_coordinates'])
    min_distances = {avi['avi']: float('inf') for avi in avi_data}
    nearest_avi_coords = {avi['avi']: None for avi in avi_data}
    
    for road_coord in trail_data['road_trail']:
        for avi in avi_data:
            dist = distance(road_coord, avi['coordinates'])
            if dist < min_distances[avi['avi']]:
                min_distances[avi['avi']] = dist
                nearest_avi_coords[avi['avi']] = road_coord

    nearest_avis = [avi for avi, dist in min_distances.items() if dist == min(min_distances.values())]
    avg_nearest_avis = sum(nearest_avis) / len(nearest_avis)
    response = {
        # "path_id": path_id,
        "nearest_coord_avis": nearest_avis,
        "corresponding_coordinates": nearest_avi_coords,
        "avg_avi": avg_nearest_avis
    }

    return jsonify(response)

if __name__ == '__main__':
    app.run(debug=True)
