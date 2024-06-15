import { Provider } from '@nestjs/common';
import { GetMembersHandler } from './get-members';

export * from './get-members';

export const QueryHandlers: Provider[] = [GetMembersHandler];
