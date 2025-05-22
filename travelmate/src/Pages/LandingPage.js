import React from "react";
import { ParallaxProvider, Parallax } from "react-scroll-parallax";
import "../CSS/Style.css";
import NavBar from "../Components/Navbar";
import AuthForms from '../Components/AuthForms';



const LandingPage = () => {
  return (
    <ParallaxProvider>
      <section className="video-section">
        <NavBar></NavBar>
        <ParallaxProvider>
          <section className="video-section">
            <Parallax speed={-20}>
              <div className="video-wrapper">
                <video
                  className="background-video"
                  autoPlay
                  muted
                  loop
                  playsInline
                >
                  <source
                    src="/Images/9907159-uhd_4096_2160_25fps.mp4"
                    type="video/mp4"
                  />
                </video>
              </div>
            </Parallax>

            <div className="overlay-content">
              <h1>Find a Travel Mate</h1>
              <p>Travel the world together.</p>
            </div>
          </section>
        </ParallaxProvider>

        <div className="curve-divider">
          <svg viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path
              fill="#fff"
              d="M0,224 C480,320 960,0 1440,224 L1440,320 L0,320 Z"
            />
          </svg>
        </div>
      </section>
      <section className="destinations-section">
        <h2>FIND A TRAVEL MATE AND MAKE EVERY TRIP UNFORGETTABLE</h2>
        <p>
          Explore new places, share the moments, and create lasting memories
          together.
          <br />
          Because the best journeys are the ones you don’t take alone.
        </p>

        <div className="destination-grid">
          {[
            {
              name: "Hawaii",
              img: "/Images/hawaii.jpg",
            },
            {
              name: "Cappadocia",
              img: "/Images/cappadocia.jpg",
            },
            {
              name: "Venezia",
              img: "/Images/venezia.jpg",
            },
            {
              name: "Mikonos",
              img: "/Images/mikonos.jpg",
            },
            {
              name: "Switzerland",
              img: "Images/switzerland.jpg",
            },
            {
              name: "Barcelona",
              img: "Images/barcelona.jpg",
            },
          ].map((country, index) => (
            <div
              key={index}
              className="destination-tile"
              style={{ backgroundImage: `url(${country.img})` }}
            >
              <div className="destination-name">{country.name}</div>
            </div>
          ))}
        </div>
      </section>
      <section className="how-it-works-section">
        <h2>How It Works</h2>

        <div className="how-it-works-grid">
          <div className="how-card row">
            <div className="how-text">
              <h3>Find the Perfect Trip</h3>
              <p>
                Start your journey with someone who shares your sense of
                adventure. Here’s how it works!
              </p>
            </div>
            <img src="/Images/travel1.jpg" alt="Explore trip" />
          </div>

          <div className="how-card row">
            <img src="/Images/travel2.jpg" alt="Book a trip" />
            <div className="how-text">
              <h3>Book Your Spot</h3>
              <p>
                Choose a trip that excites you and reserve your place in just a
                few clicks. Your travel buddy will be notified and confirm the
                plan, making it official!
              </p>
            </div>
          </div>

          <div className="how-card row">
            <div className="how-text">
              <h3>Travel Together</h3>
              <p>
                Meet your trip buddy, pack your bags, and explore the world
                together. Shared experiences make unforgettable memories.
              </p>
            </div>
            <img src="/Images/travel3.jpg" alt="Travel together" />
          </div>
        </div>
      </section>

      <section id="login-section">
        <AuthForms />
      </section>

      <section className="three-image-banner">
        <div className="banner-image">
          <img src="/Images/fun.jpg" alt="Beach Fun" />
          <div className="banner-caption">Beach Vibes</div>
        </div>
        <div className="banner-image">
          <img src="/Images/banner2.jpg" alt="Mountain Fun" />
          <div className="banner-caption">Snow Escapes</div>
        </div>
        <div className="banner-image">
          <img src="/Images/banner3.jpg" alt="City Lights" />
          <div className="banner-caption">Mountain Highs</div>
        </div>
      </section>
    </ParallaxProvider>
  );
};

export default LandingPage;
