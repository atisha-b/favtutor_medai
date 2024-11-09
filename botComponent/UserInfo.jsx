
import React from 'react';
import { FaSignOutAlt } from 'react-icons/fa';

const UserInfo = ({ user, onLogout }) => {
  if (!user) return null;
  const { displayName, email, photoURL, customClaims } = user;

  return (
    <div className="w-1/4 p-2.5 z-50 bg-gradient-to-tr from-[#d0f0c0] to-white shadow-md flex flex-col items-center">
      <img 
        src={photoURL || '/default-avatar.png'} 
        alt="User Photo" 
        className="w-20 h-20 rounded-full mb-2.5"
      />
      <h3 className="text-lg font-semibold">{displayName || 'User'}</h3>
      <p className="text-sm text-gray-600">{email}</p>
      <div className="mt-2.5 text-center">
        <p>Height: {customClaims?.height || 'N/A'}</p>
        <p>Weight: {customClaims?.weight || 'N/A'}</p>
        {/* Add more personal info as needed */}
      </div>
      <button 
        onClick={onLogout}
        className="mt-5 bg-transparent border-none text-[#4CAF50] cursor-pointer hover:text-[#45a049] flex items-center"
      >
        <FaSignOutAlt size={20} className="mr-2" /> Logout
      </button>
    </div>
  );
};

export default UserInfo;