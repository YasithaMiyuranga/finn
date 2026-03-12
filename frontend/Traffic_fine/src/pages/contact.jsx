// src/pages/Contact.js
import React from 'react';

const Contact = () => {
  return (
    <div>
      <h1>Contact Us</h1>
      <p>Have a question? Feel free to reach out!</p>
      <form>
        <div>
          <label htmlFor="name">Name:</label>
          <input type="text" id="name" />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" />
        </div>
        <div>
          <label htmlFor="message">Message:</label>
          <textarea id="message"></textarea>
        </div>
        <button type="submit">Send Message</button>
      </form>
    </div>
  );
};

export default Contact;