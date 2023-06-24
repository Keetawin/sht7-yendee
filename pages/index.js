import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState, useCallback, useEffect } from "react";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import { v4 as uuidv4 } from "uuid";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase";
import { useDropzone } from "react-dropzone";

import { GoogleMap, MarkerF, useJsApiLoader } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
};

export default function Home() {
  const [position, setPosition] = useState(null);
  const [center, setCenter] = useState({ lat: 0, lng: 0 });
  const [data, setData] = useState([]);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyBv-q3qRdY4WeAmR940r8LWmQjrz6b8RII",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "location"));
        const fetchedData = [];
        querySnapshot.forEach((doc) => {
          fetchedData.push(doc.data());
        });
        setData(fetchedData);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCenter({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error(error);
        }
      );
    }
  }, []);

  const handleMapClick = (e) => {
    const { lat, lng } = e.latLng;
    setPosition({ lat: lat(), lng: lng() });
  };

  const [isOpen, setIsOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [uploadData, setUploadData] = useState(null);
  const [acceptedFiles, setAcceptedFiles] = useState([]);

  // const storageRef = getStorage(storage);
  // const imagesListRef = ref(storageRef, "images/");

  const handleFileChange = useCallback((files) => {
    if (files.length > 0) {
      const file = files[0];
      const reader = new FileReader();

      reader.onload = function (onLoadEvent) {
        const result = onLoadEvent.target?.result;
        if (typeof result === "string") {
          setImageSrc(result);
          setUploadData(null);
        }
      };

      reader.readAsDataURL(file);
    }
    setAcceptedFiles(files);
  }, []);

  const handleUpload = useCallback(async () => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      // const storageRef = getStorage(storage); // Update this line
      const imageName = `${file.name}_${uuidv4()}`;
      const fileRef = ref(storage, `images/${imageName}`);

      try {
        await uploadBytes(fileRef, file);
        const downloadUrl = await getDownloadURL(fileRef);

        setImageUrl(downloadUrl);
        setUploadData({ downloadUrl });
        setImageSrc(downloadUrl); // Set the newly uploaded image as the displayed image

        // TODO: Save the image URL to your database
        // Here, you can make an API request to your backend server
        // and pass the imageUrl to save it in your database
      } catch (error) {
        console.error(error);
      }
    }
  }, [acceptedFiles]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    onDrop: handleFileChange,
  });

  const files = acceptedFiles.map((file) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }
  const [message, setMessage] = useState("");
  const [contribute, setContribute] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [locationName, setLocationName] = useState("");

  const [image, setImage] = useState("");
  const [loader, setLoader] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoader(true);

    try {
      const docRef = await addDoc(collection(db, "location"), {
        message: message,
        contribute: contribute,
        lat: position.lat,
        long: position.long,
        img: imageUrl,
        locationName: locationName,
      });

      setLoader(false);
      alert("Your message has been submitted👍");
      setMessage("");
      setContribute("");
      setLatitude(position.lat);
      setLongitude(position.long);
      setLocationName("");
      setImage(imageUrl);
    } catch (error) {
      alert(error.message);
      setLoader(false);
    }
  };

  return (
    <main>
      <button
        className="flex justify-center items-center w-12 h-12 rounded-full bg-[#060047] text-white text-2xl font-bold shadow focus:outline-none hover:bg-[#E90064] transition-colors duration-300"
        onClick={openModal}
      >
        +
      </button>

      {data.map((item) => (
        <div key={item.id}>
          <p>{item.contribute}</p>
          <p>{item.img}</p>
          <p>{item.lat}</p>
          <p>{item.long}</p>
          <p>{item.locatioName}</p>
          <p>{item.message}</p>
        </div>
      ))}

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
                  Add Yenn
                </Dialog.Title>

                {isLoaded ? (
                  <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={center}
                    zoom={12}
                    onClick={handleMapClick}
                  >
                    {position && <MarkerF position={position} />}
                  </GoogleMap>
                ) : (
                  <div>Loading Map...</div>
                )}

                <div className="mt-5">
                  <label
                    htmlFor="poster"
                    className="mb-3 block text-base font-medium text-[#060047]"
                  >
                    Poster Upload
                  </label>
                </div>
                <div>
                  <section>
                    <div
                      {...getRootProps({
                        className:
                          "border-2 border-dashed rounded p-4 mb-4 cursor-pointer bg-white h-24",
                      })}
                    >
                      <input {...getInputProps()} required />
                      <p className="text-gray-500">
                        Drag 'n' drop an image here, or click to select an image
                      </p>
                    </div>
                    <aside>
                      <ul>{files}</ul>
                    </aside>
                  </section>

                  {imageSrc && (
                    <div className="mt-4">
                      <img
                        src={imageSrc}
                        alt="Uploaded"
                        className="max-w-full"
                      />
                      {!uploadData && (
                        <button
                          className="bg-[#060047] text-white px-4 py-2 rounded my-4"
                          onClick={handleUpload}
                        >
                          Upload Image
                        </button>
                      )}
                    </div>
                  )}
                </div>

                <div className="mt-4">
                  <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <label
                        htmlFor="name"
                        className="text-[#060047] font-medium mt-1 sm:mt-5 text-sm sm:text-md"
                      >
                        Location Name
                      </label>
                      <input
                        id="name"
                        onChange={(e) => setLocationName(e.target.value)}
                        value={locationName}
                        name="name"
                        type="text"
                        className="w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                    <div className="mb-4">
                      <label
                        htmlFor="telephone"
                        className="text-[#060047] font-medium mt-1 sm:mt-5 text-sm sm:text-md"
                      >
                        Contribute
                      </label>
                      <input
                        id="telephone"
                        onChange={(e) => setContribute(e.target.value)}
                        value={contribute}
                        name="telephone"
                        type="text"
                        className="w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                    <div className="mb-4">
                      <label
                        htmlFor="website"
                        className="text-[#060047] font-medium mt-1 sm:mt-5 text-sm sm:text-md"
                      >
                        Details
                      </label>
                      <textarea
                        id="website"
                        name="website"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        type="text"
                        className="w-full px-3 py-4 placeholder-gray-400 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                    {/* Add alert component here */}
                    <div className="mt-6">
                      <button
                        className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-[#060047] border border-transparent rounded-md hover:bg-[#E90064] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        type="submit"
                        style={{
                          background: loader ? "#ccc" : "rgb(2, 2, 110)",
                        }}
                      >
                        Submit
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </main>
  );
}
