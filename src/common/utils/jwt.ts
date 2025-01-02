import * as jwt from 'jsonwebtoken';

export default class JWT {
  public static sign(payload: any): string {
    if (!payload) return '';
    return jwt.sign(payload, JWT.getAuthKey());
  }

  public static verify(token: string) {
    let resultObject = {};
    jwt.verify(token, JWT.getAuthKey(), (err, decoded) => {
      if (err) {
        console.error(err);
      } else {
        resultObject = decoded;
      }
    });

    return resultObject;
  }

  private static getAuthKey() {
    const key = process.env.AUTH_KEY || '';
    if (!key) {
      console.error('AUTH_KEY is not set');
    }

    return key;
  }
}
