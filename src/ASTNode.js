export const ASTType = {
  root: "Root",
  object: "Object",
  array: "Array"
};

export default class ASTNode {
  constructor(type) {
    this.type = type;
  }
}

export class ASTObject extends ASTNode {
  constructor(name) {
    super(ASTType.object);
    this.name = name;
  }
}

export class ASTArray extends ASTNode {
  constructor(name, number) {
    super(ASTType.array);
    this.name = name;
    this.indexs = [];
    this.indexs.push(number);
  }
}

export class AST extends ASTNode {
  constructor() {
    super(ASTType.root);
    this.body = [];
  }
}
