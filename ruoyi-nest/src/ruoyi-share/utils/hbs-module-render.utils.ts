import { StringUtils } from "./string.utils"


export class HbsModuleRenderUtils { 

    public static renderHeader(context) {
        const tableNamePrefix = context.tableName.split('_')[0]
        const ClassNameWithoutSysPrefix = context.ClassName.replace(new RegExp(`^${tableNamePrefix}`, 'i'), '')
        const ClassNameWithoutSysPrefixAndLowerCaseFirstLetter = StringUtils.uncapitalize(ClassNameWithoutSysPrefix)
        const alias = ClassNameWithoutSysPrefixAndLowerCaseFirstLetter.charAt(0)
        const tableNameWithMiddleLine = context.tableName.replace(/_/g, '-')
        return `
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ${context.ClassName}Service } from '~/${context.packageName}/${tableNameWithMiddleLine}/${tableNameWithMiddleLine}.service';
import { ${context.ClassName} } from '~/${context.packageName}/${tableNameWithMiddleLine}/entities/${tableNameWithMiddleLine}.entity';
import { ${context.ClassName}Repository } from '~/${context.packageName}/${tableNameWithMiddleLine}/repositories/${tableNameWithMiddleLine}.repository';
import { ${context.ClassName}Controller } from '~/${context.packageName}/${tableNameWithMiddleLine}/${tableNameWithMiddleLine}.controller';
import { RedisModule } from '~/ruoyi-share/redis/redis.module';

/**
 * ${context.functionName}Module
 * 文件路径 ${tableNameWithMiddleLine}/${tableNameWithMiddleLine}.module.ts
 * 
 * @author ${context.author}
 * @date ${context.datetime}
 *
 */
        `
    }
    public static renderClass(context) {
      const tableNamePrefix = context.tableName.split('_')[0]
        const ClassNameWithoutSysPrefix = context.ClassName.replace(new RegExp(`^${tableNamePrefix}`, 'i'), '')
        const ClassNameWithoutSysPrefixAndLowerCaseFirstLetter = StringUtils.uncapitalize(ClassNameWithoutSysPrefix)
        const alias = ClassNameWithoutSysPrefixAndLowerCaseFirstLetter.charAt(0)
        const tableNameWithMiddleLine = context.tableName.replace(/_/g, '-')
        const preAuthorizePrefix = `${context.moduleName}:${tableNameWithMiddleLine}:`
        return `


const providers = [${context.ClassName}Service, ${context.ClassName}Repository];

@Module({
  imports: [
    TypeOrmModule.forFeature([${context.ClassName}]),
    RedisModule
  ],
  controllers: [${context.ClassName}Controller],
  providers,
  exports: [${context.ClassName}Service,${context.ClassName}Repository]
})
export class ${context.ClassName}Module {}

        `
    }

}