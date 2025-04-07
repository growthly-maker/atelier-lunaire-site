import React from 'react';
import { FiAlertCircle, FiCheckCircle, FiInfo, FiXCircle } from 'react-icons/fi';

export default function Alert({ type = 'info', message, className = '' }) {
  // Déterminer les classes et l'icône en fonction du type d'alerte
  let bgColor, textColor, borderColor, Icon;

  switch (type) {
    case 'success':
      bgColor = 'bg-green-50';
      textColor = 'text-green-800';
      borderColor = 'border-green-400';
      Icon = FiCheckCircle;
      break;
    case 'error':
      bgColor = 'bg-red-50';
      textColor = 'text-red-800';
      borderColor = 'border-red-400';
      Icon = FiXCircle;
      break;
    case 'warning':
      bgColor = 'bg-yellow-50';
      textColor = 'text-yellow-800';
      borderColor = 'border-yellow-400';
      Icon = FiAlertCircle;
      break;
    case 'info':
    default:
      bgColor = 'bg-blue-50';
      textColor = 'text-blue-800';
      borderColor = 'border-blue-400';
      Icon = FiInfo;
      break;
  }

  return (
    <div className={`${bgColor} ${textColor} border-l-4 ${borderColor} p-4 rounded ${className}`} role="alert">
      <div className="flex items-center">
        <Icon className="mr-2 flex-shrink-0" />
        <p>{message}</p>
      </div>
    </div>
  );
}