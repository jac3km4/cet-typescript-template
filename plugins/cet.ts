import * as ts from "typescript";
import * as tstl from "typescript-to-lua";

const plugin: tstl.Plugin = {
  visitors: {
    [ts.SyntaxKind.CallExpression]: (node, context) => {
      return processCall(node, context);
    },
    [ts.SyntaxKind.NewExpression]: (node, conext) => {
      return processConstructor(node, conext)
    }
  }
}

const processConstructor = (expr: ts.NewExpression, context: tstl.TransformationContext) => {
  let typeChecker = context.program.getTypeChecker();
  let symbol = typeChecker.getTypeAtLocation(expr).getSymbol();
  let hasLuaConstructor = symbol.getJsDocTags().find(tag => tag.name == "newObjectConstructor");

  if (hasLuaConstructor) {
    let name = tstl.createStringLiteral(symbol.getName());
    return tstl.createCallExpression(tstl.createIdentifier('NewObject'), [name]);
  }

  return context.superTransformExpression(expr);
}

const processCall = (call: ts.CallExpression, context: tstl.TransformationContext) => {
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

  const createNativeCall = (className: string, name: string) => {
    let getSingletion = tstl.createCallExpression(tstl.createIdentifier('GetSingletion'), [tstl.createStringLiteral(className)]);
    let args = [];
    for (const arg of call.arguments) {
      args.push(context.transformExpression(arg));
    }
    return tstl.createMethodCallExpression(getSingletion, tstl.createIdentifier(name), args);
  }

  if (ts.isPropertyAccessExpression(call.expression)) {
    let symbol = typeChecker.getTypeAtLocation(call.expression.expression).getSymbol();
    let signature = typeChecker.getResolvedSignature(call);
    let staticName = symbol.getJsDocTags().find(tag => tag.name == "staticName");
    let mangledName = signature.getJsDocTags().find(tag => tag.name == "mangledName");
    let isStatic = signature.getJsDocTags().find(tag => tag.name == "static");
    let isNative = signature.getJsDocTags().find(tag => tag.name == "native");

    if (staticName?.text && mangledName?.text && ts.isPropertyAccessExpression(call.expression.expression)) {
      if (isNative) {
        return createNativeCall(staticName.text, mangledName.text)
      } else {
        let signature = `${staticName.text}::${mangledName.text}`;
        return createStaticCall(call.expression.expression.expression, signature)
      }
    }
    if (mangledName?.text && isStatic) {
      return createStaticCall(call.expression.expression, mangledName.text)
    }
    if (mangledName?.text) {
      let access = ts.factory.createPropertyAccessExpression(call.expression.expression, mangledName.text);
      let res = ts.factory.createCallExpression(access, call.typeArguments, call.arguments)
      return context.superTransformExpression(res)
    }
  }
  return context.superTransformExpression(call);
}

export default plugin;
