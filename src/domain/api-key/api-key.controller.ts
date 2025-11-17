import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { ApiKeyService } from './services/api-key.service';
import { CreateApiKeyDto } from './dto/create-api-key.dto';
import { UpdateApiKeyDto } from './dto/update-api-key.dto';
import {
  ApiKeyResponseDto,
  CreateApiKeyResponseDto,
  ApiKeyListResponseDto,
} from './dto/api-key-response.dto';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ErrorResponse } from '../../common/api/response/error-response/error-response';

@ApiTags('API Keys Management')
@Controller('admin/api-keys')
@UseGuards(RolesGuard)
@Roles(UserRole.ADMIN)
@ApiBearerAuth()
export class ApiKeyController {
  constructor(private readonly apiKeyService: ApiKeyService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new API key' })
  @ApiCreatedResponse({
    description: 'API key created successfully',
    type: CreateApiKeyResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid input', type: ErrorResponse })
  @ApiUnauthorizedResponse({ description: 'Unauthorized', type: ErrorResponse })
  @ApiForbiddenResponse({
    description: 'Forbidden - Admin access required',
    type: ErrorResponse,
  })
  create(
    @Body() createApiKeyDto: CreateApiKeyDto,
    @CurrentUser('id') adminId: string,
  ): Promise<CreateApiKeyResponseDto> {
    return this.apiKeyService.createApiKey(createApiKeyDto, adminId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all API keys' })
  @ApiOkResponse({
    description: 'List of API keys retrieved successfully',
    type: ApiKeyListResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized', type: ErrorResponse })
  @ApiForbiddenResponse({
    description: 'Forbidden - Admin access required',
    type: ErrorResponse,
  })
  findAll(): Promise<ApiKeyListResponseDto> {
    return this.apiKeyService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get API key by ID' })
  @ApiOkResponse({
    description: 'API key retrieved successfully',
    type: ApiKeyResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'API key not found',
    type: ErrorResponse,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized', type: ErrorResponse })
  @ApiForbiddenResponse({
    description: 'Forbidden - Admin access required',
    type: ErrorResponse,
  })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<ApiKeyResponseDto> {
    return this.apiKeyService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update API key' })
  @ApiOkResponse({
    description: 'API key updated successfully',
    type: ApiKeyResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'API key not found',
    type: ErrorResponse,
  })
  @ApiBadRequestResponse({
    description: 'Invalid input or cannot update revoked key',
    type: ErrorResponse,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized', type: ErrorResponse })
  @ApiForbiddenResponse({
    description: 'Forbidden - Admin access required',
    type: ErrorResponse,
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateApiKeyDto: UpdateApiKeyDto,
  ): Promise<ApiKeyResponseDto> {
    return this.apiKeyService.updateApiKey(id, updateApiKeyDto);
  }

  @Delete(':id/revoke')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Revoke API key' })
  @ApiOkResponse({ description: 'API key revoked successfully' })
  @ApiNotFoundResponse({
    description: 'API key not found',
    type: ErrorResponse,
  })
  @ApiBadRequestResponse({
    description: 'API key is already revoked',
    type: ErrorResponse,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized', type: ErrorResponse })
  @ApiForbiddenResponse({
    description: 'Forbidden - Admin access required',
    type: ErrorResponse,
  })
  revoke(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.apiKeyService.revokeApiKey(id);
  }
}
