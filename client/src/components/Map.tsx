import React, { useState, useEffect, useRef } from 'react';
import {
  GoogleMap, LoadScript, Marker, InfoWindow, MarkerClusterer,
} from '@react-google-maps/api';
import axios from 'axios';
import { Event } from '../models/event';
import { LocationsDataDiv } from '../styledComponents/DashBoard';
import EventsLog from './EventsLog';
import geocoder from '../utils/geocoder';

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
  search: string
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
  const [events, setEvents] = useState<Event[]>([]);
  const [offset, setOffset] = useState<number>(10);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [filters, setFilters] = useState({
    sorting: 'none',
    type: 'all',
    browser: 'all',
    search: '',
  });

  const focusOnEvent = React.useCallback(async ({ lat, lng }: Cordinates) => {
    const marker = markers.find((marker) => marker?.getPosition()?.toString() === `(${lat}, ${lng})`);
    const i = markers.indexOf(marker);
    const location = await geocoder(lat, lng);
    infos[i]!.setContent(`<span>${location}</span>`);
    infos[i]!.open(map, marker);
    setMapCenter({
      lat,
      lng: lng - 20,
    });
    setmapZoom(5);
  }, []);

  const fetch = React.useCallback(async (filters: Filters, offset: number) => {
    try {
      const { data } = await axios.get('http://localhost:3001/events/all-filtered', {
        params: {
          ...filters,
          offset,
        },
      });
      setHasMore(data.more);
      setEvents(data.events);
      return;
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    fetch(
      {
        sorting: 'none',
        type: 'all',
        browser: 'all',
        search: '',
      },
      5,
    );
  }, [fetch]);

  function handleChange(
    key: string,
    value: React.ChangeEvent<{ name?: string | undefined; value: unknown }>,
  ) {
    setOffset(10);
    setFilters({
      ...filters,
      [key]: value.target.value,
    });
    fetch(
      {
        ...filters,
        [key]: value.target.value,
      },
      5,
    );
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
    const location = await geocoder(e.latLng.lat(), e.latLng.lng());
    infos[i]!.setContent(`<span>${location}</span>`);
    infos[i]!.open(map, marker);
  };

  const clusterOptions = {
    imagePath:
      'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m', // so you must have m1.png, m2.png, m3.png, m4.png, m5.png and m6.png in that folder
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
            fullscreenControl: false,
            scaleControl: true,
            styles,
            minZoom: 2,
            maxZoom: 18,
          }}
          onUnmount={onUnmount}
        >
          {events
          && (
            <MarkerClusterer
              options={clusterOptions}
            >
              {(clusterer) =>
              // @ts-ignore
                events?.map((event, index) => {
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
                        <div />
                      </InfoWindow>
                    </Marker>
                  );
                }) }
            </MarkerClusterer>
          )}
          <>
            <LocationsDataDiv>
              <EventsLog
                events={events}
                offset={offset}
                hasMore={hasMore}
                handleChange={handleChange}
                setOffset={setOffset}
                filters={filters}
                fetch={fetch}
                focusOnEvent={focusOnEvent}
              />
            </LocationsDataDiv>
          </>
        </GoogleMap>
      </LoadScript>
    </>
  );
};

export default React.memo(Map);
