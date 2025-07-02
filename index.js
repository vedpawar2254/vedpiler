export default function ({ types: t }) {
  return {
    visitor: {
      UpdateExpression(path) {
        const node = path.node;
        const arg = node.argument;
        // Match
        if (
          t.isMemberExpression(arg) &&
          t.isIdentifier(arg.object, { name: "store" })
        ) {
          const key = arg.property.name;

          // state.count
          const stateProp = t.memberExpression(
            t.identifier("state"),
            t.identifier(key)
          );

          // state.count + 1 or - 1
          const binary = t.binaryExpression(
            node.operator === "++" ? "+" : "-",
            stateProp,
            t.numericLiteral(1)
          );

          // Build: { count: state.count + 1 }
          const objExpr = t.objectExpression([
            t.objectProperty(t.identifier(key), binary),
          ]);

          // Build: state => ({ count: state.count + 1 })
          const arrowFn = t.arrowFunctionExpression(
            [t.identifier("state")],
            objExpr
          );

          // Build: store.set(state => ({ ... }))
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

        // Match
        if (
          t.isMemberExpression(left) &&
          t.isIdentifier(left.object, { name: "store" })
        ) {
          const key = left.property.name;

          // Build: { count: newValue }
          const objExpr = t.objectExpression([
            t.objectProperty(t.identifier(key), right),
          ]);

          // state => ({ count: newValue })
          const arrowFn = t.arrowFunctionExpression(
            [t.identifier("state")],
            objExpr
          );

          //  store.set(state => ({ ... }))
          const setCall = t.callExpression(
            t.memberExpression(t.identifier("store"), t.identifier("set")),
            [arrowFn]
          );

          path.replaceWith(setCall);
        }
      },
    },
  };
}
