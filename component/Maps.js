import React from 'react'
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import {HeatmapLayerF, MarkerF} from '@react-google-maps/api';


const data_latlng = [{
  lat: 13.720,
  lng: 100.498
},
{
  lat: 13.721,
  lng: 100.498
},
{
  lat: 13.722,
  lng: 100.498
},
{
  lat: 13.721,
  lng: 100.499
},
{
  lat: 13.720,
  lng: 100.499
}];


const gradient = [
  "rgba(0, 255, 255, 0)",
  "rgba(0, 255, 255, 1)",
  "rgba(0, 191, 255, 1)",
  "rgba(0, 127, 255, 1)",
  "rgba(0, 63, 255, 1)",
  "rgba(0, 0, 255, 1)",
  "rgba(0, 0, 223, 1)",
  "rgba(0, 0, 191, 1)",
  "rgba(0, 0, 159, 1)",
  "rgba(0, 0, 127, 1)",
  "rgba(63, 0, 91, 1)",
  "rgba(127, 0, 63, 1)",
  "rgba(191, 0, 31, 1)",
  "rgba(255, 0, 0, 1)",
];

const containerStyle = {
  height: '100%'
};

const center = {
  lat: 13.720,
  lng: 100.498
};

function MyComponent(props) {
  const { isLoaded } = useJsApiLoader({
    libraries: ['visualization'],
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyBv-q3qRdY4WeAmR940r8LWmQjrz6b8RII",
  })

  const [map, setMap] = React.useState(null)

  const onLoad = React.useCallback(function callback(map) {
    setMap(map)
  }, [])

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null)
  }, [])
  const [currentZoom, setCurrentZoom] = React.useState(18)
  const [marker, setMarker] = React.useState(1);
  function handleZoomChanged() {
    handleClick(this.getZoom());
    setCurrentZoom(this.getZoom());
    if(this.getZoom() <= 13){
      setMarker(0);
      heatmap.setMap(map);
    }
    else{
      setMarker(1);
      heatmap?.setMap(null);
    }
  }
  function handleClick() {
    console.log(currentZoom);
  }
  const [heatmap, setHeatmap] = React.useState(null);
  const onLoadHeatmap = React.useCallback(function callback(maps) {
    setHeatmap(maps);
    maps.setMap(null);
    maps.set("gradient", gradient);
  }, []);

  return isLoaded ? (
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={currentZoom}
        onZoomChanged={handleZoomChanged}
        onLoad={onLoad}
        onUnmount={onUnmount}

        // onClick
        onClick={props.onClick}

      >

      {/* Marker */}
      {(marker == 1) ? data_latlng.map((item, index) => (
        <MarkerF position={item} key={index}></MarkerF>
      )) : <></>
      }
      

      {/* Heatmap Layer */}
      <HeatmapLayerF onLoad={onLoadHeatmap} data={
        data_latlng.map((item, index) => {return new google.maps.LatLng(item.lat, item.lng)} )
      } />
<></>
      </GoogleMap>
  ) : <></>
}

export default React.memo(MyComponent)