import { MessageUtils } from '~/ruoyi-share/utils/message.utils';
import { UserException } from './UserException';

/**
 * 验证码错误异常类
 * 
 * @author erhu
 */
export class CaptchaException extends UserException {
    constructor() {
        super(MessageUtils.message('user.captcha.error'), null);
    }
}