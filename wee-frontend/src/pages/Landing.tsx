import styled from 'styled-components';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LoginModal from '../components/LoginModal';
import RoomModal from '../components/RoomModal';
import bookImage from '../assets/reading-book.png';
import poem from '../assets/poem.png';
import { useNavigate } from 'react-router-dom';
import { deleteCookie, getCookie } from '../utils';
import { useRoom } from '../hooks/useRoom';
import { toast } from 'react-toastify';
import { useState } from 'react';

const Landing = () => {
  const navigate = useNavigate();
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isRoomModalOpen, setRoomModalOpen] = useState(false);
  const [isAnimating, setAnimating] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!getCookie('accessToken'));

  const { getRooms, createRoom } = useRoom();

  const navigateToChat = async () => {
    try {
      const roomsResult = await getRooms.refetch();
      const rooms = roomsResult.data;
      
      if (!rooms?.length) {
        setRoomModalOpen(true);
        return false;
      }
      
      navigate(`/chat/${rooms[0].id}`);
      return true;
    } catch (error) {
      toast.error('채팅방 정보를 불러오는 중 오류가 발생했습니다.');
      return false;
    }
  };

  const openLoginModal = () => {
    setAnimating(false);
    setLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setAnimating(true);
    setLoginModalOpen(false);
  };

  const handleLoginSuccess = async () => {
    setIsLoggedIn(true);
    setLoginModalOpen(false);
    const navigated = await navigateToChat();
    if (navigated) {
      toast.success('로그인 성공! 상담 페이지로 이동합니다.');
    }
  };

  const handleLogout = () => {
    console.log('로그아웃 완료');
    deleteCookie('accessToken');
    setIsLoggedIn(false);
    navigate('/');
  };

  const handleGoChat = async () => {
    if (!isLoggedIn) {
      openLoginModal();
      return;
    }
    await navigateToChat();
  };

  const handleCreateRoom = async (roomName: string) => {
    try {
      const newRoom = await createRoom.mutateAsync({ name: roomName });
      setRoomModalOpen(false);
      toast.success('방 생성이 완료되었습니다!');
      navigate(`/chat/${newRoom.id}`);
    } catch (error) {
      toast.error('채팅방 생성에 실패했습니다.');
    }
  };

  return (
    <Container>
      <Header onLoginClick={openLoginModal} isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      <FirstSection>
        <div className='inner'>
          <div className='first-left'>
            <p>청소년 정서케어 솔루션</p>
            <h3>AI 위클래스</h3>
            <button onClick={handleGoChat}>상담하러 가기</button>
          </div>
          <img src={bookImage} alt='' />
        </div>
      </FirstSection>
      <SecondSection>
        <div className='inner'>
          <img src={poem} alt='' width={'336px'} height={'240px'} />
          <div className='second-right'>
            <h3>
              청소년들의 <span style={{ color: '#8161DF' }}>생생한 고민</span>,<br /> AI 위클래스와 함께 스마트하게
              관리하세요.
            </h3>
            <p>
              청소년들에게 익숙한 디지털 환경에서
              <br /> AI가 선생님을 대신하여 청소년들의 고민을 <br />
              심도있게 들어줍니다.
            </p>
          </div>
        </div>
      </SecondSection>

      {isLoginModalOpen && (
        <LoginModal
          onClose={closeLoginModal}
          onLoginSuccess={handleLoginSuccess}
          className={isAnimating ? 'fade-out' : ''}
        />
      )}

      {isRoomModalOpen && (
        <RoomModal
          onClose={() => setRoomModalOpen(false)}
          onCreate={handleCreateRoom}
        />
      )}

      <Footer />
    </Container>
  );
};

const Container = styled.div``;

const FirstSection = styled.section`
  * {
    white-space: nowrap;
  }
  width: 100%;
  margin-top: 60px;
  height: 400px;
  .inner {
    img {
      height: 400px;
      width: auto;
    }
    display: flex;
    justify-content: space-between;
    align-items: center;
    p {
      font-size: 24px;
      margin-bottom: 10px;
    }
    h3 {
      font-size: 32px;
      color: #8161df;
    }
    button {
      width: 110px;
      height: 36px;
      background-color: #8161df;
      color: #fff;
      border-radius: 5px;
      font-weight: 500;
      font-size: 1rem;
      margin-top: 40px;
    }
  }
  @media only screen and (max-width: 1000px) {
    height: 350px;
    .inner {
      img {
        height: 350px;
      }
    }
  }
  @media only screen and (max-width: 820px) {
    .inner {
      padding-top: 100px;
      img {
        display: none;
      }
    }
  }
`;

const SecondSection = styled.section`
  width: 100%;
  .inner {
    display: flex;
    align-items: center;
    img {
      border: 1px solid #ebe7f5;
      border-radius: 10px;
      box-shadow: rgba(129, 97, 223, 0.1) 0px 4px 20px;
    }
    .second-right {
      padding: 150px 0;
      margin-left: 100px;
      h3 {
        font-size: 2rem;
        line-height: 45px;
        margin-bottom: 40px;
        font-weight: 600;
        white-space: nowrap;
      }
      p {
        line-height: 30px;
        color: #676767;
        font-size: 20px;
        white-space: nowrap;
      }
    }
  }
  @media only screen and (max-width: 1000px) {
    background-color: #f6f4fc;
    .inner {
      img {
        display: none;
      }
      .second-right {
        margin: 0;
        h3 {
          font-size: 1.8rem;
          white-space: wrap;
          line-height: 40px;
        }
      }
    }
  }
`;

export default Landing;