/**
 * 文件信息异常类
 * 
 * @author erhu
 */
export class FileException extends Error {
    constructor(code: string, args: any[]) {
        super(`file.${code}`);
        Object.setPrototypeOf(this, FileException.prototype);
    }
}