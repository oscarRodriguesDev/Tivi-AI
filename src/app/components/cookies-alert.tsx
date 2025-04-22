'use client';

import { useState, useEffect } from 'react';
import { FaCookieBite } from 'react-icons/fa';

interface CookieConsent {
  id: string;
  userId: string;
  accepted: boolean;
  timestamp: Date;
}

const CookiesAlert = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [consent, setConsent] = useState<boolean | null>(null);

  useEffect(() => {
    // Verifica se já existe uma preferência salva
    const savedConsent = localStorage.getItem('cookieConsent');
    if (savedConsent === null) {
      setShowAlert(true);
    } else {
      setConsent(savedConsent === 'true');
    }
  }, []);

  const handleAccept = async () => {
    setConsent(true);
    localStorage.setItem('cookieConsent', 'true');
    setShowAlert(false);

    try {
      const response = await fetch('/api/cookie-consent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accepted: true,
          timestamp: new Date(),
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao salvar consentimento');
      }
    } catch (error) {
      console.error('Erro:', error);
    }
  };

  const handleDecline = async () => {
    setConsent(false);
    localStorage.setItem('cookieConsent', 'false');
    setShowAlert(false);

    try {
      const response = await fetch('/api/cookies-consent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accepted: false,
          timestamp: new Date(),
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao salvar consentimento');
      }
    } catch (error) {
      console.error('Erro:', error);
    }
  };

  if (!showAlert) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800 bg-opacity-70 text-white p-4 z-50">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <FaCookieBite className="text-2xl" />
          <div>
            <p className="font-semibold">Uso de Cookies</p>
            <p className="text-sm">
              Utilizamos cookies para melhorar sua experiência. Ao continuar navegando, você concorda com nossa política de cookies.
            </p>
          </div>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={handleDecline}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded"
          >
            Recusar
          </button>
          <button
            onClick={handleAccept}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
          >
            Aceitar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookiesAlert;
