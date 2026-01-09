// to call modules via 'require' and 'loadmodule' its like this:
//rjs.loadModule("https://api.github.com/repos/rasen46/rasen46.github.io/contents/jsLib/modules/example.js");
//rjs.require("example.js", function (example) {
//  if (!example) return;
//  example.example();
//});

(function () {
  var module = {
    example: function () {
      rjs.print("hello");
    },
  };
  return module;
})({});
