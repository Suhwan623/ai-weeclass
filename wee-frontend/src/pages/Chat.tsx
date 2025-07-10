import styled from 'styled-components';
import chatInputBtn from '../assets/chat-inputbtn.png';
import smile from '../assets/smileface.png';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../components/Header';
import LoginModal from '../components/LoginModal';
import Sidebar from '../components/Sidebar';
import { deleteCookie, getCookie } from '../utils';
import { useChat } from '../hooks/useChat';
import type { MessageType, Sender } from '../types/message.type';
import { useEffect, useState } from 'react';
import { useRoom } from '../hooks/useRoom';
import CreateRoomModal from '../components/RoomModal';
import DeleteModal from '../components/DeleteModal';
import { Toastify } from '../toastify';

const Chat = () => {
  const { roomId } = useParams();
  const numericRoomId = Number(roomId);
  const navigate = useNavigate();
  const accessToken = getCookie('accessToken');
  const [isLoggedIn, setIsLoggedIn] = useState(!!accessToken);
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isAnimating, setAnimating] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isCreateRoomModalOpen, setCreateRoomModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [targetRoomId, setTargetRoomId] = useState<number | null>(null);
  const [justCreatedRoom, setJustCreatedRoom] = useState(false); // ✅ 최근 생성 여부
  const { getRooms, createRoom, updateRoom, deleteRoom } = useRoom();

  useEffect(() => {
    if (
      isLoggedIn &&
      getRooms.isSuccess &&
      !getRooms.isFetching &&
      (getRooms.data?.length ?? 0) === 0 &&
      !justCreatedRoom
    ) {
      setCreateRoomModalOpen(true);
    }
  }, [isLoggedIn, getRooms.data, getRooms.isFetching, getRooms.isSuccess, justCreatedRoom]);

  const handleCreateRoom = async (roomName: string) => {
    try {
      const created = await createRoom.mutateAsync({ name: roomName });
      Toastify({
        type: 'success',
        message: '새 채팅방이 생성되었습니다!',
        iconType: 'success',
      });
      setSidebarOpen(false);
      setJustCreatedRoom(true); // ✅ 생성됨 표시
      navigate(`/chat/${created.id}`);
    } catch (error) {
      Toastify({
        type: 'error',
        message: '채팅방 생성에 실패했습니다.',
        iconType: 'error',
      });
    }
  };

  const handleUpdateRoom = async (roomId: number, newName: string) => {
    try {
      await updateRoom.mutateAsync({ id: roomId, name: newName });
      Toastify({ type: 'success', message: '채팅방 이름이 수정되었습니다.' });
      getRooms.refetch();
    } catch (error) {
      Toastify({ type: 'error', message: '채팅방 이름 수정에 실패했습니다.' });
    }
  };

  const handleDeleteClick = (roomId: number) => {
    setTargetRoomId(roomId);
    setDeleteModalOpen(true);
  };

  const confirmDeleteRoom = async () => {
    if (targetRoomId === null) return;

    try {
      await deleteRoom.mutateAsync(targetRoomId);
      Toastify({
        type: 'success',
        message: '채팅방이 삭제되었습니다.',
        iconType: 'success',
      });

      const remainingRooms = getRooms.data?.filter((room) => room.id !== targetRoomId) || [];
      navigate(remainingRooms.length > 0 ? `/chat/${remainingRooms[0].id}` : '/');
      getRooms.refetch();
    } catch (error) {
      Toastify({
        type: 'error',
        message: '채팅방 삭제에 실패했습니다.',
        iconType: 'error',
      });
    } finally {
      setDeleteModalOpen(false);
      setTargetRoomId(null);
    }
  };

  const { messages, question, setQuestion, sendMessage } = useChat(numericRoomId);

  const openLoginModal = () => {
    setAnimating(false);
    setLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setAnimating(true);
    setLoginModalOpen(false);
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    deleteCookie('accessToken');
    setIsLoggedIn(false);
    navigate('/');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const handleRoomSelect = (roomId: number) => {
    navigate(`/chat/${roomId}`);
    setSidebarOpen(false);
  };

  return (
    <Container>
      <Header 
        onLoginClick={openLoginModal} 
        isLoggedIn={isLoggedIn} 
        onLogout={handleLogout}
        onMenuClick={toggleSidebar}
        isSidebarOpen={isSidebarOpen}
      />

      {isLoggedIn && (
        <Sidebar 
          isOpen={isSidebarOpen}
          onToggle={toggleSidebar}
          currentRoomId={numericRoomId}
          onRoomSelect={handleRoomSelect}
          onCreateRoom={() => setCreateRoomModalOpen(true)}
          rooms={getRooms.data || []}
          onUpdateRoom={handleUpdateRoom}
          onDeleteRoom={handleDeleteClick}
        />
      )}

      <MainContent isSidebarOpen={isSidebarOpen}>
        <ChatLog>
          {messages.map((msg: MessageType, index: number) => (
            <UserMessage sender={msg.sender} key={index}>
              {msg.sender === 'ai' && <img src={smile} alt="AI" />}
              <Message sender={msg.sender}>{msg.text}</Message>
            </UserMessage>
          ))}
        </ChatLog>

        {!isLoggedIn && (
          <DisabledMessage>
            로그인 후 이용하실 수 있습니다.
            <DisabledButton onClick={openLoginModal}>로그인하기</DisabledButton>
          </DisabledMessage>
        )}

        {isLoggedIn && (
          <StyledInput isSidebarOpen={isSidebarOpen}>
            <input
              type="text"
              placeholder="고민을 자유롭게 얘기해주세요."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            />
            <img src={chatInputBtn} alt="send" className="chat-input-btn" onClick={sendMessage} />
          </StyledInput>
        )}
      </MainContent>

      {isLoginModalOpen && (
        <LoginModal
          onClose={closeLoginModal}
          onLoginSuccess={handleLoginSuccess}
          className={isAnimating ? 'fade-out' : ''}
        />
      )}

      {isCreateRoomModalOpen && (
        <CreateRoomModal
          onClose={() => setCreateRoomModalOpen(false)}
          onCreate={handleCreateRoom}
        />
      )}

      {isDeleteModalOpen && targetRoomId !== null && (
        <DeleteModal
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={confirmDeleteRoom}
        />
      )}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100vh;
  background-color: #f6f4fc;
  flex-direction: column;
  align-items: center;
  position: relative;
`;

const MainContent = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'isSidebarOpen'
})<{ isSidebarOpen: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: calc(100vh - 80px);
  width: 100%;
  transition: margin-left 0.3s ease, width 0.3s ease;
  margin-left: ${({ isSidebarOpen }) => (isSidebarOpen ? '350px' : '0')};
  width: ${({ isSidebarOpen }) => (isSidebarOpen ? 'calc(100% - 350px)' : '100%')};

  @media only screen and (max-width: 480px) {
    margin-left: 0;
    width: 100%;
  }
`;

const DisabledMessage = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 1.8rem;
  font-weight: bold;
  color: #000;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 50px;
  z-index: 10;
`;

const DisabledButton = styled.button`
  border-radius: 10px;
  width: 400px;
  height: 50px;
  font-size: 1.2rem;
  color: #fff;
  font-weight: 500;
  background-color: #8161df;
`;

const ChatLog = styled.div`
  width: 100%;
  height: calc(100% - 100px);
  border-radius: 10px;
  padding: 0 20px;
  padding-top: 100px;
  display: flex;
  align-items: center;
  flex-direction: column;
  overflow-y: scroll;
  gap: 20px;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
  }
`;

const UserMessage = styled.div<{ sender: Sender }>`
  width: 100%;
  max-width: 1000px;
  display: flex;
  justify-content: ${({ sender }) => (sender === 'user' ? 'flex-end' : 'flex-start')};
  img {
    display: ${({ sender }) => (sender === 'ai' ? 'block' : 'none')};
    width: 40px;
    height: 40px;
    margin-right: 10px;
  }
`;

const Message = styled.span<{ sender: Sender }>`
  display: inline-block;
  min-width: 60px;
  text-align: left;
  position: relative;
  padding: 10px 15px;
  color: ${({ sender }) => (sender === 'user' ? '#fff' : '#000')};
  background-color: ${({ sender }) => (sender === 'user' ? '#8161df' : '#fff')};
  box-shadow: rgba(115, 90, 186, 0.1) 0px 4px 10px;
  border-radius: 15px;
  margin: 5px;
  max-width: 80%;
  line-height: 25px;
  font-size: 1rem;
`;

const StyledInput = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'isSidebarOpen'
})<{ isSidebarOpen: boolean }>`
  position: fixed;
  bottom: 0;
  margin-bottom: 40px;
  width: 1000px;
  height: 60px;
  background-color: #fff;
  border: 2px solid #8161df;
  border-radius: 999px;
  padding-left: 20px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0;
  z-index: 10;
  left: 50%;
  transform: translateX(-50%);
  
  /* 사이드바가 열렸을 때 입력창 위치 조정 */
  ${({ isSidebarOpen }) => isSidebarOpen && `
    left: calc(50% + 175px);
  `}
  
  input {
    width: 90%;
    height: 100%;
    padding-left: 20px;
  }
  
  .chat-input-btn {
    width: 32px;
    height: 32px;
    margin-right: 10px;
    transition: all 0.2s ease;
    &:hover {
      filter: brightness(0.9);
      transform: scale(1.01);
      cursor: pointer;
    }
  }
  
  @media only screen and (max-width: 1080px) {
    width: 90%;
  }
  
  @media only screen and (max-width: 480px) {
    left: 50%;
    transform: translateX(-50%);
  }
`;

export default Chat;
