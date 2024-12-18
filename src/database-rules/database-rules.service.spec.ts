import { Test } from '@nestjs/testing';
import { DatabaseRulesService } from './database-rules.service';
import { Request } from 'express';

describe('DatabaseRulesService', () => {
  let databaseRulesService: DatabaseRulesService;

  const createReq = (path: string, value: any, ...args): Request => {
    const req = {
      body: {
        path: path,
        value: value,
        ...Object.assign({}, ...args),
      },
    } as Request;

    return req;
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [DatabaseRulesService],
    }).compile();

    databaseRulesService =
      module.get<DatabaseRulesService>(DatabaseRulesService);
  });

  it('should parse simple 1-level rules', async () => {
    const rule1 = {
      name: {
        '.write': false,
        '.read': true,
      },
    };

    const rule2 = {
      name: {
        '.write': false,
        '.read': true,
      },
    };

    databaseRulesService.loadDbRules = jest
      .fn()
      .mockResolvedValueOnce(rule1)
      .mockResolvedValueOnce(rule2);

    const args1 = {
      path: 'name',
      value: 'New name',
    };

    const req1 = createReq(args1.path, args1.value);

    const result1 = await databaseRulesService.validateQuery(
      req1,
      args1.path,
      args1.value,
      'write',
    );

    const result2 = await databaseRulesService.validateQuery(
      req1,
      args1.path,
      undefined,
      'read',
    );

    expect(result1).toBe(false);
    expect(result2).toBe(true);
  });

  it('should use the correct ruleset, if it does not exist on the path end', async () => {
    const rules1 = {
      app: {
        properties: {
          '.write': false,
          '.read': true,
        },
      },
    };

    const rules2 = {
      app: {
        properties: {
          '.write': true,
          '.read': true,
        },
      },
    };

    databaseRulesService.loadDbRules = jest.fn().mockResolvedValue(rules1);

    const args1 = {
      path: 'app.properties.name',
      value: 'New name',
    };

    const req1 = createReq(args1.path, args1.value);
    const req2 = createReq(args1.path, undefined);
    const req3 = createReq(args1.path, args1.value);

    const result1 = await databaseRulesService.validateQuery(
      req1,
      args1.path,
      args1.value,
      'write',
    );

    const result2 = await databaseRulesService.validateQuery(
      req2,
      args1.path,
      undefined,
      'read',
    );

    databaseRulesService.loadDbRules = jest.fn().mockResolvedValue(rules2);

    const result3 = await databaseRulesService.validateQuery(
      req3,
      args1.path,
      undefined,
      'write',
    );

    expect(result1).toBe(false);
    expect(result2).toBe(true);
    expect(result3).toBe(true);
  });

  it('should use work with rules that contain an identifier', async () => {
    const rules1 = {
      users: {
        '#uid': {
          '.write': 'uid === req.body.uid',
          '.read': 'uid === req.body.uid',
        },
      },
    };

    databaseRulesService.loadDbRules = jest.fn().mockResolvedValue(rules1);

    const args1 = {
      path: 'users.user1.name',
      value: 'New name',
    };

    const req = createReq(args1.path, args1.value, { uid: 'user1' });
    const req2 = createReq(args1.path, args1.value);

    const result1 = await databaseRulesService.validateQuery(
      req,
      args1.path,
      args1.value,
      'write',
    );

    const result2 = await databaseRulesService.validateQuery(
      req2,
      args1.path,
      args1.value,
      'write',
    );

    expect(result1).toBe(true);
    expect(result2).toBe(false);
  });
});
