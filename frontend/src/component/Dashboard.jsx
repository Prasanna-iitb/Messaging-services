import React from 'react';
import { ChatState } from '../context/context.jsx';
import { Container, Card, Button } from 'react-bootstrap';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useState , useEffect } from 'react';

const Dashboard = () => {
  const { loggedUser } = ChatState();
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.error("Error accessing geolocation", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);
 
  const attendanceHandler = async () => {

  }


  return (
     <>
      <Container className="m-2 w-25">
        <Card>
          {loggedUser ? (
            <>
              <Card.Header>Welcome, {loggedUser.name}!</Card.Header>
              <Card.Body>
                <Card.Title>User Information</Card.Title>
                <Card.Text>
                  <strong>Name: </strong> {loggedUser.name}
                </Card.Text>
                <Card.Text>
                  <strong>Email: </strong> {loggedUser.email}
                </Card.Text>
              </Card.Body>
            </>
          ) : (
            <Card.Body>
              <Card.Title>Please log in to view your dashboard</Card.Title>
            </Card.Body>
          )}
        </Card>
      </Container>

      <Container className="m-2" style={{ width: "30%" }}>
        <Card style={{ height: "60vh" }}>
          <Card.Header>Live Location</Card.Header>
          <Card.Body style={{ padding: 0 }}>
            <MapContainer 
              center={[19.1308 , 72.9169 ]} 
              zoom={13} 
              scrollWheelZoom={true} 
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[19.1308 , 72.9169]}>
                <Popup>
                  LHC me class hai !!
                </Popup>
              </Marker>
              {userLocation && (
                <Marker position={userLocation}>
                  <Popup>
                    You are here.
                  </Popup>
                </Marker>
              )}
            </MapContainer>
          </Card.Body>
        </Card>
      </Container>

      <Container className="m-2" style={{ width: "20%" }}>
        <Card style={{ height: "60vh" }}>
          <Card.Header>Mark Attendance</Card.Header>
          <Card.Body className="d-flex align-items-center justify-content-center">
            <Button variant="dark" onClick={attendanceHandler}>
              Mark
            </Button>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
};

export default Dashboard;
