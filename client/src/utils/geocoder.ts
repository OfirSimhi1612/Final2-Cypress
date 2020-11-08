import axios from "axios"
import { string } from "yup";


interface AddressComponent {
    long_name? : string;
    short_name? : string;
    types? : string[];
}

interface Cordinates {
    lat : number;
    lng : number;
}

interface ViewPort {
    northeast?: Cordinates;
    southwest?: Cordinates
}

interface Geometry {
    location?: Cordinates;
    location_type?: string;
    viewport?: ViewPort;
}

interface Results {
    address_components:  AddressComponent[];
    formatted_address: string;
    geometry?: Geometry;
    place_id?: string;
    plus_code?: { compound_code: string; global_code: string };
    types?: string[]
}

interface GeocodingResponses {
    plus_code?: { global_code: string }
    results : Results[];
    status : string;
}

export default async function geocoder(lat: number, lng: number) {
    const { data }  = await axios.get
    (`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyBeOBTkKGGeblhp3ie0RmdDDI6uHduVYVw`)
    console.log(data);

    if(data.results.length === 0 || !data){
        return 'Unknown Location...'
    } else if(data.results.length === 1) {
        const result =  data.results[0].formatted_address
        if(result === 'R. Igaçaba - St. dos Afonsos, Aparecida de Goiânia - GO, 74915-315, Brazil'){
            console.log('error')
            return 'Unknown Location...'
        } else {
            return result
        }
    } else {
        console.log(data)
        const countryAndState = data.results.filter((result: Results) => result.address_components.length === 2)
        const result =  countryAndState[0] ? countryAndState[0].formatted_address : data.results[0].formatted_address
        if(result === 'R. Igaçaba - St. dos Afonsos, Aparecida de Goiânia - GO, 74915-315, Brazil'){
            console.log('error')
            return 'Unknown Location...'
        } else {
            return result
        }
    }
}