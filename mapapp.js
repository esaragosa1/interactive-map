//Create map 
const myMap ={
	coordinates: [],
	businesses: [],
	map: {},
	markers: {},

	// create and Initialize the map
	makeMap() {
		this.map = L.map('map',{
		center: this.coordinates,
		zoom: 11,	
		});
		// Add a street map layer
		L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
			maxZoom: 19,
    		attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'		
		}).addTo(this.map);
		//create and add geoloc marker;
		const marker = L.marker(this.coordinates)
		marker
		.addTo(this.map)
		.bindPopup('<p1><b>You are Here</b></p1>')
		.openPopup()
   },
   // Add Biz markers
   addMarkers(){
			for (var i = 0; i < this.businesses.length; i++) {
				this.markers = L.marker([
					this.businesses[i].lat,
					this.businesses[i].long,
				])
				.bindPopup(`<p1>${this.businesses[i].name}</p1>`)
				.addTo(this.map)
		    }
	},
 }

// Get user coordinates 
async function getCoords(){
	const pos = await new Promise((resolve, reject) => {
			navigator.geolocation.getCurrentPosition(resolve, reject)
	});
    return [pos.coords.latitude, pos.coords.longitude]
}

// Function to search businesses nearby
async function foursquare (business){
    const options= {
        	method: 'GET',
        	headers : {
        	Accept: 'application/json',
        	Authorization:'fsq3yGcMpWTXrv4J7slaRij6SbXd9wSSwQtcgy89x5QTM8M='
        	}
    }
	let limit = 5
	let lat = myMap.coordinates[0]
	let lon = myMap.coordinates[1] 
    let response= await fetch(`https://cors-anywhere.herokuapp.com/https://api.foursquare.com/v3/places/search?query=${business}&limit=${limit}&ll=${lat}%2C${lon}`, options)
    let data = await response.text()
    let parsedData = JSON.parse(data)
    let bizresults = parsedData.results
	return businesses
}    
// Process Business data
function processBusinesses(data) {
	let businesses = data.map((element) => {
		let location = {
			name: element.name,
			lat: element.geocodes.main.latitude,
			long: element.geocodes.main.longitude
		};
		return location
	})
	return businesses
}
// window load
window.onload = async () => {
	const coords = await getCoords()
	myMap.coordinates = coords
	myMap.makeMap()
}

// business submit button
document.getElementById('submit').addEventListener('click', async (event) => {
	event.preventDefault()
	let business = document.getElementById('business').value
	let data = await foursquare(business)
	myMap.businesses = processBusinesses(data)
	myMap.addMarkers()
})
