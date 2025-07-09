import styled, { keyframes } from 'styled-components';

interface DeleteModalProps {
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteModal = ({ onClose, onConfirm }: DeleteModalProps) => {
  return (
    <Overlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <Title>채팅방 삭제</Title>
        <Message>정말로 이 채팅방을 삭제하시겠습니까?</Message>
        <ButtonContainer>
          <CancelButton onClick={onClose}>취소</CancelButton>
          <DeleteButton onClick={onConfirm}>삭제하기</DeleteButton>
        </ButtonContainer>
      </ModalContainer>
    </Overlay>
  );
};


// 🔽 아래는 스타일
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const fadeOut = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: ${fadeOut} 0.2s ease-out;
`;

const ModalContainer = styled.div`
  background: white;
  padding: 30px;
  border-radius: 30px;
  width: 480px;
  height: 240px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  animation: ${fadeIn} 0.2s ease-out;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: 600px) {
    width: 90%;
    height: auto;
    padding: 20px;
  }
`;

const Title = styled.h2`
  font-size: 1.4rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;
`;

const Message = styled.p`
  font-size: 1.1rem;
  color: #444;
  text-align: center;
  margin-bottom: 30px;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 20px;
`;

const Button = styled.button`
  width: 120px;
  height: 44px;
  border-radius: 10px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const CancelButton = styled(Button)`
  background-color: #e8e3f8;
  color: #000;

  &:hover {
    background-color: #ddd4f0;
  }
`;

const DeleteButton = styled(Button)`
  background-color: #8161df;
  color: white;

  &:hover {
    background-color: #6f50d1;
  }
`;

export default DeleteModal;