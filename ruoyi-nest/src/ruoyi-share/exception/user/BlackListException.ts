import { UserException } from './UserException';

/**
 * 黑名单IP异常类
 * 
 * @author erhu
 */
export class BlackListException extends UserException {
    constructor() {
        super('login.blocked', null);
    }
}