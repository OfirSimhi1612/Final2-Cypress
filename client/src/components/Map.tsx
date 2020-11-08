import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow, MarkerClusterer } from '@react-google-maps/api';
import { LocationsDataDiv } from '../styledComponents/DashBoard';
import EventsLog from './EventsLog';
import geocoder from '../utils/geocoder';
import { analyticsMachine } from '../machines/analyticsMachine';
import { useMachine } from "@xstate/react";

const containerStyle = {
  width: '100%',
  height: '100%',
};

export interface Cordinates {
  lat: number;
  lng: number;
}

interface Filters {
  sorting: string;
  type: string,
  browser: string,
  search: string,
  state: string;
}

export const LocationString: React.FC<Cordinates> = ({ lat, lng }: Cordinates) => {
  const [location, setLocation] = useState<string | undefined>();
  useEffect(() => {
    async function fetch() {
      const data: string = await geocoder(lat, lng);
      setLocation(data);
    }

    fetch();
  }, []);

  return (
    <>
      {location
        ? (
          <div>
            {location}
          </div>
        )

        : <span>loading...</span>}
    </>
  );
};

const Map: React.FC = () => {
  const [mapCenter, setMapCenter] = useState<Cordinates>({
    lat: 31,
    lng: -25,
  });
  const [mapZoom, setmapZoom] = useState(2);
  const [map, setMap] = useState<google.maps.Map|undefined>(undefined);
  const [markers, setMarkers] = useState<(google.maps.Marker|undefined)[]>([]);
  const [infos, setInfos] = useState<(google.maps.InfoWindow|undefined)[]>([]);
  const [offset, setOffset] = useState<number>(10);
  const [filters, setFilters] = useState({
    sorting: 'none',
    type: 'all',
    browser: 'all',
    search: '',
    state: 'x'
  });
  const [current, send] = useMachine(analyticsMachine);
  const { results } = current.context;
  
  const addLocationToInfo = React.useCallback(async (index: number, {lat, lng}: Cordinates) => {
    const content = infos[index]!.getContent()
    if(typeof content !== 'string' && content.childNodes.length === 2){
      const location = await geocoder(lat, lng);
      const locationDiv = document.createElement("div");    
      locationDiv.textContent = location;
      locationDiv.id = 'locationDiv'         
      content.appendChild(locationDiv)
      infos[index]!.setContent(content);
    }     
  }, [])

  const focusOnEvent = React.useCallback(async ({ lat, lng }: Cordinates) => {
    const marker = markers.find((marker) => marker?.getPosition()?.toString() === `(${lat}, ${lng})`);
    const i = markers.indexOf(marker);
    await addLocationToInfo(i, {lat, lng})
    infos[i]!.open(map, marker);
    setMapCenter({
      lat,
      lng: lng - 20, // need to find another solution...
    });
    setmapZoom(5);
  }, []);

  const fetch = React.useCallback(async (filters: Filters, offset: number) => {
    send('FETCH', { 
      params: 'all-filtered', 
      query: {
        ...filters,
        offset,
      }
    })
  }, []);

  useEffect(() => {
    fetch(filters, 5)
  }, []);

  function handleChange(
    key: string,
    value: React.ChangeEvent<{ name?: string | undefined; value: unknown }>,
  ) {
    setOffset(10);
    const newFilters: Filters = {
      ...filters,
      [key]: value.target.value,
    }
    setFilters(newFilters);
    fetch(newFilters, 5)
    
  }

  const markerLoad = (marker:google.maps.Marker) => {
    markers.push(marker);
  };

  const infoLoad = (info:google.maps.InfoWindow) => {
    info.open();
    infos.push(info);
  };

  const styles: any[] = [
    {
      featureType: 'water',
      elementType: 'all',
      stylers: [
        {
          color: '#ffffff',
        },
      ],
    },
  ];

  const onLoad = React.useCallback((mapRef) => {
    setMap(mapRef);
  }, []);

  const onUnmount = React.useCallback(() => {
    setMap(undefined);
  }, []);

  const markerClick = async (e:google.maps.MouseEvent) => {
    const marker:google.maps.Marker|undefined = markers.find((marker) => marker?.getPosition() === e.latLng);
    const i = markers.indexOf(marker);
    await addLocationToInfo(i, {lat: e.latLng.lat(), lng: e.latLng.lng()})
    infos[i]!.open(map, marker);
  };

  const clusterOptions = {
    imagePath:
      'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m', // so you must have m1.png, m2.png, m3.png, m4.png, m5.png and m6.png in that folder
  };

  const MAP_BOUNDS = {
    north: 84,
    south: -84,
    west: -180,
    east: 180,
  };

  return (
    <>
      <LoadScript
        googleMapsApiKey="AIzaSyD3uRdDcPpdu9aJ5HzF27fHowG86nAQ3zo"
      >
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={mapCenter}
          zoom={mapZoom}
          onLoad={onLoad}
          options={{
            streetViewControl: false,
            center: mapCenter,
            mapTypeControl: false,
            fullscreenControl: true,
            scaleControl: true,
            styles,
            minZoom: 2,
            maxZoom: 18,
            restriction: {
              latLngBounds: MAP_BOUNDS,
              strictBounds: false
            }
          }}
          onUnmount={onUnmount}
        >
          {results
          && (
            <MarkerClusterer
              options={clusterOptions}
              minimumClusterSize={4}
            >
              {(clusterer) =>
              // @ts-ignore
                results[0]?.map((event, index) => {
                  const { geolocation, name, date } = event;
                  return (
                    <Marker
                      onLoad={markerLoad}
                      onClick={markerClick}
                      // @ts-ignore
                      position={geolocation.location}
                      clickable
                      key={String(geolocation.location?.lat) + String(geolocation.location?.lng)}
                      clusterer={clusterer}
                    >
                      <InfoWindow
                        onLoad={infoLoad}
                      >
                        <>
                          <div>{name}</div>
                          <div>{new Date(date).toDateString()}</div>
                        </>
                      </InfoWindow>
                    </Marker>
                  );
                }) }
            </MarkerClusterer>
          )}
          <>
          {results &&
            <LocationsDataDiv>
              <EventsLog
                events={results[0]}
                offset={offset}
                hasMore={results[1]}
                handleChange={handleChange}
                setOffset={setOffset}
                filters={filters}
                fetch={fetch}
                focusOnEvent={focusOnEvent}
              />
            </LocationsDataDiv>
          }
          </>
        </GoogleMap>
      </LoadScript>
    </>
  );
};

export default Map;
