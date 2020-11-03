import axios from "axios"

export default async function geocoder(lat: number, lng: number) {
    const { data } = await axios.get
    (`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyBeOBTkKGGeblhp3ie0RmdDDI6uHduVYVw`)
    console.log(data);

    if(data.results.length === 0){
        return 'Unknown Location...'
    } else if(data.results.length === 1) {
        return data.results[0].formatted_address
    } else {
        return data.results[data.results.length - 2].formatted_address
    }
}