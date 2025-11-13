import {
  Controller,
  Get,
  Query,
  UseGuards,
  ParseIntPipe,
  DefaultValuePipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuditService } from './services/audit.service';
import { AuthGuard } from '../../guards/auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';
import { UserRole, AuditAction } from '@prisma/client';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { ErrorResponse } from 'src/common/api/response/error-response/error-response';

@ApiBearerAuth()
@Controller('audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get audit logs' })
  @ApiOkResponse({ description: 'Audit logs returned' })
  @ApiBadRequestResponse({ description: 'Invalid input', type: ErrorResponse })
  @ApiNotFoundResponse({
    description: 'Audit logs not found',
    type: ErrorResponse,
  })
  @ApiUnprocessableEntityResponse({
    description: 'Unprocessable Entity',
    type: ErrorResponse,
  })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'userId', required: false })
  @ApiQuery({ name: 'userEmail', required: false })
  @ApiQuery({
    name: 'action',
    required: false,
    enum: AuditAction,
    description: 'Filter by audit action type',
  })
  @ApiQuery({ name: 'createdAt', required: false })
  async getAuditLogs(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('userId') userId?: string,
    @Query('userEmail') userEmail?: string,
    @Query('action') action?: string,
    @Query('createdAt') createdAt?: string,
  ) {
    const filters: any = {};
    if (userId) filters.userId = userId;
    if (userEmail) filters.userEmail = userEmail;
    if (action) filters.action = action;
    if (createdAt) filters.createdAt = new Date(createdAt);

    return this.auditService.getAuditLogs(page, limit, filters);
  }
}
