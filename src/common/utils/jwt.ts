import * as jwt from 'jsonwebtoken';

export default class JWT {
  public static sign(payload: any): string {
    if (!payload) return '';
    return jwt.sign(payload, JWT.getAuthKey());
  }

  public static verify(token: string) {
    let resultObject = {};
    jwt.verify(token, (err, decoded) => {
      if (err) {
        console.error(err);
      } else {
        resultObject = decoded;
      }
    });

    return resultObject;
  }

  public static parseJWT(jwtToken: string): {
    header: any;
    payload: any;
    err?: 'tampered' | 'expired';
  } {
    // TODO: check for expiration and clean up err type
    let err: 'tampered' | 'expired';
    if (!JWT.verify(jwtToken)) {
      err = 'tampered';
    }
    const [headerStr, payloadStr, signatureStr] = jwtToken.split('.');

    return { header: atob(headerStr), payload: atob(payloadStr), err: err };
  }

  private static getAuthKey() {
    const key = process.env.AUTH_KEY || '';
    if (!key) {
      console.error('AUTH_KEY is not set');
    }

    return key;
  }
}
