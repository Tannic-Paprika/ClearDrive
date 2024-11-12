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

This is the frontend component of the AVI data processing system, responsible for visualizing the relevant AVI data on a map using Leaflet.js.

## Setup

1. **Prerequisites**:
  - Node.js installed
  - React.js knowledge

2. **Install dependencies**:
   ```bash
   npm install react-leaflet leaflet @mapbox/polyline axios
3. **Configure API endpoint**:
- Open the `App.js` file.
- Update the API endpoint URL in line 48 to point to your backend server:
  ```javascript
  const response = await axios.post(
    `http://localhost:5000/process_trail`,
    { road_trail: polyline.decode(route.geometry) }
  );
  ```

4. **Start the development server**:
   ```bash
   npm start
## Frontend Functionality

1. **Route Finding**:
- Users can input start and end coordinates.
- The app uses the OSRM API to retrieve multiple route options.

2. **AVI Data Retrieval**:
- For each route, the frontend sends a POST request to the backend.
- The backend responds with the relevant AVI data, including the average AVI value.

3. **Map Visualization**:
- Leaflet.js is used to render a map and display the route options.
- Each route is shown as a polyline, colored based on the average AVI value.
- Tooltips display the AVI value for each route.
