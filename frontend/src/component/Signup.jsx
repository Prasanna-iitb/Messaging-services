import React, { useState , useEffect } from 'react';
import { Button, Form, Container, Toast, ToastContainer, Modal } from 'react-bootstrap';
import axios from 'axios';
import * as faceapi from 'face-api.js'
import { useNavigate } from 'react-router-dom';

function SignUp() {
  const [image, setImage] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [showSuccessToast , setShowSuccessToast] = useState(false);
  const [showFailureToast , setShowFailureToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const navigator = useNavigate();

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
      setImage(file);
    } else {
      setShowFailureToast(true);
      setErrorMessage('Please upload a valid JPEG or PNG image.');
    }
  };

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

  const handleSubmit = async (e) => {
     e.preventDefault();
     if (!image) return;
    //here call face api to extract faces
    try{
          const reader = new FileReader();
          reader.readAsDataURL(image);
          reader.onloadend = async () => {
            const base64Image = reader.result;
              const img = new Image();
              img.src = base64Image;
              img.onload = async () => {
                let faceAIData = await faceapi.detectAllFaces(img)
                  .withFaceLandmarks()
                  .withFaceDescriptors()

                 if (faceAIData.length == 1) {
                  const faceFeatures = Array.from(faceAIData[0].descriptor);
                   //now sign him up
                   const config = {
                    headers: {
                      "Content-type": "application/json",
                    },
                  };
                  const { data } = await axios.post(`/api/signup`, {name , email , faceFeatures}, config);
                  
                  setShowSuccessToast(true);
                  setTimeout(()=>{
                    navigator("/")
                  }, 2000)

                }
                else{
                  setShowFailureToast(true);
                  setErrorMessage('More than one face detected');
                  return
                }
              }
          }
      }
      catch(error){
        setShowFailureToast(true);
        setErrorMessage(error)
      }
  }

  return (
    <Container className="w-25 p-4 m-4 bg-secondary rounded">
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-2" controlId="formBasicUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter username"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-2" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>
        
        <Form.Group controlId="formFile" className="mb-3">
            <Form.Label>Image</Form.Label>
            <Form.Control 
             type="file" 
             accept='image/jpg , image/png'
             onChange={handleImageUpload}
             required/>
        </Form.Group>
        
        <Button type="submit" className="btn btn-dark">
          Submit
        </Button>
      </Form>

      <ToastContainer position="top-end" className="p-3">
        <Toast
          bg="success"
          onClose={() => setShowSuccessToast(false)}
          show={showSuccessToast}
          delay={3000}
          autohide
        >
          <Toast.Header>
            <strong className="me-auto">Successfully Registered</strong>
          </Toast.Header>
          <Toast.Body>Redirecting to Login Page</Toast.Body>
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

    </Container>
  );
}

export default SignUp;
