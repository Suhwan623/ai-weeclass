import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Footer = () => {
  const navigate = useNavigate();

  return (
    <StyledFooter>
      <div className="inner">
        <FooterContainer>
          <div className="footer-title">
            <h3>AI 위클래스</h3>
            <div></div>
            <p onClick={() => navigate('/chat')}>상담하기</p>
          </div>
          <p className="footer-p">문의 pllo13551@gmail.com</p>
          <span>© 2024 AiWeeClass All Rights Reserved</span>
        </FooterContainer>
      </div>
    </StyledFooter>
  );
};

const FooterContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: center;

  .footer-p {
    margin-top: 10px;
    color: #666;
  }

  span {
    margin-top: 20px;
    color: #999;
  }

  .footer-title {
    display: flex;
    gap: 10px;
    flex-direction: row;
    align-items: center;

    h3,
    p {
      font-size: 20px;
      &:hover {
        cursor: pointer;
      }
    }

    div {
      width: 2px;
      height: 10px;
      background-color: #d4cbed;
      border-radius: 2px;
    }
  }

  @media only screen and (max-width: 1000px) {
    background-color: #fff;
  }
`;

const StyledFooter = styled.footer`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 160px;
  background-color: #f6f4fc;

  @media only screen and (max-width: 1000px) {
    background-color: #fff;
  }
`;

export default Footer;
