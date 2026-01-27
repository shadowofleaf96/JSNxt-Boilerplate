'use client';

import { useState } from 'react';
import ForgotPassword from '@/components/auth/ForgotPassword';

function ForgotPasswordPage() {
  const [isOpen, setIsOpen] = useState(true);

  return <ForgotPassword isOpen={isOpen} onClose={() => setIsOpen(false)} />;
}

export default ForgotPasswordPage;
