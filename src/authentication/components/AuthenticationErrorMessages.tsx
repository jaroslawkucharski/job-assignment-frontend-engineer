import React from "react";

const AuthenticationErrorMessages = ({ messages }: { messages: string[] }) => {
  return (
    <ul className="error-messages">
      {messages.map((message) => (
        <li key={message}>{message}</li>
      ))}
    </ul>
  );
};

export default AuthenticationErrorMessages;
