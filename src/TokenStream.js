export const TokenNodeType = {
  bracket: "Bracket",
  name: "Name",
  decimal: "Decimal"
};

export class TokenNode {
  constructor(type, value) {
    this.type = type;
    this.value = value;
    this.current = null;
  }
}

export default class TokenStream {
  constructor(inputStream) {
    this.input = inputStream;
  }

  readNext() {
    this.readWhile(this.isWhitespace);
    if (this.input.eof()) return null;
    let ch = this.input.peek();
    if (this.isDecimal(ch)) {
      this.input.next();
      return this.readNext();
    }
    if (ch == "[") {
      return this.readBracket();
    }
    if (this.isLettersStart(ch)) {
      return this.readLetter();
    }
  }

  readWhile(f) {
    let str = "";
    while (!this.input.eof() && f(this.input.peek())) {
      let ch = this.input.peek();
      str += ch;
      ch = this.input.next();
      if (ch == "\0") {
        break;
      }
    }
    return str;
  }
  isDecimal(ch) {
    return ch == ".";
  }
  isNum(ch) {
    return /[0-9]/.test(ch);
  }
  isWhitespace(ch) {
    return " \t\n".indexOf(ch) >= 0;
  }
  isLettersStart(ch) {
    return /[a-z\\$_]/i.test(ch);
  }
  isLetterTail(ch) {
    return /[a-z\\d\\$_]/i.test(ch);
  }

  readBracket() {
    this.input.next();
    let value = this.readWhile(ch => ch != "]");
    this.input.next();
    return this.createToken(TokenNodeType.bracket, value);
  }

  readLetter() {
    let value = this.readWhile(this.isLetterTail);
    return this.createToken(TokenNodeType.name, value);
  }

  createToken(type, value) {
    return new TokenNode(type, value);
  }

  peek() {
    if (this.current == null) {
      this.current = this.readNext();
    }
    return this.current;
  }

  next() {
    let tok = this.current;
    this.current = null;
    if (tok == null) {
      return this.readNext();
    }
    return tok;
  }
}
