export default class InputStream {
  constructor(input) {
    this.input = input;
    this.pos = 0;
    this.line = 1;
    this.col = 0;
  }
  next() {
    let ch = this.input.charAt(this.pos++);
    if (ch == "\n") {
      this.line++;
      this.col = 0;
    } else {
      this.col++;
    }
    return this.peek() || "\0";
  }
  peek() {
    return this.input.charAt(this.pos);
  }

  eof() {
    return this.pos >= this.input.length;
  }

  croke() {
    return new Error("语法错误");
  }
}
