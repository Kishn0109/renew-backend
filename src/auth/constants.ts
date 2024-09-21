import { SetMetadata } from '@nestjs/common';
export const IS_PUBLIC_KEY = 'isPublic';
export const jwtConstants = {
  secret: 'tS7FR5k4NFBVE9epWdsdsdMNdSqAZurYsB0dI',
};

export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
