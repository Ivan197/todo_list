import React from 'react';
import Sidebar from '../components/Sidebar';
import './Home.css'; 

const Home = () => {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-content">
        <h1>Bienvenido al Dashboard</h1>
        <div className="home-container">
          <div className="home-image"></div>
        </div>
      </main>
    </div>
  );
}

export default Home;
