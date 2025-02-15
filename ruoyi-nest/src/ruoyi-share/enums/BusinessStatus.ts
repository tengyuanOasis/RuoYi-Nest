/**
 * 操作状态
 * 
 * @author erhu
 */
export enum BusinessStatus {
    /**
     * 成功
     */
    SUCCESS = 'SUCCESS',

    /**
     * 失败
     */
    FAIL = 'FAIL',
}

export const BusinessStatusMap = {
    [BusinessStatus.SUCCESS]: 0,
    [BusinessStatus.FAIL]: 1,
}
