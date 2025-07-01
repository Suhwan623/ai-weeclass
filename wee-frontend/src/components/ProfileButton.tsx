import { useEffect, useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';

interface ProfileButtonProps {
  isLoggedIn: boolean;
  onLoginClick: () => void;
  onLogout: () => void;
  onChatClick: () => void;
}

const ProfileButton = ({ isLoggedIn, onLoginClick, onLogout, onChatClick }: ProfileButtonProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('click', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [isMenuOpen]);

  const handleProfileClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <StyledProfileButton ref={menuRef}>
      {isLoggedIn ? (
        <>
          <img src='/user-icon.png' alt='User Profile' onClick={handleProfileClick} />
          <ProfileMenu className={isMenuOpen ? 'show' : 'hide'}>
          <li onClick={onChatClick}>상담하기</li>
            <li onClick={onLogout}>로그아웃</li>
          </ProfileMenu>
        </>
      ) : (
        <button className='header-login' onClick={onLoginClick}>
          로그인
        </button>
      )}
    </StyledProfileButton>
  );
};

const showMenuAnimation = keyframes`
  0% {
    opacity: 0;
    transform: translateY(-10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

const ProfileMenu = styled.ul`
  position: absolute;
  top: 60px;
  right: 0;
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  list-style: none;
  padding: 10px 0;
  opacity: 0;
  transform: translateY(-10px);
  animation-duration: 0.3s;
  animation-timing-function: ease-in-out;

  &.show {
    animation-name: ${showMenuAnimation};
    opacity: 1;
    transform: translateY(0);
  }

  li {
    padding: 10px 20px;
    cursor: pointer;

    &:hover {
      background-color: #f0f0f0;
    }

    a {
      text-decoration: none;
      color: #333;
    }
  }
`;

const StyledProfileButton = styled.div`
  position: relative;
  cursor: pointer;
  width: auto;
  height: 36px;
  display: flex;
  align-items: center;
  transition: all 0.2s ease;

  img {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    object-fit: cover;

    &:hover,
    &:focus {
      filter: brightness(0.9);
    }
  }
`;

export default ProfileButton;
