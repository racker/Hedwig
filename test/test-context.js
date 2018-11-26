var context = require.context('./', true, /.js$/);
context.keys().forEach(context);
console.log(context.keys());