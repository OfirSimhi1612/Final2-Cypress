import React, {useState, useEffect} from 'react'
import { GoogleMap, LoadScript, Marker , InfoWindow, MarkerClusterer } from '@react-google-maps/api';
import { Event } from "../models/event";
import { LocationsDataDiv } from "../styledComponents/DashBoard"
import EventsLog from "./EventsLog"
import axios from "axios";


const containerStyle = {
  width: '100%',
  height: '100%'
};
 
const center = {
  lat: 31,
  lng: 35
};

interface Filters {
  sorting: string;
  type: string,
  browser: string,
  search: string
}

const Map: React.FC = () => {

  const [events, setEvents] = useState<Event[]>([]);
  const [offset, setOffset] = useState<number>(10);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [filters, setFilters] = useState({
    sorting: "none",
    type: "all",
    browser: "all",
    search: "",
  });


  const fetch = React.useCallback(async (filters: Filters, offset) => {
    try {
      const { data } = await axios.get("http://localhost:3001/events/all-filtered", {
        params: {
          ...filters,
          offset,
        },
      });
      console.log(data);
      setHasMore(data.more);
      setEvents(data.events);
      return;
    } catch (error) {
      console.log(error);
      return;
    }
  }, []);

  useEffect(() => {
    fetch(
      {
        sorting: "none",
        type: "all",
        browser: "all",
        search: "",
      },
      5
    );
  }, [fetch]);

  function handleChange(
    key: string,
    value: React.ChangeEvent<{ name?: string | undefined; value: unknown }>
  ) {
    setFilters({
      ...filters,
      [key]: value.target.value,
    });
    fetch(
      {
        ...filters,
        [key]: value.target.value,
      },
      5
    );
    setOffset(10);
  }

  const [map, setMap] = useState<google.maps.Map|undefined>(undefined)
  const [markers, setMarkers] = useState<(google.maps.Marker|undefined)[]>([])
  const [infos, setInfos] = useState<(google.maps.InfoWindow|undefined)[]>([])
 
  const onLoad = React.useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds();
    map.fitBounds(bounds);
    setMap(map)
  }, [])

  const onUnmount = React.useCallback(function callback(map) {
    setMap(undefined)
  }, [])

  const markerLoad = (marker:google.maps.Marker) => {
    markers.push(marker)
  }

  const infoLoad = (info:google.maps.InfoWindow) => {
    info.open()
    infos.push(info)

  }

  const styles: any[] = [
    {
      "featureType": "water",
      "elementType": "all",
      "stylers": [
          {
            "color": "#EAE9E8"
          }
      ]
  },
  ]

  const markerClick = (e:google.maps.MouseEvent) => {
    const marker:google.maps.Marker|undefined = markers.find(marker=>{
      return marker?.getPosition() == e.latLng
    })
    const i = markers.indexOf(marker)
    infos[i]?.open(map,marker)
  }

  const clusterOptions = {
    imagePath:
      'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m', // so you must have m1.png, m2.png, m3.png, m4.png, m5.png and m6.png in that folder
  }
  return (
    <>

    <LoadScript
      googleMapsApiKey='AIzaSyD3uRdDcPpdu9aJ5HzF27fHowG86nAQ3zo'

>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={1}
        onLoad={onLoad}
        options={{
          streetViewControl:false,
          center:center,
          mapTypeControl:false,
          fullscreenControl:false,
          scaleControl:true,
          styles: styles,
          minZoom: 2,
          maxZoom: 18,
        }}
        onUnmount={onUnmount}
      >
        <MarkerClusterer 
          options={clusterOptions}
        >
          {(clusterer) =>{
            //@ts-ignore
            return events?.map((event)=>{
              const {geolocation,name,date} = event
              return <Marker
                onLoad={markerLoad}
                onClick={markerClick}
                //@ts-ignore
                position={geolocation.location} 
                clickable={true}
                key={String(geolocation.location?.lat)+String(geolocation.location?.lng)}
                clusterer={clusterer}
              >
                <InfoWindow
                onLoad={infoLoad}
                >
                  <div>
                      <span>
                        name: {name}
                      </span> <br/>
                      <span>
                        time: {new Date(date).toString().slice(0,15)}
                      </span>
                  </div>
                </InfoWindow>
              </Marker>
            })}
          }
        </MarkerClusterer>
        <>
          <LocationsDataDiv> 
            <EventsLog 
              events={events}
              offset={offset}
              hasMore={hasMore}
              handleChange={handleChange}
              setOffset={setOffset}
              filters={filters}
            />
          </LocationsDataDiv>
        </>
      </GoogleMap>
    </LoadScript>
    </>
  )
}
 
export default React.memo(Map)