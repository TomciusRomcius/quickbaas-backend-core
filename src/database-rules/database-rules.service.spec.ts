import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseRulesService } from './database-rules.service';
import simpleRule from './test/simpleRule.json';

describe('DatabaseRulesService', () => {
  let databaseRulesService: DatabaseRulesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DatabaseRulesService],
    }).compile();

    databaseRulesService =
      module.get<DatabaseRulesService>(DatabaseRulesService);
  });

  it('should be defined', () => {
    expect(databaseRulesService).toBeDefined();
  });

  it('should work with simple write rules', async () => {
    /*
    {
      "path": "app.name",
      "value": "Sicko"
    }   
    */
    /*
      {
        "app": {
          "name": {
            ".write": false,
          }
        }
      }
    */
    // const path = 'app.name';
    // console.log(simpleRule);
    // const result = await databaseRulesService.validateQuery(
    //   simpleRule,
    //   path,
    //   'write',
    // );
    // expect(result).toBe(false);
    // const result2 = await databaseRulesService.validateQuery(
    //   simpleRule,
    //   path,
    //   'read',
    // );
    // expect(result2).toBe(true);
  });
});
