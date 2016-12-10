module.exports = (function(){
  var I = require("immutable");
  var PQueue = require("tinyqueue");

  // Relevant Types:
  // type Name = String
  // type Node = {name: Name, edges: {String : Edge}}
  // type Edge = {target: Node, weight: Int}
  // type Graph = Map Name Node
  // type Path = [Name]
  // type TSPSolution = {size: Number, tour: Path}
  // type EdgeSelection = {
  //   cost: Number,
  //   targets: Map Name (Name,Name),
  //   include: Map Name (Set Name),
  //   exclude: Map Name (Set Name)}

  // String -> Graph
  function parse(code) {
    var graph = {};
    var lines = code.split(",");
    for (var i=0, l=lines.length; i<l; ++i){
      if (lines[i].length > 0){
        var words = lines[i]
          .replace(/  /g,"")  // remove double spaces
          .replace(/^ */g,"") // remove leading spaces
          .replace(/\n/g,"")  // remove new lines
          .split(" ");
        for (var j=0; j<2; ++j)
          if (!graph[words[j]])
            graph[words[j]] = {
              name: words[j],
              nears: [],
              edges: {}};
        for (var j=0; j<2; ++j){
          var link = {
            target: graph[words[1-j]],
            weight: Number(words[2])};
          graph[words[j]].edges[words[1-j]] = link;
          graph[words[j]].nears.push(link);
        };
      };
    };
    for (var node in graph)
      graph[node].nears.sort(function(a,b){
        return a.weight - b.weight;
      })
    return graph;
  };

  // Number -> Random String
  function randomGraphSource(size){
    var strs = [];
    for (var i=0; i<size; ++i)
      for (var j=i+1; j<size; ++j)
        strs.push((i+1)+" "+(j+1)+" "+Math.floor(Math.random()*20));
    return strs.join(", ");
  };

  // Graph -> [Name]
  function nodeNames(graph){
    return Object.keys(graph);
  };

  // Graph, Name, Name -> Edge
  function edge(graph, a, b){
    return graph[a].edges[b] || {weight: Infinity, target: b};
  };

  // Graph, Name -> [Edge]
  function edges(graph, a){
    return graph[a].edges;
  };

  // Graph -> Name
  function firstNodeName(graph){
    for (var name in graph)
      return name;
  };

  // Graph, Name, Name -> Maybe Number
  function distance(graph, a, b){
    return edge(graph, a, b).weight;
  };

  // Graph, Path -> Maybe Number
  function pathSize(graph, path){
    var size = 0;
    for (var i=1; i<path.length; ++i)
      size += distance(graph, path[i-1], path[i % path.length]);
    return size;
  };

  // Graph, Bool -> TSPSolution
  function tspBruteForce(graph, backtrack, debug){
    var minTour = {tour: null, size: Infinity};
    var startNode = graph[firstNodeName(graph)];
    var startPath = I.List([startNode.name]);
    var startVisit = I.Set(nodeNames(graph)).delete(startNode.name);
    (function move(node, path, pathSize, visit){
      if (debug)
        console.log("Path: "+path);
      visit.forEach(function(neig, _){
        if (backtrack && minTour && pathSize >= minTour.size)
          return;
        move(node.edges[neig].target,
            path.push(neig),
            pathSize + node.edges[neig].weight,
            visit.delete(neig));
      });
      if (visit.size === 0){
        var tourSize = pathSize + distance(graph, path.last(), startNode.name);
        var tourPath = path.push(startNode.name).toArray();
        if (!minTour || tourSize < minTour.size)
          minTour = {tour: tourPath, size: tourSize};
        if (debug)
          console.log("Tour: "+JSON.stringify(tourPath)+" (size: "+tourSize+")");
      };
    })(startNode, startPath, 0, startVisit);
    return minTour;
  };

  // Graph -> TSPSolution
  // http://lcm.csa.iisc.ernet.in/dsa/node187.html
  function tspBranchAndBound(graph, debug){

    // EdgeSelection -> Edgeselection
    function shallowCopyEdgeSelection(selection){
      return {
        cost: selection.cost,
        targets: selection.targets,
        include: selection.include,
        exclude: selection.exclude};
    };

    // Graph, EdgeSelection, Name -> Maybe EdgeSelection
    function refreshEdgeSelection(graph, selection, nodeNames){
      var sel = shallowCopyEdgeSelection(selection);

      // For each node that we want to refresh
      for (var i=0, I=nodeNames.length; i<I; ++i){
        var nodeName = nodeNames[i];
        var include = sel.include.get(nodeName); // ???????
        var exclude = sel.exclude.get(nodeName);

        // Removes cost of old targets
        var targets = sel.targets.get(nodeName);
        for (var j=0, J=targets.length; j<J; ++j)
          sel.cost -= distance(graph, nodeName, targets[j]);

        // Selects mandatory targets
        var newTargets = include.toArray();

        // Selects closest targets given constraint
        var nears = graph[nodeName].nears;
        for (var j=0, J=nears.length; j<J; ++j){
          if (newTargets.length === 2)
            break;
          if ( !exclude.has(nears[j].target.name)
            && !include.has(nears[j].target.name))
            newTargets.push(nears[j].target.name);
        };

        // If we don't have exactly 2 targets, we couldn't satisfy the contraints
        if (newTargets.length !== 2)
          return null;

        // Adds the cost of new targets
        for (var j=0; j<2; ++j)
          sel.cost += distance(graph, nodeName, newTargets[j]);

        // Updates targets
        sel.targets = sel.targets.set(nodeName, newTargets);
      };
      return sel;
    };

    // Graph -> EdgeSelection
    function initialEdgeSelection(graph){
      var sel = {
        cost: 0,
        targets: I.Map([]),
        include: I.Map([]),
        exclude: I.Map([])};
      var names = nodeNames(graph);
      for (var i=0, l=names.length; i<l; ++i){
        sel.targets = sel.targets.set(names[i], []);
        sel.include = sel.include.set(names[i], I.Set([]));
        sel.exclude = sel.exclude.set(names[i], I.Set([]));
      };
      return refreshEdgeSelection(graph, sel, names);
    };

    // EdgeSelection -> Path
    function edgeSelectionTour(graph, selection){
      var startNodeName = firstNodeName(graph);
      var nodeName = startNodeName;
      var path = [];
      var visited = {};
      visited[nodeName] = true;
      path.push(nodeName);
      do {
        var targets = selection.targets.get(nodeName);
        if (!visited[targets[0]])
          nodeName = targets[0];
        else if (!visited[targets[1]])
          nodeName = targets[1];
        else
          break;
        visited[nodeName] = true;
        path.push(nodeName);
      } while (nodeName !== startNodeName);
      path.push(startNodeName);
      return path;
    };

    // Graph, EdgeSelection, (Name, Name) -> Maybe EdgeSelection
    function addIncludeConstraint(graph, selection, edge){
      var sel = shallowCopyEdgeSelection(selection);
      sel.include = sel.include.update(edge[0], function(names){ return names.add(edge[1]); });
      sel.include = sel.include.update(edge[1], function(names){ return names.add(edge[0]); });
      return refreshEdgeSelection(graph, sel, edge);
    };

    // Graph, EdgeSelection, Name, Name -> Maybe EdgeSelection
    function addExcludeConstraint(graph, selection, edge){
      var sel = shallowCopyEdgeSelection(selection);
      sel.exclude = sel.exclude.update(edge[0], function(names){ return names.add(edge[1]); });
      sel.exclude = sel.exclude.update(edge[1], function(names){ return names.add(edge[0]); });
      return refreshEdgeSelection(graph, sel, edge);
    };


    // EdgeSelection -> String
    function showEdgeSelection(sel){
      var inc = sel.include.toJS();
      var exc = sel.exclude.toJS();
      var str = "[ lower bound: "+(sel.cost/2)+" | constraints: ";
      nodePairs.forEach(function(pair){
        if (inc[pair[0]].indexOf(pair[1]) !== -1)
          str += "+"+pair[0]+":"+pair[1]+" ";
        if (exc[pair[0]].indexOf(pair[1]) !== -1)
          str += "-"+pair[0]+":"+pair[1]+" ";
      });
      str += "]";
      return str;
    };

    if (debug)
      console.log("\n\nBranch and bound:");

    var nodePairs = (function(graph){
      var pairs = I.List([]);
      var names = nodeNames(graph);
      for (var i=0, l=names.length; i<l; ++i)
        for (var j=i+1; j<l; ++j)
          pairs = pairs.push([names[i], names[j]]);
      return pairs;
    })(graph);

    var graphSize = nodeNames(graph).length;

    var min = {tour: null, size: Infinity};

    (function branchAndBound(sel, addConstraints, level){
      if (debug)
        console.log("Branch: "+showEdgeSelection(sel));

      if (addConstraints.size === 0){
        var tour = edgeSelectionTour(graph, sel);
        var size = pathSize(graph, tour);
        if (tour.length === graphSize + 1){
          if (size < min.size)
            min = {tour: tour, size: size};
          if (debug)
            console.log("Tour: "+tour.join(":")+" (size "+size+")");
        };
        return;
      };

      if (sel.cost / 2 >= min.size){
        if (debug)
          console.log("Pruned.");
        return;
      };

      var selInclude = addIncludeConstraint(graph, sel, addConstraints.last());
      var selExclude = addExcludeConstraint(graph, sel, addConstraints.last());
      var sels = selInclude && selExclude 
          ? (selInclude.cost < selExclude.cost
            ? [selInclude,selExclude]
            : [selExclude,selInclude])
          : selInclude ? [selInclude]
          : selExclude ? [selExclude]
          : [];
      for (var i=0, l=sels.length; i<l; ++i)
        branchAndBound(sels[i], addConstraints.pop());
    })(initialEdgeSelection(graph), nodePairs.reverse());

    return min;
  };

  // Graph, Name -> TSPSolution
  function tspMST(graph, startNodeName){
    var tree = null;
    var visited = {};
    var tour = [];
    var edges = new PQueue([], function(a,b){ return a.weight - b.weight; });
    edges.push({source: null, target: graph[startNodeName], distance:0});
    var edge;
    while (edge = edges.pop()) {
      var nodeName = edge.target.name;
      if (!visited[nodeName]){
        tour.push(edge.target.name);
        visited[nodeName] = true;
        for (var i=0, l=edge.target.nears.length; i<l; ++i)
          edges.push({
            source: graph[nodeName],
            weight: edge.target.nears[i].weight,
            target: edge.target.nears[i].target});
      };
    };
    tour.push(startNodeName);
    return {tour: tour, size: pathSize(graph, tour)};
  };

  // Graph -> TSPSolution
  function tspAllMST(graph){
    var min = {tour: null, size: Infinity};
    nodeNames(graph).forEach(function(nodeName){
      var tour = tspMST(graph, nodeName);
      if (tour.size < min.size)
        min = tour;
    });
    return min;
  };

  return {
    parse: parse,
    randomGraphSource: randomGraphSource,
    nodeNames: nodeNames,
    firstNodeName: firstNodeName,
    edge: edge,
    edges: edges,
    distance: distance,
    pathSize: pathSize,
    tspBruteForce: tspBruteForce,
    tspBranchAndBound: tspBranchAndBound,
    tspMST: tspMST,
    tspAllMST: tspAllMST};

})();

