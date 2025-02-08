var margin = [20, 120, 20, 140],
  width = 2500 - margin[1] - margin[3],
  height = 1500 - margin[0] - margin[2],
  i = 0,
  duration = 1250,
  root;

var tree = d3.layout.tree().size([height, width]);

var diagonal = d3.svg.diagonal().projection(function (d) {
  return [d.y, d.x];
});

var vis = d3
  .select("#enterprise_svg")
  .append("svg:svg")
  .attr("width", width + margin[1] + margin[3])
  .attr("height", height + margin[0] + margin[2])
  .append("svg:g")
  .attr("transform", "translate(" + margin[3] + "," + margin[0] + ")");

d3.json("arf.json", function (json) {
  root = json;
  root["name"] = "ACT";
  root.x0 = height / 2;
  root.y0 = 0;

  function collapse(d) {
    if (d.children) {
      d._children = d.children;
      d._children.forEach(collapse);
      d.children = null;
    }
  }

  /*  function toggleAll(d) {
      if (d.children) {
        d.children.forEach(toggleAll);
        toggle(d);
      }
    } */
  root.children.forEach(collapse);
  console.log(root);
  update(root);
});

function update(source) {
  // var duration = d3.event && d3.event.altKey ? 5000 : 500;

  // Compute the new tree layout.
  var nodes = tree.nodes(root).reverse();

  // Normalize for fixed-depth.
  nodes.forEach(function (d) {
    d.y = d.depth * 280;
  }); //Depth for each jump

  // Update the nodes…
  var node = vis.selectAll("g.node").data(nodes, function (d) {
    return d.id || (d.id = ++i);
  });

  // Enter any new nodes at the parent's previous position.
  var nodeEnter = node
    .enter()
    .append("svg:g")
    .attr("class", "node")

    .attr("transform", function (d) {
      return "translate(" + source.y0 + "," + source.x0 + ")";
    })
    .on("click", function (d) {
      toggle(d);
      update(d);
      printNodeInfo(d.url_md);
    });

  nodeEnter
    .append("svg:circle")
    .attr("r", 1e-6)
    .style("fill", function (d) {
      return d._children ? "lightsteelblue" : "#fff";
    });

  nodeEnter
    .append("a")

    .attr("target", "_blank")
    .attr("font-weight", 600) //This is the weight for the title
    .attr("xlink:href", function (d) {
      return d.url;
    })
    .on("click", function (d) {})
    .append("svg:text")
    .attr("x", function (d) {
      return d.children || d._children ? -10 : 10;
    }) // x location of the title in comparison to the button
    .attr("dy", ".35em") // location of the title in comparison to the button
    .attr("text-anchor", function (d) {
      return d.children || d._children ? "end" : "start";
    })
    .text(function (d) {
      return d.name;
    })
    .style("fill: rgb(0, 0, 0);", function (d) {
      return d.free ? "black" : "#999";
    })
    .append("tspan")
    .attr("xlink:href", function (d) {
      return d.url;
    })
    .attr("font-weight", 300) //This is the weight for the description
    .attr("x", function (d) {
      return d.children || d._children ? -10 : 10;
    }) //definition location x
    .attr("y", function (d) {
      return d.children || d._children ? -10 : 10;
    }) //definition location y
    .attr("dy", ".35em")
    .attr("text-anchor", function (d) {
      return d.children || d._children ? "end" : "start";
    })
    // .text(function (d) {
    //   if (d.description !== undefined) {
    //     return d.description;
    //   }
    // })
    .style("fill: rgb(0, 0, 0);", function (d) {
      return d.free ? "black" : "#999";
    });

  // Transition nodes to their new position.
  var nodeUpdate = node
    .transition()
    .duration(duration)
    .attr("transform", function (d) {
      return "translate(" + d.y + "," + d.x + ")";
    });

  nodeUpdate
    .select("circle")
    .attr("r", 6)
    .style("fill", function (d) {
      return d._children ? "lightsteelblue" : "#fff";
    });

  nodeUpdate.select("text").style("fill-opacity", 1);

  // Transition exiting nodes to the parent's new position.
  var nodeExit = node
    .exit()
    .transition()
    .duration(duration)
    .attr("transform", function (d) {
      return "translate(" + source.y + "," + source.x + ")";
    })
    .remove();

  nodeExit.select("circle").attr("r", 1e-6);

  nodeExit.select("text").style("fill-opacity", 1e-6);

  // Update the links…
  var link = vis.selectAll("path.link").data(tree.links(nodes), function (d) {
    return d.target.id;
  });

  // Enter any new links at the parent's previous position.
  link
    .enter()
    .insert("svg:path", "g")
    .attr("class", "link")
    .attr("d", function (d) {
      var o = { x: source.x0, y: source.y0 };
      return diagonal({ source: o, target: o });
    })
    .transition()
    .duration(duration)
    .attr("d", diagonal);

  // Transition links to their new position.
  link.transition().duration(duration).attr("d", diagonal);

  // Transition exiting nodes to the parent's new position.
  link
    .exit()
    .transition()
    .duration(duration)
    .attr("d", function (d) {
      var o = { x: source.x, y: source.y };
      return diagonal({ source: o, target: o });
    })
    .remove();

  // Stash the old positions for transition.
  nodes.forEach(function (d) {
    d.x0 = d.x;
    d.y0 = d.y;
  });
}

