# ClearDrive 

This is the backend component of the AVI data processing system. It is responsible for interfacing with the MongoDB database to store and retrieve relevant AVI data for the frontend application.

## Setup

1. **Prerequisites**:
   - Python 3.x installed
   - MongoDB server running locally or remotely

2. **Install dependencies**:
   ```bash
   pip install flask pymongo opencv
4. **Configure MongoDB connection**:
- Open the `find_relevant_avi.py` file.
- Update the MongoDB connection string in line 18 with your MongoDB server details:
  ```python
  client = MongoClient("mongodb://localhost:27017/")
  ```

4. **Run the Flask server**:
   ```bash
   python find_relevant_avi.py
## Backend Functionality

The backend is responsible for the following tasks:

1. **Storing AVI data in MongoDB**:
- The `fog_removal.py` script is responsible for this functionality.
- It connects to the MongoDB database, extracts GPS coordinates from image filenames, and stores the AVI data with the corresponding coordinates.

2. **Retrieving relevant AVI data**:
- The `find_relevant_avi.py` script handles this functionality.
- It defines a Flask route `/process_trail` that accepts road trail data from the frontend.
- It then queries the MongoDB database to find the AVI data closest to the provided road trail coordinates.
- The retrieved AVI data is sent back to the frontend in a JSON response.

