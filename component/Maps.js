import React from "react";
import { Fragment, useState, useCallback, useEffect } from "react";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { HeatmapLayerF, MarkerF } from "@react-google-maps/api";
import { Dialog, Transition } from "@headlessui/react";
import { InfoWindow } from "@react-google-maps/api";
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
];

const containerStyle = {
  height: "100%",
};

const center = {
  lat: 13.72,
  lng: 100.498,
};

function MyComponent(props) {
  const { isLoaded } = useJsApiLoader({
    libraries: ["visualization"],
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyBv-q3qRdY4WeAmR940r8LWmQjrz6b8RII",
  });

  const [map, setMap] = React.useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [modal_data, setModal_data] = useState(null);

  const onLoad = React.useCallback(function callback(map) {
    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  const [currentZoom, setCurrentZoom] = React.useState(18);
  const [marker, setMarker] = React.useState(1);
  function handleZoomChanged() {
    handleClick(this.getZoom());
    setCurrentZoom(this.getZoom());
    if (this.getZoom() <= 13) {
      setMarker(0);
      heatmap.setMap(map);
    } else {
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

  const markers =
    marker == 1 && props.data != 0 ? (
      props.data.map((item, index) => (
        <MarkerF
          position={{ lat: item.lat, lng: item.long }}
          key={index}
          onClick={() => {
            setModal_data(item);
            openModal();
          }}
          // label={index.toString()}
          icon={"/icon_air.png"}
        ></MarkerF>
      ))
    ) : (
      <></>
    );

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={currentZoom}
      onZoomChanged={handleZoomChanged}
      onLoad={onLoad}
      onUnmount={onUnmount}
      options={{ disableDefaultUI: true }}
      // onClick
      onClick={props.onClick}
    >
      {/* Marker */}
      {markers}

      {/* Heatmap Layer */}
      {props.data != 0 ? (
        <HeatmapLayerF
          onLoad={onLoadHeatmap}
          data={props.data.map((item, index) => {
            return new google.maps.LatLng(item.lat, item.long);
          })}
        />
      ) : (
        <></>
      )}
      <></>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={closeModal}
        >
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>

            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <Dialog.Title
                  as="h3"
                  className="text-lg mb-4 font-semibold leading-6 text-gray-900"
                >
                  {modal_data?.locationName}
                </Dialog.Title>

                <div className="mt-2">
                  <img src={modal_data?.img}></img>
                </div>
                <p className="mt-4"> {modal_data?.message}</p>
                <p className="mt-4 text-xs">
                  Contribute: {modal_data?.contribute}
                </p>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </GoogleMap>
  ) : (
    <></>
  );
}

export default React.memo(MyComponent);
