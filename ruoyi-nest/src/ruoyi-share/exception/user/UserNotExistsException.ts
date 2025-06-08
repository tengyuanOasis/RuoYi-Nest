import { MessageUtils } from '~/ruoyi-share/utils/message.utils';

import { UserException } from './UserException';

/**
 * 用户不存在异常类
 * 
 * @author erhu
 */
export class UserNotExistsException extends UserException {
    constructor() {
        super(MessageUtils.message("user.not.exists"), null);
    }
}