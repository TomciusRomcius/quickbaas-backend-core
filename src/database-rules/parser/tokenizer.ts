// What even is life :(

import { i } from 'vite/dist/node/types.d-aGj9QkWt';

export enum TokenType {
  OPERATOR = 0,
  LITERAL = 1,
  IDENTIFIER = 2,
  PUNCTUATOR = 3, // (, )
}

type Token = {
  type: TokenType;
  value?: unknown;
};

function isNumber(str: string) {
  return !isNaN(Number(str));
}

export default class Tokenizer {
  tokenize(code: string): Token[] {
    const lines = code.split('\n');
    const tokens: Token[] = [];

    lines.forEach((line) => {
      // Remove whitespace
      line = line.replace(/\s+/g, '');

      let i = 0;
      while (i < line.length) {
        const operatorLen = this.handleOperatorCase(line, i);
        if (operatorLen) {
          tokens.push({
            type: TokenType.OPERATOR,
            value: line.slice(i, i + operatorLen),
          });
          i += operatorLen;
          continue;
        }

        const numLen = this.handleNumberCase(line, i);
        if (numLen) {
          tokens.push({
            type: TokenType.LITERAL,
            value: line.slice(i, i + numLen),
          });
          i += numLen;
          continue;
        }

        const strLiteralLen = this.handleStringLiteralCase(line, i);
        if (strLiteralLen) {
          tokens.push({
            type: TokenType.LITERAL,
            value: line.slice(i, i + strLiteralLen),
          });
          i += strLiteralLen;
          continue;
        }
        const identifierLen = this.handleIdentifier(line, i);
        if (identifierLen) {
          tokens.push({
            type: TokenType.IDENTIFIER,
            value: line.slice(i, i + identifierLen),
          });
          i += identifierLen;
          continue;
        }
      }
    });

    return tokens;
  }

  private isOperator(char: string) {
    return (
      char === '+' ||
      char === '-' ||
      char === '*' ||
      char === '/' ||
      char === '='
    );
  }

  // If it is an operator, it returns the length of the operator string, otherwise it returns 0
  private handleOperatorCase(line: string, startIndex: number) {
    const isOperatorSymbol = this.isOperator(line[startIndex]);
    if (!isOperatorSymbol) return 0;

    if (this.isOperator(line[startIndex + 1])) {
      return 2;
    } else {
      return 1;
    }
  }

  private handleNumberCase(line: string, startIndex: number) {
    if (!isNumber(line[startIndex])) return 0;

    let numberString = line[startIndex];
    for (let i = startIndex + 1; i < line.length; i++) {
      if (isNumber(line[i])) numberString += line[i];
      else break;
    }
    return numberString.length;
  }

  private handleStringLiteralCase(line: string, startIndex: number) {
    if (line[startIndex] !== "'") {
      // Not a string
      return 0;
    }

    let str = line[startIndex];
    for (let i = startIndex + 1; i < line.length; i++) {
      if (line[i] === "'") break;
      else str += line[i];
    }

    return str.length;
  }

  private handleIdentifier(line: string, startIndex: number) {
    if (!line[startIndex].match('\[a-z]')) {
      // Not a string
      return 0;
    }

    let identifierStr = line[startIndex];
    for (let i = startIndex + 1; i < line.length; i++) {
      if (this.isOperator(line[i])) break;
      else identifierStr += line[i];
    }

    return identifierStr.length;
  }
}
