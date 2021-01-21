import * as ts from "typescript";
import * as tstl from "typescript-to-lua";
import { scriptToEngineMap } from './mappings';

const plugin: tstl.Plugin = {
  visitors: {
    [ts.SyntaxKind.CallExpression]: (node, context) => {
      const result = context.superTransformExpression(node);
      let typeChecker = context.program.getTypeChecker();

      if (tstl.isMethodCallExpression(result) &&
        tstl.isTableIndexExpression(result.prefixExpression) &&
        tstl.isTableIndexExpression(result.prefixExpression.table) &&
        tstl.isStringLiteral(result.prefixExpression.index) &&
        tstl.isIdentifier(result.prefixExpression.table.table) &&
        tstl.isStringLiteral(result.prefixExpression.table.index) &&
        result.prefixExpression.table.table.text == "Game" &&
        result.prefixExpression.table.index.value == "Raw"
      ) {
        let clazz = result.prefixExpression.index.value;
        if (scriptToEngineMap[clazz]) {
          clazz = scriptToEngineMap[clazz];
        }

        let signature = `${clazz}::${result.name.text};`;
        for (const arg of node.arguments) {
          const type = typeChecker.getTypeAtLocation(arg);
          const typeName = typeChecker.typeToString(type);
          if (type.isStringLiteral()) {
            signature += "String"
          } else if (type.isClassOrInterface()) {
            signature += typeName;
          } else if (typeName == "bool" || typeName == "true" || typeName == "false") {
            signature += "Bool";
          } else if (typeName == "number" || type.isNumberLiteral()) {
            let pos = node.getSourceFile().getLineAndCharacterOfPosition(node.pos);
            let name = node.getSourceFile().fileName;
            throw new Error(`Do not pass numbers directly, you should use a wrapper instead: i32(${typeName}) at ${name}:${pos.line}:${pos.character}`)
          } else {
            let pos = node.getSourceFile().getLineAndCharacterOfPosition(node.pos);
            let name = node.getSourceFile().fileName;
            throw new Error(`Unsupported type ${typeName} at ${name}:${pos.line}:${pos.character}`)
          }
        }
        const access = tstl.createTableIndexExpression(tstl.createIdentifier("Game"), tstl.createStringLiteral(signature), node);
        return tstl.createCallExpression(access, result.params);
      } else {
        return result;
      }
    },
  },
};

export default plugin;
