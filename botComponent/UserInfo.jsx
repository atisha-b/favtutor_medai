import React, { useState, useEffect } from "react";
import { db, auth } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";
import { FaSignOutAlt } from "react-icons/fa";
import { RxAvatar } from "react-icons/rx";
import { AiOutlineEdit } from "react-icons/ai";
import { useRouter } from 'next/navigation';
import styled from 'styled-components';

const UserInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  min-height: 100vh;
  padding: 40px 20px;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%);
`;

const UserInfoCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 40px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const EditButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: #f8f9fa;
  border: none;
  cursor: pointer;
  color: #4CAF50;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
  border-radius: 50%;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  &:hover {
    background-color: #4CAF50;
    color: white;
    transform: rotate(360deg);
  }
`;

const Avatar = styled.div`
  width: 140px;
  height: 140px;
  border-radius: 50%;
  margin-bottom: 25px;
  background: ${props => props.src ? `url(${props.src})` : '#f0f0f0'};
  background-size: cover;
  background-position: center;
  border: 4px solid #4CAF50;
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.2);
`;

const UserName = styled.h3`
  font-size: 28px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
  margin-bottom: 8px;
`;

const UserEmail = styled.p`
  font-size: 16px;
  color: #7f8c8d;
  margin-bottom: 30px;
`;

const InfoSection = styled.div`
  width: 100%;
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 25px;
`;

const InfoItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #e9ecef;

  &:last-child {
    border-bottom: none;
  }
`;

const InfoLabel = styled.span`
  font-size: 16px;
  color: #000000;
  font-weight: bold;
`;

const InfoValue = styled.span`
  font-size: 16px;
  color: #2c3e50;
  font-weight: 500;
`;

const LogoutButton = styled.button`
  background-color: white;
  border: 2px solid #4CAF50;
  color: #4CAF50;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  margin-top: 20px;
  display: flex;
  align-items: center;
  padding: 12px 30px;
  border-radius: 12px;
  transition: all 0.2s ease;

  &:hover {
    background-color: #4CAF50;
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(76, 175, 80, 0.2);
  }

  svg {
    margin-right: 12px;
  }
`;

const UserInfo = ({ user, onLogout }) => {
  const [userData, setUserData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      const fetchUserData = async () => {
        const docRef = doc(db, "users", user.uid, "medicalForms", "userdata");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        } else {
          console.log("No data found for this user.");
        }
      };

      fetchUserData();
    }
  }, [user]);

  const handleEditClick = () => {
    router.push('/fill-up-form');
  };

  if (!user || !userData) return null;

  const { displayName, email, photoURL } = user;
  const { weight, symptoms, gender } = userData;

  return (
    <UserInfoContainer>
      <UserInfoCard>
        <EditButton onClick={handleEditClick}>
          <AiOutlineEdit size={24} />
        </EditButton>
        <Avatar src={photoURL} />
        <UserName>{displayName || 'User'}</UserName>
        <UserEmail>{email}</UserEmail>
        <InfoSection>
          <InfoItem>
            <InfoLabel>Weight</InfoLabel>
            <InfoValue>{weight ? `${weight} kg` : 'N/A'}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Gender</InfoLabel>
            <InfoValue>{gender || 'N/A'}</InfoValue>
          </InfoItem>
        </InfoSection>
        <LogoutButton onClick={onLogout}>
          <FaSignOutAlt size={20} />
          Logout
        </LogoutButton>
      </UserInfoCard>
    </UserInfoContainer>
  );
};

export default UserInfo;