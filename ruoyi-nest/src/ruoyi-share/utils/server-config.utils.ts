/**
 * 服务相关配置
 * 
 * @author erhu
 */
import { Injectable } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class ServerConfigUtils
{
    /**
     * 获取完整的请求路径，包括：域名，端口，上下文访问路径
     * 
     * @return 服务地址
     */
    public getUrl(request: Request): string
    {
        return this.getDomain(request);
    }

    public getDomain(request: any): string
    {
        // 获取协议 (http/https)
        const protocol = request.protocol;
            
        // 获取主机名和端口
        const host = request.get('host');

        // 获取上下文路径（如果有的话）
        const contextPath = ''; // 如果需要自定义上下文路径，可以在这里配置

        // 组合完整的域名
        return `${protocol}://${host}${contextPath}`;
    }
}
