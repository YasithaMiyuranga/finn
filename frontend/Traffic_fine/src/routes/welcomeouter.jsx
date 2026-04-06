import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { Link } from 'react-router-dom';

// WelcomeOuter React component (welcomeouter.jsx)
// - TailwindCSS classes are used for styling (assumes Tailwind is configured)
// - FontAwesome used via CDN or installed package (you can switch to react-fontawesome)
// - Three.js for the animated particle background
const WelcomeOuter = () => {
  const threeRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const particlesRef = useRef(null);



  useEffect(() => {
    const container = threeRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 50;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio || 1);
    renderer.setClearColor(0x000000, 0);

    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Particles
    const geometry = new THREE.BufferGeometry();
    const particleCount = 200;
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 100;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 100;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 100;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      size: 0.6,
      transparent: true,
      opacity: 0.6,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);
    particlesRef.current = particles;

    // Resize handler
    const onResize = () => {
      if (!cameraRef.current || !rendererRef.current) return;
      cameraRef.current.aspect = window.innerWidth / window.innerHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", onResize);

    let frameId;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      if (particlesRef.current) {
        particlesRef.current.rotation.x += 0.001;
        particlesRef.current.rotation.y += 0.002;
      }
      renderer.render(scene, camera);
    };

    animate();

    

    // Cleanup
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", onResize);
      if (rendererRef.current) {
        rendererRef.current.forceContextLoss();
        if (rendererRef.current.domElement) {
          rendererRef.current.domElement.remove();
        }
        rendererRef.current.dispose();
      }
      geometry.dispose();
      material.dispose();



    };
  }, []);


  const scrollToSection = (e, id) => {
    e.preventDefault();
    const target = document.querySelector(id);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #60a5fa 100%)' }}>
      {/* 3D Background */}
      <div 
     ref={threeRef}
        id="three-container"
        className="absolute inset-0 z-0 pointer-events-none"
        aria-hidden
      />
      
  



      {/* Navigation */}
      <nav className="fixed w-full z-50 px-6 py-4" style={{ backdropFilter: 'blur(16px) saturate(180%)', backgroundColor: 'rgba(168, 60, 60, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              
              <i className="fas fa-car text-blue-600 text-xl"></i>
            </div>
            <span className="text-white text-xl font-bold">eTRAFFIC</span>
          </div>
          <div className="hidden md:flex space-x-8">
            <a href="#home" onClick={(e) => scrollToSection(e, '#home')} className="text-white hover:text-blue-200 transition-colors">Home</a>
            <a href="#features" onClick={(e) => scrollToSection(e, '#features')} className="text-white hover:text-blue-200 transition-colors">Features</a>
            <a href="#about" onClick={(e) => scrollToSection(e, '#about')} className="text-white hover:text-blue-200 transition-colors">About</a>
            <a href="#contact" onClick={(e) => scrollToSection(e, '#contact')} className="text-white hover:text-blue-200 transition-colors">Contact</a>
          </div>
          <div className="flex space-x-4">
           

          <Link to="/auth/login" className="bg-white text-blue-600 px-6 py-2 rounded-full font-medium hover:bg-blue-50 transition-all transform hover:scale-105">
              Login
            </Link>

            <Link to="/auth/register" className="border border-white text-white px-6 py-2 rounded-full font-medium hover:bg-white hover:text-blue-600 transition-all transform hover:scale-105">
              Register
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-center justify-center px-6 pt-20">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="text-white animate-[fadeIn_1s_ease-in]">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Pay Your
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent"> Traffic Fines </span>
              Online
            </h1>
            <p className="text-xl mb-8 text-blue-100 leading-relaxed">
              The official Sri Lankan government platform for secure, convenient traffic fine payments. 
              Access your fines, make payments, and manage your driving record - all in one place.
            </p>


            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">

            <a
                href="/register"
                className="inline-block bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-8 py-4 rounded-full text-lg font-medium hover:shadow-2xl transform hover:scale-105 text-center"
              >
                Get Star
              </a>

              <a
                href="#features"
                className="inline-block bg-white/10 backdrop-blur-md text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-white hover:text-blue-600 transform hover:scale-105 text-center"
              >
                Learn More
              </a>

              
            </div>
            
            <div className="grid grid-cols-3 gap-6 mt-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400">50K+</div>
                <div className="text-blue-200">Fines Paid</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400">24/7</div>
                <div className="text-blue-200">Available</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400">100%</div>
                <div className="text-blue-200">Secure</div>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="rounded-3xl p-8 animate-[floating_3s_ease-in-out_infinite]" style={{ backdropFilter: 'blur(16px) saturate(180%)', backgroundColor: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
              <div className="bg-white rounded-2xl p-6 shadow-2xl">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                    <i className="fas fa-receipt text-white text-xl"></i>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">Quick Pay</h3>
                    <p className="text-gray-600">Pay your fine instantly</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Fine Number:</span>
                    <span className="font-medium">TF-2026-001234</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-bold text-red-600">Rs. 2,500.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Due Date:</span>
                    <span className="font-medium">2026-03-18</span>
                  </div>
                  <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-medium hover:shadow-lg transition-all transform hover:scale-105">
                    Pay Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Why Choose eTRAFFIC?
            </h2>
            <p className="text-xl text-blue-200 max-w-3xl mx-auto">
              Experience the future of traffic fine management with our cutting-edge platform
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: 'fa-shield-alt', gradient: 'from-green-400 to-blue-500', title: 'Secure Payments', desc: 'Bank-level encryption and secure payment gateways ensure your financial information is always protected.' },
              { icon: 'fa-clock', gradient: 'from-purple-400 to-pink-500', title: '24/7 Availability', desc: 'Pay your fines anytime, anywhere. Our system is available round the clock for your convenience.' },
              { icon: 'fa-mobile-alt', gradient: 'from-yellow-400 to-orange-500', title: 'Mobile Friendly', desc: 'Optimized for all devices. Pay your fines seamlessly on desktop, tablet, or mobile phone.' },
              { icon: 'fa-history', gradient: 'from-red-400 to-pink-500', title: 'Payment History', desc: 'Keep track of all your payments with detailed history and downloadable receipts.' },
              { icon: 'fa-bell', gradient: 'from-indigo-400 to-purple-500', title: 'Instant Notifications', desc: 'Get real-time notifications about new fines, payment confirmations, and due date reminders.' },
              { icon: 'fa-headset', gradient: 'from-teal-400 to-blue-500', title: '24/7 Support', desc: 'Our dedicated support team is available around the clock to assist you with any queries.' }
            ].map((feature, idx) => (
              <div key={idx} className="rounded-2xl p-8 hover:bg-black hover:text-gray-800 transition-all duration-300 transform hover:scale-105 group" style={{ backdropFilter: 'blur(16px) saturate(180%)', backgroundColor: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-6`}>
                  <i className={`fas ${feature.icon} text-white text-2xl`}></i>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-black group-hover:text-gray-800">{feature.title}</h3>
                <p className="text-blue-200 group-hover:text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                About eTRAFFIC System
              </h2>
              <p className="text-xl text-blue-200 mb-6 leading-relaxed">
                The Sri Lanka Traffic Fine Payment System is an official government initiative 
                designed to modernize and streamline the traffic fine payment process across the country.
              </p>
              <p className="text-blue-200 mb-8 leading-relaxed">
                Our platform provides a secure, convenient, and transparent way for drivers to 
                manage their traffic violations while giving law enforcement agencies powerful 
                tools for fine management and data analysis.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="rounded-xl p-4" style={{ backdropFilter: 'blur(16px) saturate(180%)', backgroundColor: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
                  <div className="text-2xl font-bold text-yellow-400">Island Wide</div>
                  <div className="text-blue-200">Coverage</div>
                </div>
                <div className="rounded-xl p-4" style={{ backdropFilter: 'blur(16px) saturate(180%)', backgroundColor: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
                  <div className="text-2xl font-bold text-yellow-400">Government</div>
                  <div className="text-blue-200">Approved</div>
                </div>
              </div>
            </div>
            <div className="rounded-3xl p-8" style={{ backdropFilter: 'blur(16px) saturate(180%)', backgroundColor: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
              <div className="bg-white rounded-2xl p-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">System Benefits</h3>
                <div className="space-y-4">
                  {['Reduced processing time', 'Elimination of manual paperwork', 'Real-time payment tracking', 'Enhanced transparency', 'Better resource allocation'].map((benefit, idx) => (
                    <div key={idx} className="flex items-center space-x-3">
                      <i className="fas fa-check-circle text-green-500 text-xl"></i>
                      <span className="text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Get in Touch
            </h2>
            <p className="text-xl text-blue-200">
              Need help? Our support team is here to assist you 24/7
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {[
              { icon: 'fa-phone', gradient: 'from-blue-400 to-purple-500', title: 'Call Us', info: '1919 (Toll Free)' },
              { icon: 'fa-envelope', gradient: 'from-green-400 to-blue-500', title: 'Email', info: 'support@etraffic.gov.lk' },
              { icon: 'fa-clock', gradient: 'from-purple-400 to-pink-500', title: 'Hours', info: '24/7 Support' }
            ].map((contact, idx) => (
              <div key={idx} className="rounded-2xl p-8 text-center" style={{ backdropFilter: 'blur(16px) saturate(180%)', backgroundColor: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
                <div className={`w-16 h-16 bg-gradient-to-r ${contact.gradient} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <i className={`fas ${contact.icon} text-white text-2xl`}></i>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{contact.title}</h3>
                <p className="text-blue-200">{contact.info}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6" style={{ backdropFilter: 'blur(16px) saturate(180%)', backgroundColor: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                  <i className="fas fa-car text-blue-600 text-xl"></i>
                </div>
                <span className="text-white text-xl font-bold">eTRAFFIC</span>
              </div>
              <p className="text-blue-200">
                Official Sri Lankan government platform for traffic fine payments.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-4">Quick Links</h4>
              <div className="space-y-2">
                <a href="#home" onClick={(e) => scrollToSection(e, '#home')} className="block text-blue-200 hover:text-white transition-colors">Home</a>
               <a href="/login" className="block text-blue-200 hover:text-white">Login</a>
                <a href="/register" className="block text-blue-200 hover:text-white">Register</a>
                <a href="#contact" onClick={(e) => scrollToSection(e, '#contact')} className="block text-blue-200 hover:text-white transition-colors">Contact</a>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-4">Services</h4>
              <div className="space-y-2">
                <p className="text-blue-200">Pay Traffic Fines</p>
                <p className="text-blue-200">View Fine History</p>
                <p className="text-blue-200">Download Receipts</p>
                <p className="text-blue-200">Track Payments</p>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-4">Government Links</h4>
              <div className="space-y-2">
                <a href="#" className="block text-blue-200 hover:text-white transition-colors">Police Department</a>
                <a href="#" className="block text-blue-200 hover:text-white transition-colors">DMT</a>
                <a href="#" className="block text-blue-200 hover:text-white transition-colors">gov.lk</a>
                <a href="#" className="block text-blue-200 hover:text-white transition-colors">Privacy Policy</a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-white border-opacity-20 pt-8 text-center">
            <p className="text-blue-200">
              © 2026 Sri Lanka Traffic Fine Payment System. All rights reserved. 
              Government of Sri Lanka.
            </p>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes floating {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      
      <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet" />
    </div>
  );
};

export default WelcomeOuter;