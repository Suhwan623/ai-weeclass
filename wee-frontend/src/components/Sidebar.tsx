import styled from 'styled-components';

interface RoomResponseType {
  id: number;
  name: string;
  userId: number;
}

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  currentRoomId?: number;
  onRoomSelect: (roomId: number) => void;
  onCreateRoom: () => void;
  rooms: RoomResponseType[];
}

const Sidebar = ({ isOpen, onToggle, currentRoomId, onRoomSelect, onCreateRoom, rooms }: SidebarProps) => {

    const handleCreateRoomClick = () => {
        onCreateRoom(); // ✅ 모달 열기만
      };    
  return (
    <>
      <SidebarOverlay isOpen={isOpen} onClick={onToggle} />
      <SidebarContainer isOpen={isOpen}>
        <SidebarHeader>
          <HeaderTitle>채팅 목록</HeaderTitle>
          <CloseButton onClick={onToggle}>×</CloseButton>
        </SidebarHeader>

        <NewChatButton onClick={handleCreateRoomClick}>
          <span>+</span>
          새로운 채팅 시작
        </NewChatButton>

        <ChatRoomList>
          {rooms.map(room => (
            <ChatRoomItem
              key={room.id}
              isActive={room.id === currentRoomId}
              onClick={() => onRoomSelect(room.id)}
            >
              {room.name}
            </ChatRoomItem>
          ))}
        </ChatRoomList>

        <SidebarFooter>
          <FooterText>AI 상담사와 함께하는 마음 치유</FooterText>
        </SidebarFooter>
      </SidebarContainer>
    </>
  );
};

const SidebarOverlay = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'isOpen',
})<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: transparent;
  z-index: 998;
  display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
  transition: opacity 0.3s ease;
`;

const SidebarContainer = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'isOpen',
})<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 350px;
  height: 100vh;
  background-color: #fff;
  z-index: 999;
  transform: translateX(${({ isOpen }) => (isOpen ? '0' : '-100%')});
  transition: transform 0.3s ease;
`;

const SidebarHeader = styled.div`
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #8161df;
  color: #fff;
`;

const HeaderTitle = styled.h2`
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0;
`;

const CloseButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.2);
  color: #fff;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.3);
  }
`;

const NewChatButton = styled.button`
  margin: 20px;
  padding: 15px 20px;
  background-color: #8161df;
  color: #fff;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 10px;
  
  span {
    font-size: 1.2rem;
    font-weight: bold;
  }
  
  &:hover {
    background-color: #7055d1;
    cursor: pointer;
  }
`;

const ChatRoomList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0 10px;
  
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

const ChatRoomItem = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'isActive',
})<{ isActive: boolean }>`
  padding: 15px 10px;
  margin: 5px 0;
  border-radius: 10px;
  cursor: pointer;
  background-color: ${({ isActive }) => (isActive ? '#f6f4fc' : 'transparent')};
  border: ${({ isActive }) => (isActive ? '2px solid #8161df' : '2px solid transparent')};
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ isActive }) => (isActive ? '#f6f4fc' : '#f9f9f9')};
    transform: translateX(5px);
  }
`;

const SidebarFooter = styled.div`
  padding: 20px;
  border-top: 1px solid #f0f0f0;
  background-color: #f9f9f9;
`;

const FooterText = styled.p`
  font-size: 0.85rem;
  color: #666;
  text-align: center;
  margin: 0;
  line-height: 1.4;
`;

export default Sidebar;
