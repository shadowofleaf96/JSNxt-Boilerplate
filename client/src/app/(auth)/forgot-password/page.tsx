"use client"

import React, { useState } from "react";
import ForgotPassword from "./components/ForgotPassword";

function ForgotPasswordPage() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <ForgotPassword
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
    />
  );
}

export default ForgotPasswordPage;