// Toggle children.
function toggle(d) {
  if (d.children) {
    d._children = d.children;
    d.children = null;
    scrollviewLeft(d);
  } else {
    d.children = d._children;
    d._children = null;
    scrollviewRight(d);
  }
}

// Define the function to update the 'nodeInfo' div with information
function scrollviewLeft(nodeData) {
  var nodeInfoDiv = document.getElementById("svgobjectdiv");
  if (nodeData.parent) {
    nodeInfoDiv.scrollLeft -= 250;
  } else {
    nodeInfoDiv.scrollLeft = 0;
  }
}

// Define the function to update the 'nodeInfo' div with information
function scrollviewRight(nodeData) {
  var nodeInfoDiv = document.getElementById("svgobjectdiv");
  if (nodeData.children) {
    nodeInfoDiv.scrollLeft += 250;
  }
}

function toTitleCase(str) {
  str = str.replace("-", " ");
  str = str.replace("-", " ");
  str = str.trim();
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

function togglesvg(value) {
  // Access the 'div' element by its ID
  var enterprise = document.getElementById("enterprise_svg");
  var ics = document.getElementById("ics_svg");

  if (value == 0) {
    ics.style.display = "none";
    enterprise.style.display = "block";
  } else if (value == 1) {
    ics.style.display = "block";
    enterprise.style.display = "none";
  }
}

function printNodeInfo(infoToPrint) {
  // Access the 'div' element by its ID
  var nodeInfoDiv = document.getElementById("nodeInfo");
  // Clear the previous content of the div
  nodeInfoDiv.innerHTML = "";
  console.log(infoToPrint);
  var bufferToStore = "";
  if (infoToPrint != null) {
    fetch(infoToPrint)
      .then((response) => {
        // Check if the request was successful
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.text(); // or response.blob() if you need the binary data
      })
      .then((markdown) => {
        console.log(markdown); // Here's your markdown text
        if (markdown != null) {
          bufferToStore = marked.parse(markdown);
          nodeInfoDiv.style.display = "block";
          var svgObject = document.getElementById("svgobjectdiv");
          svgObject.style.width = "50%";
          nodeInfoDiv.innerHTML = bufferToStore;
        }
      });
  } else {
    nodeInfoDiv.style.display = "none";
    var svgObject = document.getElementById("svgobjectdiv");
    svgObject.style.width = "100%";
    nodeInfoDiv.innerHTML = bufferToStore;
  }
}

// Function to update the rendered Markdown
function updateMarkdown() {
  const textarea = document.getElementById("reportInfo");
  const markdownOutput = document.getElementById("markdown-output");
  const markdownText = textarea.value;
  const renderedHTML = marked.parse(markdownText);
  markdownOutput.innerHTML = renderedHTML;
}
