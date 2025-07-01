import { useState } from 'react';
import styled, { keyframes } from 'styled-components';

interface CreateRoomModalProps {
  onClose: () => void;
  onCreate: (name: string) => void;
}

const CreateRoomModal = ({ onClose, onCreate }: CreateRoomModalProps) => {
  const [roomName, setRoomName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!roomName.trim()) {
      setError('방 이름을 입력해주세요.');
      return;
    }
    
    onCreate(roomName.trim());
    onClose();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRoomName(e.target.value);
    if (error) setError(null);
  };

  return (
    <Overlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <Title>새 상담방 생성</Title>
        <Form onSubmit={handleSubmit}>
          <Label>방 이름</Label>
          <Input
            type="text"
            placeholder="방 이름을 입력하세요"
            value={roomName}
            onChange={handleInputChange}
            autoFocus
          />
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <ButtonContainer>
            <CancelLink onClick={onClose}>취소</CancelLink>
            <ButtonGroup>
              <CreateButton type="submit">생성하기</CreateButton>
              <CloseButton type="button" onClick={onClose}>닫기</CloseButton>
            </ButtonGroup>
          </ButtonContainer>
        </Form>
      </ModalContainer>
    </Overlay>
  );
};

// Keyframes
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const fadeOut = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

// Styled Components
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: ${fadeOut} 0.2s ease-out;
`;

const ModalContainer = styled.div`
  background: white;
  padding: 20px;
  border-radius: 30px;
  width: 500px;
  height: 300px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: ${fadeIn} 0.2s ease-out;
  transition: all 0.2s ease-out;

  @media (max-width: 600px) {
    width: 90%;
    height: 280px;
    padding: 15px;
  }
`;

const Title = styled.h2`
  margin-bottom: 20px;
  color: #333;
`;

const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Label = styled.div`
  margin-top: 20px;
  align-self: flex-start;
  margin-left: 10px;
  font-weight: 500;
  color: #333;

  @media (max-width: 600px) {
    margin-top: 15px;
  }
`;

const Input = styled.input`
  border: 1px solid #e9e9e9;
  background-color: #eee;
  width: 100%;
  max-width: 400px;
  height: 50px;
  margin-top: 10px;
  border-radius: 10px;
  padding: 0 15px;
  font-size: 16px;
  transition: all 0.2s ease;

  &:focus {
    outline: 1.5px solid #8161df;
    background-color: #f1edff;
    border-color: #8161df;
  }

  &::placeholder {
    color: #999;
  }

  @media (max-width: 600px) {
    height: 45px;
  }
`;

const ErrorMessage = styled.p`
  position: absolute;
  color: red;
  margin-top: 10px;
  font-size: 14px;
`;

const ButtonContainer = styled.div`
  margin-top: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  width: 100%;
  max-width: 400px;

  @media (max-width: 600px) {
    flex-direction: column;
    gap: 15px;
    margin-top: 30px;
  }
`;

const CancelLink = styled.span`
  cursor: pointer;
  color: #8161df;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    text-decoration: underline;
    color: #6d4ed4;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;

  @media (max-width: 600px) {
    gap: 10px;
  }
`;

const Button = styled.button`
  width: 98px;
  height: 40px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 600px) {
    width: 85px;
    height: 35px;
  }
`;

const CreateButton = styled(Button)`
  background-color: #8161df;
  color: white;
  font-weight: 600;

  &:hover {
    background-color: #6d4ed4;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
    
    &:hover {
      transform: none;
      box-shadow: none;
    }
  }
`;

const CloseButton = styled(Button)`
  background-color: #e8e3f8;
  color: #000;

  &:hover {
    background-color: #ddd4f0;
  }
`;

export default CreateRoomModal;