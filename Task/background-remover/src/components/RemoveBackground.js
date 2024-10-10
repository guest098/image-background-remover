import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setActionStatus } from "../features/removeBackground";
import loadImage from "blueimp-load-image";

export default function RemoveBackground() {
  const status = useSelector((state) => state.status.bgRemoved);
  const dispatch = useDispatch();
  let blob = null;
  let image = null; 
  const [selectedFile, setSelectedFile] = useState(null);
  const imgUpload = (e) => {
    const img = e.target.files[0];
    var input = document.getElementById("upload");
    var infoArea = document.getElementById("upload-label");
    var fileName = input.files[0].name;
    infoArea.textContent = "File name: " + fileName;
    setSelectedFile(img);
  };
  const createDivElements = () => {
    const divElements = [];
    for (let index = 0; index < 8; index++) {
      divElements.push(<div key={index}></div>);
    }
    return divElements;
  };
  const uploadImage = async () => {
    dispatch(setActionStatus(false));

    if (!selectedFile) {
      alert("Please select an image before removing the background.");
      return;
    }
    const resizedImage = await loadImage(selectedFile, {
      maxWidth: 1500,
      maxHeight: 1500,
      canvas: true,
    });
    resizedImage.image.toBlob(async function (inputBlob) {
      const formData = new FormData();
      formData.append("image_file", inputBlob);

      const response = await fetch("https://api.remove.bg/v1.0/removebg", {
        method: "POST",
        headers: {
          "X-Api-Key": "DHvAJE9cy3FrgbDsdDGwGhEb",
        },
        body: formData,
      });
      if (response.status === 200) {
        dispatch(setActionStatus(true));
      } else {
        dispatch(setActionStatus(false));
      }
      const outputBlob = await response.blob();
      blob = URL.createObjectURL(outputBlob);
      const image = document.getElementById("imageResult");
      const down = document.getElementById("down");
      image.src = blob;
      down.href = blob;
      down.download = "save.png";
    });
  };
  return (
    <div className="row py-4">
      <div className="col-lg-6 mx-auto text-center">
        <div className="input-group mb-3 px-2 py-2 rounded-pill bg-white shadow-sm">
          <input
            id="upload"
            type="file"
            onChange={imgUpload}
            className="form-control border-0"
          />
          <label
            id="upload-label"
            htmlFor="upload"
            className="font-weight-light text-muted"
          >
            Choose file
          </label>
          <div className="input-group-append">
            <label htmlFor="upload" className="btn btn-light m-0 rounded-pill px-4">
              {" "}
              <i className="fa fa-cloud-upload mr-2 text-muted"></i>
              <small className="text-uppercase font-weight-bold text-muted">
                Choose file
              </small>
            </label>
          </div>
        </div>
        <button
          className="btn btn-outline-light remove-button"
          onClick={uploadImage}
        >
          Remove Background
        </button>
        <div>
          <div className="row py-4">
            <div className="col-lg-6 mx-auto text-center">
              <p className="font-italic text-white text-center">
                The result will be rendered inside the box below.
              </p>
              <div className="image-area mt-4 justify-content-center">
                {status === false ? (
                  <div className="lds-roller mb-3">
                    {createDivElements()}
                  </div>
                ) : (
                  <img
                    id="imageResult"
                    src="#"
                    alt=""
                    className="img-fluid rounded shadow-sm mx-auto d-block"
                  />
                )}{" "}
              </div>
              {status ? (
                <a id="down">
                  <button className="btn btn-light down-button">
                    {" "}
                    <i className="fas fa-download" /> Download
                  </button>
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
