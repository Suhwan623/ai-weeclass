import styled from 'styled-components';
import React, { useState } from 'react';
import penIcon from '../assets/pen.png';
import trashIcon from '../assets/trash.png';
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
  onUpdateRoom: (id: number, name: string) => void;
  onDeleteRoom: (id: number) => void;
  rooms: RoomResponseType[];
}

const Sidebar = ({
  isOpen,
  onToggle,
  currentRoomId,
  onRoomSelect,
  onCreateRoom,
  onUpdateRoom,
  onDeleteRoom,
  rooms,
}: SidebarProps) => {
  const [hoveredRoomId, setHoveredRoomId] = useState<number | null>(null);
  const [openMenuRoomId, setOpenMenuRoomId] = useState<number | null>(null);
  const [editingRoomId, setEditingRoomId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');

  const handleCreateRoomClick = () => {
    onCreateRoom(); // 모달 열기만
  };

  const handleEditClick = (e: React.MouseEvent, room: RoomResponseType) => {
    e.stopPropagation();
    setEditingRoomId(room.id);
    setEditName(room.name);
    setOpenMenuRoomId(null);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditName(e.target.value);
  };

  const handleEditKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, roomId: number) => {
    if (e.key === 'Enter') {
      if (editName.trim() === '') {
        alert('이름을 입력해주세요.');
        return;
      }
      onUpdateRoom(roomId, editName.trim());
      setEditingRoomId(null);
      setEditName('');
    } else if (e.key === 'Escape') {
      setEditingRoomId(null);
      setEditName('');
    }
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
          {rooms.map((room) => (
            <ChatRoomItem
              key={room.id}
              isActive={room.id === currentRoomId}
              onClick={() => onRoomSelect(room.id)}
              onMouseEnter={() => setHoveredRoomId(room.id)}
              onMouseLeave={() => {
                setHoveredRoomId(null);
                setOpenMenuRoomId(null);
              }}
            >
              {editingRoomId === room.id ? (
                <EditInput
                  value={editName}
                  onChange={handleNameChange}
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => handleEditKeyDown(e, room.id)}
                  autoFocus
                />
              ) : (
                <>
                  <RoomName>{room.name}</RoomName>
                  {hoveredRoomId === room.id && (
                    <MoreButton
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuRoomId(openMenuRoomId === room.id ? null : room.id);
                      }}
                      aria-label="채팅방 메뉴 열기"
                    >
                      ⋯
                    </MoreButton>
                  )}

                  {openMenuRoomId === room.id && (
                    <MenuDropdown onClick={(e) => e.stopPropagation()}>
                     <MenuItem onClick={(e) => handleEditClick(e, room)}>
                    <IconImg src={penIcon} alt="연필 아이콘" />
                    이름 수정하기
                    </MenuItem>
                    <MenuItem onClick={() => onDeleteRoom(room.id)}>
                    <IconImg src={trashIcon} alt="휴지통 아이콘" />
                    삭제하기
                    </MenuItem>
                    </MenuDropdown>
                  )}
                </>
              )}
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
  display: flex;
  flex-direction: column;
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
  position: relative;
  padding: 15px 10px;
  margin: 5px 0;
  border-radius: 10px;
  cursor: pointer;
  background-color: ${({ isActive }) => (isActive ? '#f6f4fc' : 'transparent')};
  border: ${({ isActive }) => (isActive ? '2px solid #8161df' : '2px solid transparent')};
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: space-between;

  &:hover {
    background-color: ${({ isActive }) => (isActive ? '#f6f4fc' : '#f9f9f9')};
  }
`;

const RoomName = styled.span`
  flex: 1;
  user-select: none;
`;

const EditInput = styled.input`
  flex: 1;
  padding: 10px 15px;
  font-size: 1rem;
  border-radius: 10px;
  border: 2px solid #8161df;
  outline: none;
`;

const MoreButton = styled.button`
  font-size: 1.5rem;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0 10px;
  user-select: none;

  &:hover {
    color: #8161df;
  }
`;

const MenuDropdown = styled.div`
  position: absolute;
  top: 40px;
  right: 10px;
  width: 140px;
  background: white;
  box-shadow: 0 3px 8px rgba(0,0,0,0.2);
  border-radius: 10px;
  z-index: 1000;
`;

const MenuItem = styled.div`
  padding: 10px;
  cursor: pointer;
  border-radius: 10px;

  &:hover {
  background-color: #ddd;
  color: black;
  }
`;


const IconImg = styled.img`
  width: 16px;
  height: 16px;
  margin-right: 8px;
  vertical-align: middle;
`;

const SidebarFooter = styled.div`
  padding: 20px;
  border-top: 1px solid #f0f0f0;
  background-color: #f9f9f9;
  text-align: center;
`;

const FooterText = styled.p`
  font-size: 0.85rem;
  color: #666;
  margin: 0;
  line-height: 1.4;
`;

export default Sidebar;
