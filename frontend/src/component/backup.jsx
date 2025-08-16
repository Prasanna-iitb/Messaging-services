import React from 'react'
import Webcam from "react-webcam";
import { useCallback , useRef , useState , useEffect } from "react";
import * as faceapi from 'face-api.js';
import axios from 'axios';
import { Button, Form, Container, Toast, ToastContainer, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { ChatState } from '../context/context.jsx';

const Login = () => {
  const webcamRef = useRef(null);
  const [mirrored, setMirrored] = useState(false);
  const [imgSrc , setImgSrc] = useState(null);
  const [showSuccessToast , setShowSuccessToast] = useState(false);
  const [showFailureToast , setShowFailureToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigator = useNavigate();

  const {loggedUser , setLoggedUser} = ChatState();
  
  //loading the model
  useEffect(() => {
    const loadModels = async () => {
      await Promise.all([
          faceapi.nets.ssdMobilenetv1.loadFromUri('./models'),
          faceapi.nets.faceLandmark68Net.loadFromUri('./models'),
          faceapi.nets.faceRecognitionNet.loadFromUri('./models'),
          faceapi.nets.ageGenderNet.loadFromUri('./models'),
      ])
    };
    loadModels();
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!imgSrc) return;
    //here call face api to extract faces
    try{
      const img = new Image();
      img.src = imgSrc;
      let faceAIData = await faceapi.detectAllFaces(img)
      .withFaceLandmarks()
      .withFaceDescriptors()
  
      //then send the extracted face feature to backend
      if (faceAIData.length == 1) {
        const faceFeatures = Array.from(faceAIData[0].descriptor);
         //now sign him up
         const config = {
          headers: {
            "Content-type": "application/json",
          },
        };
        const { data } = await axios.post(`/api/login`, {faceFeatures}, config);
        
        //here check got the data
        //if feature has very close correspondence then only
        //login else throw error
        const distance = faceapi.euclideanDistance(faceFeatures,data.faceFeatures);
        console.log('Euclidean Distance:', distance);
        if(distance < 0.4){
          setLoggedUser(data);
          sessionStorage.setItem("userInfo",JSON.stringify(data));
          setShowSuccessToast(true);
          setTimeout(()=>{
            navigator("/dashboard")
          }, 2000)
        }
        else{
          setShowFailureToast(true);
          setErrorMessage('User not found');
          return
        }
      }
      else{
        setShowFailureToast(true);
        setErrorMessage('More than one face detected');
        return
      }
    }
    catch(error){
      setShowFailureToast(true);
      setErrorMessage(error)
    }
   
  }

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);
  }, [webcamRef]);

  const retake = () => {
      setImgSrc(null);
  };

  return (
     <>
      <div className="container">
        {imgSrc ? (
              <img src={imgSrc} alt="webcam" />
          ) : (
              <Webcam 
               height={600} 
               width={600} 
               ref={webcamRef} 
               mirrored={mirrored} 
               screenshotFormat="image/jpg"
               screenshotQuality={0.8}
               />
          )}
          <div>
              <div>
              <input
                  type="checkbox"
                  checked={mirrored}
                  onChange={(e) => setMirrored(e.target.checked)}
              />
              <label>Mirror</label>
              </div>
          </div>

        <div className="btn-container">
          {imgSrc ? (
            <>
               <Container className="display-flex justify-content-space-between">
                <Button variant="btn btn-dark" onClick={retake}>Retake photo</Button>
                <Button variant="btn btn-dark" onClick={submitHandler}>Submit</Button>
               </Container>
            </>
          ) : (
            <Button variant='btn btn-dark' onClick={capture}>Capture photo</Button>
          )}
        </div>
      </div>
      <ToastContainer position="top-end" className="p-3">
        <Toast
          bg="success"
          onClose={() => setShowSuccessToast(false)}
          show={showSuccessToast}
          delay={3000}
          autohide
        >
          <Toast.Header>
            <strong className="me-auto">Successfully Logged in</strong>
          </Toast.Header>
          <Toast.Body>Redirecting to Dashboard</Toast.Body>
        </Toast>

        <Toast
          bg="danger"
          onClose={() => setShowFailureToast(false)}
          show={showFailureToast}
          delay={3000}
          autohide
        >
          <Toast.Header>
            <strong className="me-auto">Error in registration</strong>
          </Toast.Header>
          <Toast.Body>{errorMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
      </>
      
  );
}

export default Login