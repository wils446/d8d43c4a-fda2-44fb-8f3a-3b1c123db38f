import { Provider } from '@nestjs/common';
import { AddMemberHandler } from './add-member';

export * from './add-member';

export const CommandHandlers: Provider[] = [AddMemberHandler];
