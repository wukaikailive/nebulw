import ASTParser from "./src/ASTParser";
import { ASTType } from "./src/ASTNode";

export function safeGet(obj, calculation) {
  let parser = null;
  if(calculation instanceof ASTParser){
    parser = calculation;
  }else{
    parser = compile(calculation)
  }
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

export function compile(exp){
  let parser = new ASTParser(exp);
  parser.tokenizer();
  parser.parser();
  return parser;
}

export default {
  safeGet,
  safeGets,
  compile
}