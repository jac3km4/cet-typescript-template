import * as ts from "typescript";
import * as tstl from "typescript-to-lua";

const plugin: tstl.Plugin = {
  visitors: {
    [ts.SyntaxKind.CallExpression]: (node, context) => {
      return createFunctionCall(node, context);
    },
  }
}

const createFunctionCall = (call: ts.CallExpression, context: tstl.TransformationContext) => {
  let typeChecker = context.program.getTypeChecker();

  const createStaticCall = (node: ts.Expression, name: string) => {
    let expr = context.transformExpression(node);
    let key = tstl.createStringLiteral(name);
    let index = tstl.createTableIndexExpression(expr, key);
    let args = [];
    for (const arg of call.arguments) {
      args.push(context.transformExpression(arg));
    }
    return tstl.createCallExpression(index, args);
  }

  if (ts.isCallExpression(call)) {
    if (ts.isPropertyAccessExpression(call.expression)) {
      let symbol = typeChecker.getTypeAtLocation(call.expression.expression).getSymbol();
      let signature = typeChecker.getResolvedSignature(call);
      let className = symbol.getJsDocTags().find(tag => tag.name == "realName");
      let functionName = signature.getJsDocTags().find(tag => tag.name == "realName");
      let isStatic = signature.getJsDocTags().find(tag => tag.name == "noSelf");

      if (className?.text && functionName?.text && ts.isPropertyAccessExpression(call.expression.expression)) {
        let signature = `${className.text}::${functionName.text}`;
        return createStaticCall(call.expression.expression.expression, signature)
      }
      if (functionName?.text && isStatic) {
        return createStaticCall(call.expression.expression, functionName.text)
      }
      if (functionName?.text) {
        let access = ts.factory.createPropertyAccessExpression(call.expression.expression, functionName.text);
        let res = ts.factory.createCallExpression(access, call.typeArguments, call.arguments)
        return context.superTransformExpression(res)
      }
    }
  }
  return context.superTransformExpression(call);
}

export default plugin;
