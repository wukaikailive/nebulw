import TokenStream, { TokenNodeType } from "./TokenStream";
import InputStream from "./InputStream";
import { ASTType, AST, ASTArray, ASTObject } from "./ASTNode";
export default class ASTParser {
  constructor(input) {
    this.input = input;
    this.tokens = [];
    this.ast = null;
  }

  tokenizer() {
    let tokenStream = new TokenStream(new InputStream(this.input));
    let tokens = [];
    let node = tokenStream.next();
    while (node != null) {
      tokens.push(node);
      node = tokenStream.next();
    }
    this.tokens = tokens;
  }

  parser() {
    let ast = new AST();
    let current = 0;
    for (let i = 0; i < this.tokens.length; i++) {
      let token = this.tokens[i];
      switch (token.type) {
        case TokenNodeType.name:
          current++;
          ast.body.push(new ASTObject(token.value));
          break;
        case TokenNodeType.bracket: {
          let preNode = ast.body[current - 1];
          if (!preNode) break;
          if (preNode.type !== ASTType.array) {
            ast.body.pop();
            let astArray = new ASTArray(preNode.name, token.value);
            ast.body.push(astArray);
          } else {
            preNode.indexs.push(token.value);
          }
          break;
        }
      }
    }
    this.ast = ast;
  }
}
