import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

interface HeaderProps {
  onLoginClick: () => void;
  isLoggedIn: boolean;
  onLogout: () => void;
  onMenuClick?: () => void;
  isSidebarOpen?: boolean;
}

const Header = ({ onLoginClick, isLoggedIn, onLogout, onMenuClick }: HeaderProps) => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/');  // 홈 경로로 이동
  };

  return (
    <HeaderContainer>
      <HeaderContent>
      <LeftSection>
  {onMenuClick && (
    <MenuButton onClick={onMenuClick}>
      <MenuIcon>
        <span></span>
        <span></span>
        <span></span>
      </MenuIcon>
    </MenuButton>
  )}
  <Logo onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
    AI 위클래스
  </Logo>
</LeftSection>

        
        <RightSection>
          {isLoggedIn ? (
            <LogoutButton onClick={onLogout}>로그아웃</LogoutButton>
          ) : (
            <LoginButton onClick={onLoginClick}>로그인</LoginButton>
          )}
        </RightSection>
      </HeaderContent>
    </HeaderContainer>
  );
};


const HeaderContainer = styled.header<{ isSidebarOpen?: boolean }>`
  position: fixed;
  top: 0;
  left: ${({ isSidebarOpen }) => (isSidebarOpen ? '350px' : '0')}; // 사이드바 넓이에 맞게 이동
  right: 0;
  height: 80px;
  background-color: #fff;
  border-bottom: 1px solid #e0e0e0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 100;
  transition: left 0.3s ease;
`;


const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const MenuButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background-color: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background-color: #f0f0f0;
  }
`;

const MenuIcon = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  
  span {
    width: 20px;
    height: 2px;
    background-color: #333;
    border-radius: 1px;
    transition: all 0.2s ease;
  }
`;

const Logo = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: #8161df;
  margin: 0;
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const LoginButton = styled.button`
  padding: 10px 20px;
  background-color: #8161df;
  color: #fff;
  border-radius: 8px;
  font-weight: 500;
  font-size: 0.95rem;
  
  &:hover {
    background-color: #7055d1;
  }
`;

const LogoutButton = styled.button`
  padding: 10px 20px;
  background-color: transparent;
  color: #666;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-weight: 500;
  font-size: 0.95rem;
  
  &:hover {
    background-color: #f5f5f5;
    color: #333;
  }
`;

export default Header;