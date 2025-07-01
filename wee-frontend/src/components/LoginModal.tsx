import styled, { keyframes } from 'styled-components';
import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { setCookie } from '../utils';
import { useAuth } from '../hooks/useAuth';
import type { signInType, signUpType } from '../types/auth.type';

interface LoginModalProps {
  onClose: () => void;
  onLoginSuccess: () => void;
  className?: string;
}

const LoginModal = ({ onClose, onLoginSuccess }: LoginModalProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const passwordRef = useRef<HTMLInputElement>(null);

  const { signIn, signUp } = useAuth();

  useEffect(() => {
    setUsername('');
    setPassword('');
    setPasswordConfirm('');
  }, [isLogin]);

  const toggleModal = () => {
    setIsLogin(!isLogin);
    setLoginError(null);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload: signInType | signUpType = { username, password };

    if (isLogin) {
      signIn.mutate(payload as signInType, {
        onSuccess: (data: any) => {
          const { accessToken } = data;
          setCookie('accessToken', accessToken);
          console.log('로그인 성공!');
          onLoginSuccess();
          onClose();
        },
        onError: (error: any) => {
          if (error?.response?.status === 400) {
            setLoginError('로그인 실패. 이메일 또는 비밀번호를 확인해주세요.');
            setPassword('');
            passwordRef.current?.focus();
          } else {
            alert('오류 발생: ' + error.message);
          }
        },
      });
    } else {
      if (password !== passwordConfirm) {
        setLoginError('비밀번호가 일치하지 않습니다.');
        return;
      }

      signUp.mutate(payload as signUpType, {
        onSuccess: () => {
          alert('회원가입 성공!');
          onClose();
        },
        onError: (error: any) => {
          if (error?.response?.status === 400) {
            setLoginError('회원가입 실패. 이미 존재하는 이메일일 수 있습니다.');
          } else {
            alert('오류 발생: ' + error.message);
          }
        },
      });
    }
  };

  return (
    <Overlay>
      <ModalContainer style={isLogin ? { height: '380px' } : { height: '480px' }}>
        <h2>{isLogin ? '로그인' : '회원가입'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="label">아이디</div>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
          <div className="label">비밀번호</div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            ref={passwordRef}
          />
          {!isLogin && (
            <>
              <div className="label">비밀번호 확인</div>
              <input
                type="password"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                required
              />
            </>
          )}
          {loginError && <ErrorMessage>{loginError}</ErrorMessage>}
          <ButtonBox>
            <span onClick={toggleModal}>{isLogin ? '회원가입하기' : '로그인하기'}</span>
            <div className="btn-right">
              <button type="submit" className="modal-login">
                {isLogin ? '로그인' : '회원가입'}
              </button>
              <button type="button" onClick={onClose} className="modal-close">
                닫기
              </button>
            </div>
          </ButtonBox>
        </form>
      </ModalContainer>
    </Overlay>
  );
};

const ErrorMessage = styled.p`
  position: absolute;
  color: red;
  margin-top: 10px;
`;

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
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

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
  transition: all 0.2s ease-out;
  background: white;
  padding: 20px;
  border-radius: 30px;
  width: 700px;
  height: 450px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: ${fadeIn} 0.2s ease-out;
  form {
    .label {
      margin-top: 20px;
    }
    input {
      border: 1px solid #e9e9e9;
      background-color: #eee;
      width: 600px;
      height: 50px;
      margin-top: 10px;
      border-radius: 10px;
      &:focus {
        outline: 1.5px solid #8161df;
        background-color: #f1edff;
      }
    }
  }
  @media only screen and (max-width: 1000px) {
    width: 90%;
    height: 400px;
    form {
      width: 90%;
      .label {
        margin-top: 10px;
      }
      input {
        width: 100%;
      }
    }
  }
`;

const ButtonBox = styled.div`
  margin-top: 40px;
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
  gap: 20px;
  span {
    cursor: pointer;
    color: #8161df;
    &:hover {
      text-decoration: underline;
    }
  }
  .btn-right {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
  }
  button {
    text-align: center;
    width: 98px;
    height: 40px;
    border-radius: 10px;
    color: #fff;
  }
  .modal-close {
    background-color: #e8e3f8;
    color: #000;
  }
  .modal-login {
    font-weight: 600;
    background-color: #8161df;
  }
  @media only screen and (max-width: 1000px) {
    flex-direction: column;
  }
`;

export default LoginModal;
