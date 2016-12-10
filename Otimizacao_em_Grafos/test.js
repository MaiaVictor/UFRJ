var G = require("./graph.js");

var algos = [
  {name: "Brute force", fn: (g)=>G.tspBruteForce(g, false), stop:0},
  {name: "Backtrack", fn: (g)=>G.tspBruteForce(g, true), stop:0},
  {name: "Branch and Bound", fn: (g)=>G.tspBranchAndBound(g), stop:0},
  {name: "All-MST Heuristic", fn: (g)=>G.tspAllMST(g), stop:0}
];

console.log("Size | BruteForce | BranchAndBound | All-MST");
console.log("--- | --- | --- | --- | ---");
for (var i=3; i<24; ++i){

  var graph = G.parse(G.randomGraphSource(i));

  var row = [];
  algos.forEach(function(algo){
    if (!algo.stop){
      var t = Date.now();
      var r = algo.fn(graph);
      var d = (Date.now()-t)/1000;
      if (d > 6) algo.stop = 1;
      row.push(r.size+" ("+d.toFixed(3)+"s)");
    } else row.push("-");
  });

  console.log((~~i)+" | "+row.join(" | "));
};
