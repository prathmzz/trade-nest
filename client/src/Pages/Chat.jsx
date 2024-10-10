import React from 'react';

const Chat = () => {
  // You can define a default message or any other necessary configuration here
  const defaultMessage = "Hi! I'm interested in a product.";
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(defaultMessage)}`;

  return (
    <>
      <h1>Chat via WhatsApp</h1>
      <p>Click the link below to start chatting:</p>
      <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
        Open WhatsApp Chat
      </a>
      {/* You can further enhance this page as per your design needs */}
    </>
  );
};

export default Chat;
