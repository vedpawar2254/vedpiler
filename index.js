module.exports = function ({ types: t }) {
  return {
    visitor: {
      UpdateExpression(path) {
        const node = path.node;
        const arg = node.argument;

        if (
          t.isMemberExpression(arg) &&
          t.isIdentifier(arg.object, { name: "store" })
        ) {
          const key = arg.property.name;

          const stateProp = t.memberExpression(
            t.identifier("state"),
            t.identifier(key)
          );

          const binary = t.binaryExpression(
            node.operator === "++" ? "+" : "-",
            stateProp,
            t.numericLiteral(1)
          );

          const objExpr = t.objectExpression([
            t.objectProperty(t.identifier(key), binary),
          ]);

          const arrowFn = t.arrowFunctionExpression(
            [t.identifier("state")],
            objExpr
          );

          const setCall = t.callExpression(
            t.memberExpression(t.identifier("store"), t.identifier("set")),
            [arrowFn]
          );

          console.log("replacing with:", JSON.stringify(setCall, null, 2));
          path.replaceWith(setCall);
        }
      },

      AssignmentExpression(path) {
        const node = path.node;
        const left = node.left;
        const right = node.right;

        if (
          t.isMemberExpression(left) &&
          t.isIdentifier(left.object, { name: "store" })
        ) {
          const key = left.property.name;

          const objExpr = t.objectExpression([
            t.objectProperty(t.identifier(key), right),
          ]);

          const arrowFn = t.arrowFunctionExpression(
            [t.identifier("state")],
            objExpr
          );

          const setCall = t.callExpression(
            t.memberExpression(t.identifier("store"), t.identifier("set")),
            [arrowFn]
          );

          path.replaceWith(setCall);
        }
      },
    },
  };
};
