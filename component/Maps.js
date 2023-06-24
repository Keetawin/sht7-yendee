import React from 'react'
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import { Marker } from '@react-google-maps/api';
import { HeatmapLayer } from '@react-google-maps/api';


const data_latlng = [{
  lat: 13.720,
  lng: 100.498
},
{
  lat: 13.820,
  lng: 100.498
},
{
  lat: 13.920,
  lng: 100.498
},
{
  lat: 13.720,
  lng: 100.598
},
{
  lat: 13.720,
  lng: 100.698
}];

const containerStyle = {
  height: '100%'
};

const center = {
  lat: 13.720,
  lng: 100.498
};

function MyComponent(props) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyBv-q3qRdY4WeAmR940r8LWmQjrz6b8RII",
    libraries: ['visualization']
  })

  const [map, setMap] = React.useState(null)

  const onLoad = React.useCallback(function callback(map) {
    

    setMap(map)
  }, [])

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null)
  }, [])

  let heatmap = [];

  return isLoaded ? (
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={14}
        onLoad={onLoad}
        onUnmount={onUnmount}

        // onClick
        onClick={props.onClick}

      >

      {/* Marker */}
      {data_latlng.map((item, index) => (
        <Marker position={item} key={index}></Marker>
      ))}

      {/* Heatmap Layer */}
      <HeatmapLayer
        onLoad={
          (heatmap) =>{ heatmap = data_latlng.map((item, index) => {return new google.maps.LatLng(item.lat, item.lng)} )}
        } 
        data={
          heatmap
        } 
      />

      </GoogleMap>
  ) : <></>
}

export default React.memo(MyComponent)