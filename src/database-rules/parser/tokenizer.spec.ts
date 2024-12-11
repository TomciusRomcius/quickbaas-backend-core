import Tokenizer, { TokenType } from './tokenizer';

describe('Tokenizer', () => {
  const tokenizer = new Tokenizer();

  it('should parse simple one line expressions', () => {
    const str = '2+5';
    const tokens = tokenizer.tokenize(str);

    expect(tokens.length).toBe(3);

    expect(tokens[0].type).toBe(TokenType.LITERAL);
    expect(tokens[0].value).toBe('2');

    expect(tokens[1].type).toBe(TokenType.OPERATOR);
    expect(tokens[1].value).toBe('+');

    expect(tokens[2].type).toBe(TokenType.LITERAL);
    expect(tokens[2].value).toBe('5');
  });

  it('should parse simple two line expressions', () => {
    const str = '2+5\n 5-3 ';
    const tokens = tokenizer.tokenize(str);

    expect(tokens.length).toBe(6);

    expect(tokens[0].type).toBe(TokenType.LITERAL);
    expect(tokens[0].value).toBe('2');

    expect(tokens[1].type).toBe(TokenType.OPERATOR);
    expect(tokens[1].value).toBe('+');

    expect(tokens[2].type).toBe(TokenType.LITERAL);
    expect(tokens[2].value).toBe('5');

    expect(tokens[3].type).toBe(TokenType.LITERAL);
    expect(tokens[3].value).toBe('5');

    expect(tokens[4].type).toBe(TokenType.OPERATOR);
    expect(tokens[4].value).toBe('-');

    expect(tokens[5].type).toBe(TokenType.LITERAL);
    expect(tokens[5].value).toBe('3');
  });

  it('should handle double operators', () => {
    const str = '2==5';
    const tokens = tokenizer.tokenize(str);

    expect(tokens.length).toBe(3);
    expect(tokens[0].value).toBe('2');
    expect(tokens[1].value).toBe('==');
    expect(tokens[2].value).toBe('5');
  });

  it('should handle identifiers', () => {
    const str = 'auth.user == 0';
    const tokens = tokenizer.tokenize(str);

    expect(tokens[0].type).toBe(TokenType.IDENTIFIER);
    expect(tokens[0].value).toBe('auth.user');

    expect(tokens[1].type).toBe(TokenType.OPERATOR);
    expect(tokens[1].value).toBe('==');

    expect(tokens[2].type).toBe(TokenType.LITERAL);
    expect(tokens[2].value).toBe('0');
  });
});
