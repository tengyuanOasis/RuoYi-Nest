import { StringUtils } from "./string.utils"


export class HbsControllerRenderUtils { 

    public static renderHeader(context) {
        const tableNamePrefix = context.tableName.split('_')[0]
        const ClassNameWithoutSysPrefix = context.ClassName.replace(new RegExp(`^${tableNamePrefix}`, 'i'), '')
        const ClassNameWithoutSysPrefixAndLowerCaseFirstLetter = StringUtils.uncapitalize(ClassNameWithoutSysPrefix)
        const alias = ClassNameWithoutSysPrefixAndLowerCaseFirstLetter.charAt(0)
        const tableNameWithMiddleLine = context.tableName.replace(/_/g, '-')
        return `
import { Controller, Get, Post, Put, Delete, Body, Param, Query, Req, Res } from '@nestjs/common';
import { ${context.ClassName}Service } from '~/${context.packageName}/${tableNameWithMiddleLine}/${tableNameWithMiddleLine}.service';
import { ${context.ClassName} } from '~/${context.packageName}/${tableNameWithMiddleLine}/entities/${tableNameWithMiddleLine}.entity';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { BaseController } from '~/ruoyi-share/controller/base-controller';
import { Log } from '~/ruoyi-share/annotation/Log';
import { PreAuthorize } from '~/ruoyi-share/annotation/PreAuthorize';
import { BusinessType } from '~/ruoyi-share/enums/BusinessType';
import { ExcelUtils } from '~/ruoyi-share/utils/excel.utils';

/**
 * ${context.functionName}Controller
 * 文件路径 ${tableNameWithMiddleLine}/${tableNameWithMiddleLine}.controller.ts
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
        return `
@ApiTags('${context.functionName}')
@Controller('${context.moduleName}/${ClassNameWithoutSysPrefixAndLowerCaseFirstLetter}')
export class ${context.ClassName}Controller extends BaseController {
    constructor(
        private readonly ${ClassNameWithoutSysPrefixAndLowerCaseFirstLetter}Service: ${context.ClassName}Service,
        private readonly excelUtils: ExcelUtils
    ) {
        super();
    }

    /**
     * 查询${context.functionName}列表
     */
    @ApiOperation({ summary: '查询${context.functionName}列表' })
    @ApiResponse({ status: 200, description: '查询成功', type: [${context.ClassName}] })
    @PreAuthorize('hasPermi("${context.permissionPrefix}:list")')
    @Get('list')
    @Log({ title: '查询${context.functionName}列表' })
    async list(@Query() query: ${context.ClassName}) {
        this.startPage(query);
        const [list, total] = await this.${ClassNameWithoutSysPrefixAndLowerCaseFirstLetter}Service.select${ClassNameWithoutSysPrefix}List(query);
        return this.getDataTable(list, total);
    }

    /**
     * 导出${context.functionName}列表
     */
    @ApiOperation({ summary: '导出${context.functionName}列表' })
    @ApiResponse({ status: 200, description: '导出成功' })
    @PreAuthorize('hasPermi("${context.permissionPrefix}:export")')
    @Post('export')
    @Log({ title: '导出${context.functionName}', businessType: BusinessType.EXPORT })
    async export(@Res() res, @Body() query: ${context.ClassName}) {
        const [list] = await this.${ClassNameWithoutSysPrefixAndLowerCaseFirstLetter}Service.select${ClassNameWithoutSysPrefix}List(query);
        await this.excelUtils.exportExcel(res, list, '${context.functionName}数据', ${context.ClassName});
    }

    /**
     * 获取${context.functionName}详细信息
     */
    @ApiOperation({ summary: '获取${context.functionName}详细信息' })
    @ApiResponse({ status: 200, description: '获取成功', type: ${context.ClassName} })
    @PreAuthorize('hasPermi("${context.permissionPrefix}:query")')
    @Get(':${context.pkColumn.tsField}')
    @Log({ title: '获取${context.functionName}详细信息' })
    async getInfo(@Param('${context.pkColumn.tsField}') ${context.pkColumn.tsField}: number) {
        return this.success(await this.${ClassNameWithoutSysPrefixAndLowerCaseFirstLetter}Service.select${ClassNameWithoutSysPrefix}ById(${context.pkColumn.tsField}));
    }

    /**
     * 新增${context.functionName}
     */
    @ApiOperation({ summary: '新增${context.functionName}' })
    @ApiResponse({ status: 201, description: '新增成功' })
    @PreAuthorize('hasPermi("${context.permissionPrefix}:add")')
    @Post()
    @Log({ title: '新增${context.functionName}', businessType: BusinessType.INSERT })
    async add(@Body() ${context.className}: ${context.ClassName}, @Req() req) {
        const loginUser = req.user;
        ${context.className}.createBy = loginUser.getUsername();
        ${context.className}.createTime = new Date();
        ${context.className}.updateTime = new Date();
        ${context.className}.updateBy = loginUser.getUsername();
        return this.success(await this.${ClassNameWithoutSysPrefixAndLowerCaseFirstLetter}Service.insert${ClassNameWithoutSysPrefix}(${context.className}));
    }

    /**
     * 修改${context.functionName}
     */
    @ApiOperation({ summary: '修改${context.functionName}' })
    @ApiResponse({ status: 200, description: '修改成功' })
    @PreAuthorize('hasPermi("${context.permissionPrefix}:edit")')
    @Put()
    @Log({ title: '修改${context.functionName}', businessType: BusinessType.UPDATE })
    async edit(@Body() ${context.className}: ${context.ClassName}, @Req() req) {
        const loginUser = req.user;
        ${context.className}.updateBy = loginUser.getUsername();
        ${context.className}.updateTime = new Date();
        await this.${ClassNameWithoutSysPrefixAndLowerCaseFirstLetter}Service.update${ClassNameWithoutSysPrefix}(${context.className})
        return this.success();
    }

    /**
     * 删除${context.functionName}
     */
    @ApiOperation({ summary: '删除${context.functionName}' })
    @ApiResponse({ status: 200, description: '删除成功' })
    @PreAuthorize('hasPermi("${context.permissionPrefix}:remove")')
    @Delete(':${context.pkColumn.tsField}s')
    @Log({ title: '删除${context.functionName}', businessType: BusinessType.DELETE })
    async remove(@Param('${context.pkColumn.tsField}s') ${context.pkColumn.tsField}s: string) {
        const ids = ${context.pkColumn.tsField}s.split(',').map(id => parseInt(id));
        await this.${ClassNameWithoutSysPrefixAndLowerCaseFirstLetter}Service.delete${ClassNameWithoutSysPrefix}ByIds(ids)
        return this.success();
    }
}
        `
    }

}