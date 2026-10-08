/**
 *
 * Footer
 *
 */

import React from 'react';
import styled from 'styled-components';
import ENV_CONFIG from 'env';
import { AmooLogo } from 'app/components/AmooLogo';
import AmooPng from 'images/footer-logo.png';

export function Footer() {
  return (
    <FooterWrapper>
      <FooterContent>
        <div className="footer-row">
          <div className="footer-row-left">
            <a className="footer-logo" href={ENV_CONFIG.ENV_LINK}>
              <AmooLogo className="amoo-logo" />
              <span>AmooStore</span>
            </a>
            <div className="footer-message">
              <div>
                来源声明：部分 Skill/Agent
                来源于公开渠道及用户自主上传，使用前请注意识别相关风险，内容版权归原作者所有。
              </div>
              <div>
                侵权处理：如涉版权问题，请发送邮件至amoofeedback@stepx.com，我们将及时核实并予以下架处理。
              </div>
            </div>
          </div>
          <div className="footer-row-right">
            <div className="footer-row-link-title">快捷入口</div>
            <a className="footer-row-link" href={ENV_CONFIG.ENV_LINK}>
              举报与反馈
            </a>
            <a className="footer-row-link" href={ENV_CONFIG.ENV_LINK}>
              官方文档
            </a>
            <a className="footer-row-link" href={ENV_CONFIG.ENV_LINK}>
              隐私政策
            </a>
            <a className="footer-row-link" href={ENV_CONFIG.ENV_LINK}>
              服务协议
            </a>
          </div>
        </div>
        <div className="footer-row">
          <div className="footer-copyright">
            <span>智源星辰（上海）智能科技有限公司 Copyright © 2026</span>{' '}
            <span>沪ICP备2026015011号-67</span>
          </div>
          <div className="footer-amoo-logo">
            <img src={AmooPng} alt="amoo" />
          </div>
        </div>
      </FooterContent>
    </FooterWrapper>
  );
}

const FooterWrapper = styled.div`
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  background: #0a0a0a;
`;
const FooterContent = styled.div`
  display: flex;
  max-width: 1368px;
  margin: 0 auto;
  padding-top: 50px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 30px;
  .footer-row {
    width: 100%;
    display: flex;
    justify-content: space-between;
    .footer-row-left {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 16px;
      flex-shrink: 0;
      .footer-logo {
        display: flex;
        height: 32px;
        justify-content: center;
        align-items: center;
        gap: 6px;
        .amoo-logo {
          width: 24px;
          height: 24px;
          flex-shrink: 0;
        }

        span {
          color: #fafafa;
          font-size: 18px;
          font-style: normal;
          font-weight: 600;
          line-height: 21px; /* 116.667% */
          letter-spacing: -0.939px;
        }
      }
      .footer-message {
        color: rgba(255, 255, 255, 0.5);
        font-size: 12px;
        font-style: normal;
        font-weight: 400;
        line-height: 24px; /* 200% */
      }
    }
    .footer-row-right {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 16px;
      .footer-row-link-title {
        color: #fafafa;
        text-align: right;
        font-size: 12px;
        font-style: normal;
        font-weight: 500;
        line-height: 17px; /* 141.667% */
      }
      .footer-row-link {
        color: rgba(255, 255, 255, 0.5);
        text-align: right;
        font-size: 12px;
        font-style: normal;
        font-weight: 400;
        line-height: 17px; /* 141.667% */
      }
    }
    .footer-copyright {
      color: rgba(255, 255, 255, 0.3);
      text-align: center;
      font-size: 11px;
      font-style: normal;
      font-weight: 400;
      line-height: 19px; /* 172.727% */
      letter-spacing: 0.064px;
      display: flex;
      align-items: center;
    }
    .footer-amoo-logo img {
      height: 94px;
    }
  }
`;
