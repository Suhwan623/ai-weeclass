import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import headerLogo from '/header-logo.png';
import ProfileButton from './ProfileButton';
import { toast } from 'react-toastify';
import { getCookie } from '../utils';
import { useRoom } from '../hooks/useRoom';


interface HeaderProps {
  isLoggedIn?: boolean;
  onLoginClick: () => void;
  onLogout: () => void;
}

const Header = ({ isLoggedIn = false, onLoginClick, onLogout }: HeaderProps) => {
  const navigate = useNavigate();
    const { getRooms } = useRoom();

  const handleGoChat = async () => {
    if (!getCookie('accessToken')) {
      toast.warning('로그인이 필요합니다.');
      onLoginClick();
      return;
    }

    try {
      const roomsResult = await getRooms.refetch();
      const rooms = roomsResult.data;

      if (!rooms?.length) {
        toast.info('상담방이 존재하지 않습니다. 먼저 방을 생성해주세요.');
        return;
      }

      navigate(`/chat/${rooms[0].id}`);
    } catch (error) {
      toast.error('채팅방 정보를 불러오는 중 오류가 발생했습니다.');
    }
  };

  return (
    <StyledHeader>
      <div className="inner">
        <HeaderContainer>
          <img
            src={headerLogo}
            alt="AI 위클래스 로고"
            onClick={() => navigate('/')}
            className="header-logo"
          />
          <span className="header-nav">
            <span className="header-nav-introduce" onClick={() => navigate('/')}>
              서비스소개
            </span>
            <ProfileButton
              isLoggedIn={isLoggedIn}
              onLoginClick={onLoginClick}
              onLogout={onLogout}
              onChatClick={handleGoChat}
            />
          </span>
        </HeaderContainer>
      </div>
    </StyledHeader>
  );
};

const HeaderContainer = styled.div`
  * {
    white-space: nowrap;
  }
  display: flex;
  align-items: center;
  justify-content: space-between;

  .header-nav {
    height: 100%;
    display: flex;
    align-items: center;
    gap: 30px;

    span {
      font-weight: 400;
      font-size: 14px;

      &:hover {
        cursor: pointer;
      }
    }

    button {
      width: 80px;
      height: 28px;
      background-color: #8161df;
      color: #fff;
      border-radius: 5px;
      font-weight: 500;
      font-size: 12px;
    }
  }

  .header-logo {
    height: 24px;
    width: auto;
    display: flex;
    gap: 10px;

    &:hover {
      cursor: pointer;
    }

    h3 {
      font-weight: 800;
      color: #8161df;

      &:hover {
        cursor: pointer;
      }
    }
  }
`;

const StyledHeader = styled.header`
  display: flex;
  align-items: center;
  z-index: 50;
  width: 100%;
  height: 60px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(4px);
  border-bottom: 1px solid rgb(238, 238, 238);
  box-shadow: rgba(0, 0, 0, 0.08) 0px -2px 16px;
`;

export default Header;
