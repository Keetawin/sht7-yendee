import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";

const Form = () => {
  const [message, setMessage] = useState("");
  const [contribute, setContribute] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [image, setImage] = useState("");
  const [loader, setLoader] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoader(true);

    try {
      const docRef = await addDoc(collection(db, "contacts"), {
        message: message,
        contribute: contribute,
        lat: latitude,
        long: longitude,
        img: image,
      });

      setLoader(false);
      alert("Your message has been submitted👍");
      setMessage("");
      setContribute("");
      setLatitude("");
      setLongitude("");
      setImage("");
    } catch (error) {
      alert(error.message);
      setLoader(false);
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h1>Contact Us 🤳</h1>

      <label>Contribute</label>
      <textarea
        placeholder="Contribute"
        value={contribute}
        onChange={(e) => setContribute(e.target.value)}
      ></textarea>

      <label>Latitude</label>
      <input
        placeholder="Latitude"
        value={latitude}
        onChange={(e) => setLatitude(e.target.value)}
      />

      <label>Longitude</label>
      <input
        placeholder="Longitude"
        value={longitude}
        onChange={(e) => setLongitude(e.target.value)}
      />

      <label>Message</label>
      <textarea
        placeholder="Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      ></textarea>

      <label>Image</label>
      <input
        placeholder="Image URL"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />

      <button
        type="submit"
        style={{ background: loader ? "#ccc" : "rgb(2, 2, 110)" }}
      >
        Submit
      </button>
    </form>
  );
};

export default Form;
