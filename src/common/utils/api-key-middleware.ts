import { NestMiddleware, UnauthorizedException } from '@nestjs/common';

export class ApiKeyMiddleware implements NestMiddleware {
  use(req: any, res: any, next: (error?: Error | any) => void) {
    if (req.body.apiKey != process.env.API_KEY) {
      throw new UnauthorizedException(
        'You must provide the api key while making requests',
      );
    } else {
      next();
    }
  }
}
