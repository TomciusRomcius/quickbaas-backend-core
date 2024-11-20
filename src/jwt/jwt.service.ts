import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
const jwt = require('jsonwebtoken');

@Injectable()
export class JwtService {
  constructor(private configService: ConfigService) {}
  sign(payload: any): string {
    return jwt.sign(payload, this.configService.getOrThrow('AUTH_KEY'));
  }

  verify(token: string) {
    let resultObject = {};
    jwt.verify(token, (err, decoded) => {
      if (err) {
        console.error(err);
      }

      else {
        resultObject = decoded;
      }
    });

    return resultObject;
  }
}
