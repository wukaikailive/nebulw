import ASTParser from "./src/ASTParser";
import { ASTType } from "./src/ASTNode";

export default function safeGet(obj, calculation) {
  let parser = new ASTParser(calculation);
  parser.tokenizer();
  parser.parser();
  let ast = parser.ast;
  let length = ast.body.length;
  if (length == 0) {
    return null;
  }
  let result = obj;
  for (let i = 0; i < length; i++) {
    let astNode = ast.body[i];
    switch (astNode.type) {
      case ASTType.root:
        break;
      case ASTType.array: {
        let indexs = astNode.indexs;
        let name = astNode.name;
        result = result && result[name];
        indexs.forEach(element => {
          result = result && result[element];
        });
        break;
      }
      case ASTType.object: {
        let name = astNode.name;
        result = result && result[name];
        break;
      }
    }
  }
  return result;
}

export function safeGets(obj,...arr){
  return arr.map(o => {
    return safeGet(obj,o)
  });
}