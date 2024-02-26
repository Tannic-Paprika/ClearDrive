import React, { useState, useEffect } from 'react';
import {
	MapContainer,
	TileLayer,
	Marker,
	Popup,
	Polyline,
	Tooltip
} from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import polyline from '@mapbox/polyline';
import 'leaflet/dist/leaflet.css';

function App() {
	const [start, setStart] = useState([12.9527962, 77.7025624]); // Default start point
	const [end, setEnd] = useState([12.97440549406668, 77.60777701563926]); // Default end point
	const [routes, setRoutes] = useState([]);
	const [selectedRouteIndex, setSelectedRouteIndex] = useState(0);
	const [position, setPosition] = useState(start);
	let [maxAviIndex, setMaxAviIndex] = useState();

	const blueCircleIcon = new L.Icon({
		iconUrl:
			'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
		iconSize: [25, 41], // size of the icon
		iconAnchor: [12, 41], // point of the icon which will correspond to marker's location
		popupAnchor: [1, -34], // point from which the popup should open relative to the iconAnchor
		shadowSize: [41, 41], // size of the shadow
		shadowAnchor: [12, 41] // point of the shadow which will correspond to marker's location
	});

	// useEffect(() => {
	// 	console.log('changed', maxAviIndex);
	// }, [maxAviIndex]);

	const findPaths = async () => {
		try {
			const response = await axios.get(
				`http://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?alternatives=true`
			);
			var maxAvi = 0;
			// response.data.routes.forEach(async (route, index) => {
			// 	const response = await axios.post(
			// 		`http://localhost:5000/process_trail`,
			// 		{
			// 			road_trail: polyline.decode(route.geometry)
			// 		}
			// 	);
			// 	console.log('response', response.data.avg_avi);
			// 	// console.log(response.data.avg_avi > maxAvi);
			// 	if (response.data.avg_avi > maxAvi) {
			// 		maxAvi = response.data.avg_avi;
			// 		console.log('before', maxAviIndex, index);
			// 		setMaxAviIndex((prevIndex) => index);
			// 		console.log('after', maxAviIndex);
			// 	}
			// });
			// setRoutes(response.data.routes);

			const postPromises = response.data.routes.map(async (route, index) => {
				const aviData = await axios.post(
					`http://localhost:5000/process_trail`,
					{
						road_trail: polyline.decode(route.geometry)
					}
				);
				console.log('response', aviData.data.avg_avi);
				response.data.routes[index].avi = aviData.data.avg_avi;
				if (aviData.data.avg_avi > maxAvi) {
					maxAvi = aviData.data.avg_avi;
					console.log('before', maxAviIndex, index);
					setMaxAviIndex(index);
					console.log('after', maxAviIndex);
				}
			});
			// Wait for all the promises to resolve
			await Promise.all(postPromises);
			setRoutes(response.data.routes);
		} catch (error) {
			console.log(error);
		}
	};

	// const fetchAvi = async () => {
	// 	try {
	// 	} catch (error) {}
	// };

	const onSubmit = async (e) => {
		await findPaths();
	};

	const selectRoute = (index) => {
		setSelectedRouteIndex(index);
	};

	const handleStartChange = (event) => {
		const { value } = event.target;
		const [lat, lng] = value.split(',').map(parseFloat);
		setStart([lat, lng]);
	};

	const handleEndChange = (event) => {
		const { value } = event.target;
		const [lat, lng] = value.split(',').map(parseFloat);
		setEnd([lat, lng]);
	};

	return (
		<div>
			<div>
				<label htmlFor="start">Start Position:</label>
				<input
					type="text"
					id="start"
					name="start"
					value={start.join(',')}
					onChange={handleStartChange}
				/>
			</div>
			<div>
				<label htmlFor="end">End Position:</label>
				<input
					type="text"
					id="end"
					name="end"
					value={end.join(',')}
					onChange={handleEndChange}
				/>
			</div>
			<div>
				<button onClick={onSubmit}>Find</button>
			</div>
			<MapContainer
				center={[12.963, 77.601]} // Default center
				zoom={13}
				style={{ height: '90vh', width: '100vw' }}
			>
				<TileLayer
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				/>
				{routes.map((route, index) => (
					<Polyline
						key={index}
						positions={polyline.decode(route.geometry)}
						color={index === maxAviIndex ? 'green' : 'red'}
						//onClick={() => selectRoute(index)}
					>
						<Tooltip>AVI: {route.avi}</Tooltip>
					</Polyline>
				))}
				{routes.length > 0 && (
					<div>
						<Marker position={start} icon={blueCircleIcon}>
							<Popup>Start Point</Popup>
						</Marker>
						<Marker position={end} icon={blueCircleIcon}>
							<Popup>End Point</Popup>
						</Marker>
					</div>
				)}
			</MapContainer>
		</div>
	);
}

export default App;
