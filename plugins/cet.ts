import * as ts from "typescript";
import * as tstl from "typescript-to-lua";

const plugin: tstl.Plugin = {
  visitors: {
    [ts.SyntaxKind.CallExpression]: (node, context) => processCall(node, context),
    [ts.SyntaxKind.NewExpression]: (node, conext) => processConstructor(node, conext)
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
  if (ts.isPropertyAccessExpression(call.expression)) {
    const typeChecker = context.program.getTypeChecker();

    const callContext = call.expression.expression;
    const classSymbol = typeChecker.getTypeAtLocation(callContext).getSymbol();
    const funSignature = typeChecker.getResolvedSignature(call);

    const singletonName = classSymbol.getJsDocTags().find(tag => tag.name == "singletonName");
    const mangledFunName = funSignature.getJsDocTags().find(tag => tag.name == "mangledName");
    const isStatic = funSignature.getJsDocTags().find(tag => tag.name == "static");
    const isNative = funSignature.getJsDocTags().find(tag => tag.name == "native");
    const isOverload = typeChecker.getTypeAtLocation(call.expression).getCallSignatures().length > 1;

    if (ts.isPropertyAccessExpression(callContext) && singletonName?.text && mangledFunName?.text && isStatic) {
      if (isNative) {
        // native static methods: GetSingleton("WorldPosition"):SetVector4(pos, vec4)
        const getSingleton = createGetSingletion(singletonName.text);
        const args = call.arguments.map(arg => context.transformExpression(arg));
        return tstl.createMethodCallExpression(getSingleton, tstl.createIdentifier(mangledFunName.text), args)
      } else {
        // non-native static methods: Game["gameObject::GetActiveWeapon;GameObject"](obj)
        const expr = context.transformExpression(callContext.expression);
        const signature = `${singletonName.text}::${mangledFunName.text}`;
        const index = tstl.createTableIndexExpression(expr, tstl.createStringLiteral(signature));
        const args = call.arguments.map(arg => context.transformExpression(arg));
        return tstl.createCallExpression(index, args);
      }
    }
    if (mangledFunName?.text && isStatic) {
      // global static methods: Game["GetPlayer;GameInstance"]()
      const expr = context.transformExpression(callContext);
      const index = tstl.createTableIndexExpression(expr, tstl.createStringLiteral(mangledFunName.text));
      const args = call.arguments.map(arg => context.transformExpression(arg));
      return tstl.createCallExpression(index, args);
    }
    if (mangledFunName?.text && isOverload && !isStatic) {
      // overloaded instance methods: GetSingletion("gameObject")["HasHighlight;EFocusForcedHighlightTypeEFocusOutlineType"](self, a, b)
      const clazz = typeChecker.getTypeAtLocation(funSignature.getDeclaration().parent);
      const singletonName = clazz.getSymbol().getJsDocTags().find(tag => tag.name == "singletonName");
      if (singletonName?.text) {
        const getSingletion = createGetSingletion(singletonName.text);
        const index = tstl.createTableIndexExpression(getSingletion, tstl.createStringLiteral(mangledFunName.text));
        const self: ts.Expression = callContext;
        const args = [self].concat(call.arguments).map(arg => context.transformExpression(arg));
        return tstl.createCallExpression(index, args);
      }
    }
    if (mangledFunName?.text) {
      // normal instance methods: player:GetSenses()
      let access = ts.factory.createPropertyAccessExpression(callContext, mangledFunName.text);
      let res = ts.factory.createCallExpression(access, call.typeArguments, call.arguments)
      return context.superTransformExpression(res)
    }
  }
  return context.superTransformExpression(call);
}

const createGetSingletion = (name: string) => {
  const literal = tstl.createStringLiteral(name);
  return tstl.createCallExpression(tstl.createIdentifier("GetSingletion"), [literal])
}

export default plugin;
