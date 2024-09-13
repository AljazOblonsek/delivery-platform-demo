import { describe, expect, it } from 'vitest';
import { getJwtPayloadFromJwt } from './get-payload-from-jwt.util';

describe('getJwtPayloadFromJwt', () => {
  it('should return null if decoding jwt throws an error', () => {
    const jwtPayload = getJwtPayloadFromJwt('malformed_jwt');

    expect(jwtPayload).toBe(null);
  });

  it('should return decoded jwt payload', () => {
    const jwtStub =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2NmM1YjVhNi1hODE2LTQzY2YtOWQ1NS05ODdhZjkxMDdlZTIiLCJzdWIiOiIxIiwiZXhwIjoxNzIyODk4OTQ0LCJpYXQiOjE3MjE4OTg5NDQsImlkIjoiMSIsImVtYWlsIjoiam9obi5kb2VAZHAtZGVtby5pbyIsImZpcnN0bmFtZSI6IkpvaG4iLCJsYXN0bmFtZSI6IkRvZSIsImNvbXBhbnlJZCI6IjEiLCJjb21wYW55TmFtZSI6IkJlZWxpdmVyIn0.7EmiP-ZbICP8QDW5f28iB_Rt37gM-t36gdV267HOQ7w';

    const jwtPayload = getJwtPayloadFromJwt(jwtStub);

    expect(jwtPayload).toBeDefined();
  });
});
