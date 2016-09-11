/* global d3 */
"use strict";

const DATA_FILE = "./csv/data_2016-9-6.csv";
const COLOR_FILE = "./csv/colors_2016-9-6.csv";

let WIDTH = 1200,
  HEIGHT = 650;

let data = [];
let links = [];

let colors = [];
let colorMap;

let svg = d3.select("body").append("svg");

svg.attr("width", WIDTH)
    .attr("height", HEIGHT);

let margin = {
  top: 25,
  bottom: 25,
  left: 25,
  right: 25
};

let filters = {
  Top: null,
  Bottom: null,
  Shoes: null,
  Group: null
};
// ["#1f78b4","#e31a1c","#33a02c"]
let pieCategory = ["Top", "Bottom", "Shoes", "Group"];
let groupColors = {
  Me: "#1f78b4",
  EVL: "#e31a1c",
  Other: "#33a02c"
};

let piePadding = 10;
let groupGap = 20;
let pieDiameter = ((HEIGHT - margin.bottom - margin.top - groupGap) -
                      ((pieCategory.length - 1) * piePadding)) / pieCategory.length;


// background rectangle behind pies
svg.append("rect")
  .attr("class", "bg")
  .attr("width", pieDiameter + margin.left * 2)
  .attr("height", HEIGHT);

// draw background for graph
svg.append("rect")
  .attr("class", "bg")
  .attr("width", WIDTH - pieDiameter - margin.left * 2 - 10)
  .attr("height", HEIGHT)
  .attr("x", pieDiameter + margin.left * 2 + 10);

var graphGroup = svg.append("g")
  .attr("class", "graphGroup")
  .attr("transform", "translate(" + (pieDiameter + margin.left * 2 + 10) + ", 0)");

var linkGroup = graphGroup.append("g");

var graphDim = {
  left: 15,
  right: WIDTH - pieDiameter - margin.left * 2 - 25,
  top: 30,
  bottom: HEIGHT - 30
};

// dividing line between top 3 pies and bottom pie (clothes and group)

svg.append("line")
  .attr("class", "pieDivider")
  .attr("x1", margin.left - 5)
  .attr("x2", margin.left + pieDiameter + 5)
  .attr("y1", margin.top + (5 * piePadding / 2) + (3 * pieDiameter) + (groupGap / 2))
  .attr("y2", margin.top + (5 * piePadding / 2) + (3 * pieDiameter) + (groupGap / 2));

let topPie = svg.append("g")
  .attr("class", "pieGroup")
  .attr("transform", (d, i) => {
    return "translate(" + (pieDiameter / 2 + margin.left) + ", " +
              (margin.top + pieDiameter / 2 + (pieDiameter + piePadding) * 0) +
              ")";
  });

let bottomPie = svg.append("g")
  .attr("class", "pieGroup")
  .attr("transform", (d, i) => {
    return "translate(" + (pieDiameter / 2 + margin.left) + ", " +
              (margin.top + pieDiameter / 2 + (pieDiameter + piePadding) * 1) +
              ")";
  });

let shoePie = svg.append("g")
  .attr("class", "pieGroup")
  .attr("transform", (d, i) => {
    return "translate(" + (pieDiameter / 2 + margin.left) + ", " +
              (margin.top + pieDiameter / 2 + (pieDiameter + piePadding) * 2) +
              ")";
  });

let groupPie = svg.append("g")
  .attr("class", "pieGroup")
  .attr("transform", (d, i) => {
    return "translate(" + (pieDiameter / 2 + margin.left) + ", " +
              (margin.top + pieDiameter / 2 + groupGap
              + (pieDiameter + piePadding) * 3) +
              ")";
  });

d3.selectAll(".pieGroup").append("circle")
  .attr("class", "piebg")
  .attr("r", pieDiameter / 2 + 5);

// add icons for pies
let topPath = "M -10 -15 l 20 0 l 10 10 l -6 6 l -4 -4 l 2 20 l -24 0 l 2 -20" +
  "l -4 4 l -6 -6 l 10 -10",
  botPath = "M -10 -15 l 20 0 l 4 30 l -9 2 l -5 -23 l -5 23 l -9 -2 l 4 -30 " +
  "Z",
  shoePath = "M -15 -8 l -1 16 l 10 0 l 0 -3 l 5 3 l 17 0 l 0 -4 l -2 -4 " +
  "l -4 -2 l -13 -6 l -12 0 Z",
  groupPath = "";

// shirt icons
topPie.append("path")
  .attr("class", "topIcon")
  .attr("d", topPath)
  .style("stroke", "#C5C5D5")
  .style("stroke-width", 1)
  .style("fill", "none");

// pants icons
bottomPie.append("path")
  .attr("class", "botIcon")
  .attr("d", botPath)
  .style("stroke", "#C5C5D5")
  .style("stroke-width", 1)
  .style("fill", "none");

// pants icons
shoePie.append("path")
  .attr("class", "shoeIcon")
  .attr("d", shoePath)
  .style("stroke", "#C5C5D5")
  .style("stroke-width", 1)
  .style("fill", "none");

groupPie.append("text")
  .attr("class", "groupIcon")
  .attr("x", 0)
  .attr("y", 5)
  .text("Hello")
  .style("fill", "black")
  .style("text-anchor", "middle")
  .style("font-weight", "bold")
  .style("pointer-events", "none");

// create filter clear button
svg.append("circle")
  .attr("class", "clearFilters")
  .attr("cx", margin.left + pieDiameter)
  .attr("cy", margin.left)
  .attr("r", 10)
  .style("fill", "gray")
  .style("stroke", "lightgray")
  .style("stroke-width", 3)
  .on("click", (d) => {
    clearFilters();
  });

svg.append("line")
  .attr("class", "clearFiltersLine")
  .attr("x1", margin.left + pieDiameter - 4)
  .attr("x2", margin.left + pieDiameter + 4)
  .attr("y1", margin.left - 4)
  .attr("y2", margin.left + 4)
  .attr("pointer-events", "none")
  .style("stroke", "lightgray")
  .style("stroke-width", 3);

svg.append("line")
    .attr("class", "clearFiltersLine")
    .attr("x1", margin.left + pieDiameter - 4)
    .attr("x2", margin.left + pieDiameter + 4)
    .attr("y1", margin.left + 4)
    .attr("y2", margin.left - 4)
    .style("stroke", "lightgray");

// create tooltip

/* Initialize tooltip */
let tip = d3.tip ? d3.tip().attr('class', 'd3-tip')
  .html(function(d) {
    // var color = colorMap.get(d.data.value);
    var color = "#C5C5D5";

    return "<span style=\'color:" + color + ";stroke:lightgray;\'>" + d.data.value + "</span>: " + d.value;
  }) :
  function() {
    alert("! d3.tip MISSING ! \nDo you have an internet connection?");
  };

/* Invoke the tip in the context of your visualization */
svg.call(tip);

readData();

function readData() {
  d3.csv(DATA_FILE)
    .row((d, i) => {
      d.id = i;
      data.push(d);
    })
    .get((error, rows) => {
      if (error) {
        alert(error);
      }

      calculateLinks();
      readColors();
    });
}

function readColors() {
  d3.csv(COLOR_FILE)
    .row((d, i) => {
      colors.push(d);
    })
    .get((error, rows) => {
      if (error) {
        alert(error);
      }

      createColorMap();
    });
}

function createColorMap() {
  colorMap = new Map();

  colors.forEach((el) => {
    colorMap.set(el.color, el.hex);
  });

  drawPies();
  drawContextPies();

  drawNodes();
}

// prepare full data for pies (without any filters)
function drawContextPies() {
  let arc = d3.arc()
      .innerRadius(pieDiameter / 2 - 2)
      .outerRadius(pieDiameter / 2 + 3);

  let arcs = d3.pie()
      .value((d) => {
        return d.count;
      })
      .padAngle(0.04);

    /*
      Count data entries for each property
    */

    // filter data for top pie
  let topCounts = {};
  data.forEach(el => {
    if (!topCounts[el.shirt0]) {
      topCounts[el.shirt0] = 0;
    }
    topCounts[el.shirt0] += 1;
  });

  let topCountsArr = [];
  Object.keys(topCounts).forEach(el => {
    topCountsArr.push({
      value: el,
      count: topCounts[el],
      section: pieCategory[0]
    });
  });


    // filter data for bot pie
  let botCounts = {};
  data.forEach(el => {
    if (!botCounts[el.pants0]) {
      botCounts[el.pants0] = 0;
    }
    botCounts[el.pants0] += 1;
  });

  let botCountsArr = [];
  Object.keys(botCounts).forEach(el => {
    botCountsArr.push({
      value: el,
      count: botCounts[el],
      section: pieCategory[1]
    });
  });

    // filter data for shoe pie
  let shoeCounts = {};
  data.forEach(el => {
    if (!shoeCounts[el.shoes0]) {
      shoeCounts[el.shoes0] = 0;
    }
    shoeCounts[el.shoes0] += 1;
  });

  let shoeCountsArr = [];
  Object.keys(shoeCounts).forEach(el => {
    shoeCountsArr.push({
      value: el,
      count: shoeCounts[el],
      section: pieCategory[2]
    });
  });

    // filter data for group pie
  let groupCounts = {};
  data.forEach(el => {
    if (!groupCounts[el.group]) {
      groupCounts[el.group] = 0;
    }
    groupCounts[el.group] += 1;
  });

  let groupCountsArr = [];
  Object.keys(groupCounts).forEach(el => {
    groupCountsArr.push({
      value: el,
      count: groupCounts[el],
      section: pieCategory[3]
    });
  });

    /* Draw Outer Pies*/

    // draw Top pie
  topPie.selectAll(".outerArc")
      .data(arcs(topCountsArr))
    .enter().append("path")
      .attr("class", "outerArc")
      .attr("d", arc)
      .style("fill", (d) => {
        return colorMap.get(d.data.value);
      });

    // draw Bottom pie
  bottomPie.selectAll(".outerArc")
      .data(arcs(botCountsArr))
    .enter().append("path")
      .attr("class", "outerArc")
      .attr("d", arc)
      .style("fill", (d) => {
        return colorMap.get(d.data.value);
      });


    // draw Shoe pie
  shoePie.selectAll(".outerArc")
      .data(arcs(shoeCountsArr))
    .enter().append("path")
      .attr("class", "outerArc")
      .attr("d", arc)
      .style("fill", (d) => {
        return colorMap.get(d.data.value);
      });

    // draw Group pie
  groupPie.selectAll(".outerArc")
      .data(arcs(groupCountsArr))
    .enter().append("path")
      .attr("class", "outerArc")
      .attr("d", arc)
      .style("fill", (d, i) => {
        return groupColors[d.data.value];
      });

}


function drawPies() {
  let arc = d3.arc()
    .innerRadius(pieDiameter / 4)
    .outerRadius(pieDiameter / 2 - 10);

  let arcs = d3.pie()
    .value((d) => {
      return d.count;
    })
    .padAngle(0.04);

  /*
    Count data entries for each property
  */

  // filter data for top pie
  let topCounts = {};
  data.forEach(el => {
    if (!topCounts[el.shirt0]) {
      topCounts[el.shirt0] = {filter: 0, noFilter: 0};
    }

    if (dataFitsFilter(el)) {
      topCounts[el.shirt0].filter += 1;
    } else {
      topCounts[el.shirt0].noFilter += 1;
    }
  });

  let topCountsArr = [];
  Object.keys(topCounts).forEach(el => {
    if (topCounts[el].filter > 0) {
      topCountsArr.push({
        value: el,
        count: topCounts[el].filter,
        section: pieCategory[0],
        filter: true
      });
    }

    // if(topCounts[el].noFilter > 0) {
    //   topCountsArr.push({
    //     value: el,
    //     count: topCounts[el].noFilter,
    //     section: pieCategory[0],
    //     filter: false
    //   });
    // }
  });


  // filter data for bot pie
  let botCounts = {};
  data.forEach(el => {
    if (!botCounts[el.pants0]) {
      botCounts[el.pants0] = {filter: 0, noFilter: 0};
    }

    if (dataFitsFilter(el)) {
      botCounts[el.pants0].filter += 1;
    } else {
      botCounts[el.pants0].noFilter += 1;
    }
  });

  let botCountsArr = [];
  Object.keys(botCounts).forEach(el => {
    if (botCounts[el].filter > 0) {
      botCountsArr.push({
        value: el,
        count: botCounts[el].filter,
        section: pieCategory[1],
        filter: true
      });
    }

    // if(botCounts[el].noFilter > 0){
    //   botCountsArr.push({
    //     value: el,
    //     count: botCounts[el].noFilter,
    //     section: pieCategory[1],
    //     filter: false
    //   });
    // }
  });

  // filter data for shoe pie
  let shoeCounts = {};
  data.forEach(el => {
    if (!shoeCounts[el.shoes0]) {
      shoeCounts[el.shoes0] = {filter: 0, noFilter: 0};
    }

    if (dataFitsFilter(el)) {
      shoeCounts[el.shoes0].filter += 1;
    } else {
      shoeCounts[el.shoes0].noFilter += 1;
    }
  });

  let shoeCountsArr = [];
  Object.keys(shoeCounts).forEach(el => {
    if (shoeCounts[el].filter > 0) {
      shoeCountsArr.push({
        value: el,
        count: shoeCounts[el].filter,
        section: pieCategory[2],
        filter: true
      });
    }

    // if(shoeCounts[el].noFilter > 0) {
    //   shoeCountsArr.push({
    //     value: el,
    //     count: shoeCounts[el].noFilter,
    //     section: pieCategory[2],
    //     filter: false
    //   });
    // }

  });

  // filter data for group pie
  let groupCounts = {};
  data.forEach(el => {
    if (!groupCounts[el.group]) {
      groupCounts[el.group] = {filter: 0, noFilter: 0};
    }

    if (dataFitsFilter(el)) {
      groupCounts[el.group].filter += 1;
    } else {
      groupCounts[el.group].noFilter += 1;
    }
  });

  let groupCountsArr = [];
  Object.keys(groupCounts).forEach(el => {
    if (groupCounts[el].filter > 0) {
      groupCountsArr.push({
        value: el,
        count: groupCounts[el].filter,
        section: pieCategory[3],
        filter: true
      });
    }

    // if(groupCounts[el].noFilter > 0) {
    //   groupCountsArr.push({
    //     value: el,
    //     count: groupCounts[el].noFilter,
    //     section: pieCategory[3],
    //     filter: false
    //   });
    // }
  });

  var countObjects = {
    Top: topCounts,
    Bottom: botCounts,
    Shoes: shoeCounts,
    Group: groupCounts
  };

  /*
    Draw Pie Charts
  */
  d3.selectAll(".arc")
    .attr("class", "oldArc")
    .transition()
    .duration(250)
    .style("fill-opacity", 0);

  d3.selectAll(".oldArc").transition().delay(250).remove();


  // draw Top pie
  topPie.selectAll(".arc")
    .data(arcs(topCountsArr))
  .enter().append("path")
    .attr("class", "arc")
    .attr("d", arc)
    .style("fill", (d) => {
      return colorMap.get(d.data.value);
    })
    .style("fill-opacity", 0);

  // draw Bottom pie
  bottomPie.selectAll(".arc")
    .data(arcs(botCountsArr))
  .enter().append("path")
    .attr("class", "arc")
    .attr("d", arc)
    .style("fill", (d) => {
      return colorMap.get(d.data.value);
    })
    .style("fill-opacity", 0);


  // draw Shoe pie
  shoePie.selectAll(".arc")
    .data(arcs(shoeCountsArr))
  .enter().append("path")
    .attr("class", "arc")
    .attr("d", arc)
    .style("fill", (d) => {
      return colorMap.get(d.data.value);
    })
    .style("fill-opacity", 0);

  // draw Group pie
  groupPie.selectAll(".arc")
    .data(arcs(groupCountsArr))
  .enter().append("path")
    .attr("class", "arc")
    .attr("d", arc)
    .style("fill", (d, i) => {
      return groupColors[d.data.value];
    })
    .style("fill-opacity", 0);

  d3.selectAll(".arc")
    .style("stroke-width", function(d, i) {

      if (filters[d.data.section] === d.data.value) {
        if (d.data.filter) {
          return 3;
        } else {
          return 2;
        }
      } else {
        return 2;
      }
    })
    .style("stroke", function(d, i) {
      if (!d.data.filter) {
        return colorMap.get(d.data.value);
      } else if (filters[d.data.section] === d.data.value) {
        return "#A5A5B5";
      } else {
        return "#C5C5D5";
      }
    })
    .on("click", (d) => {
      if (filters[d.data.section] !== d.data.value) {
        filters[d.data.section] = d.data.value;
        // console.log("Filtering " + d.data.section + " by " + d.data.value);

      } else {
        // console.log("Clearing " + d.data.section + " filter");
        filters[d.data.section] = null;
      }

      updateClearButton();
      updateGraphOnFilter();
      drawPies();
    })
    .on('mouseover', tip.show)
    .on('mouseout', tip.hide)
    .transition()
    .delay(250)
    .duration(250)
    .style("fill-opacity", (d) => {
      return d.data.filter ? 1 : 0.25;
    });

  d3.selectAll(".outerArc")
    .style("fill-opacity", (d) => {
      return countObjects[d.data.section][d.data.value].filter > 0 ? 1 : 0.2;
    });

  updateIcons();
}

function drawNodes() {
  var positions = new Array(data.length).fill(0).map((el) => {
    return {
      x: randX(),
      y: randY()
    };
  });

  graphGroup.selectAll(".dataNodeG")
    .data(data)
  .enter().append("g")
    .attr("class", "dataNodeG")
    .attr("transform", (d, i) => {
      return "translate(" + positions[i].x + ", " + positions[i].y + ")";
    })
    .each((d, i, group) => {
      var thisG = d3.select(group[i]); // there has to be a better way to do this

      var nodeDimension = {
        x: 32,
        y: 48
      };

      // create background group rectangle
      thisG.append("rect")
        .attr("class", "nodebg")
        .attr("width", nodeDimension.x)
        .attr("height", nodeDimension.y)
        .attr("x", -nodeDimension.x / 2)
        .attr("y", -nodeDimension.y / 2)
        .style("fill", "black")
        .style("stroke", (d, i) => {
          return groupColors[d.group];
        })
        .style("stroke-width", 2);

      // draw shirt rectangle(s)
      if (d.shirt0 === d.shirt1) {
          // create only 1 rectangle
        thisG.append("rect")
          .datum(d.shirt0)
          .attr("width", nodeDimension.x - 6)
          .attr("height", (nodeDimension.y - 6) / 3)
          .attr("x", -nodeDimension.x / 2 + 3)
          .attr("y", -nodeDimension.y / 2 + 3)
          .style("fill", colorMap.get(d.shirt0));

      } else {
          // create main rectangle and small rectangle
        thisG.append("rect")
          .datum(d.shirt0)
          .attr("width", 2 * nodeDimension.x / 3 - 3)
          .attr("height", (nodeDimension.y - 6) / 3)
          .attr("x", -nodeDimension.x / 2 + 3)
          .attr("y", -nodeDimension.y / 2 + 3)
          .style("fill", colorMap.get(d.shirt0));

        thisG.append("rect")
          .datum(d.shirt1)
          .attr("width", nodeDimension.x / 3 - 3)
          .attr("height", (nodeDimension.y - 6) / 3)
          .attr("x", -nodeDimension.x / 2 + 2 * nodeDimension.x / 3)
          .attr("y", -nodeDimension.y / 2 + 3)
          .style("fill", colorMap.get(d.shirt1));
      }

      // draw pants rectangle(s)
      if (d.pants0 === d.pants1) {
          // create only 1 rectangle
        thisG.append("rect")
          .datum(d.pants0)
          .attr("width", nodeDimension.x - 6)
          .attr("height", (nodeDimension.y - 6) / 3)
          .attr("x", -nodeDimension.x / 2 + 3)
          .attr("y", -(nodeDimension.y - 6) / 6)
          .style("fill", colorMap.get(d.pants0));

      } else {
          // create main rectangle and small rectangle
        thisG.append("rect")
          .datum(d.pants0)
          .attr("width", 2 * nodeDimension.x / 3 - 3)
          .attr("height", (nodeDimension.y - 6) / 3)
          .attr("x", -nodeDimension.x / 2 + 3)
          .attr("y", -(nodeDimension.y - 6) / 6)
          .style("fill", colorMap.get(d.pants0));

        thisG.append("rect")
          .datum(d.pants1)
          .attr("width", nodeDimension.x / 3 - 3)
          .attr("height", (nodeDimension.y - 6) / 3)
          .attr("x", -nodeDimension.x / 2 + 2 * nodeDimension.x / 3)
          .attr("y", -(nodeDimension.y - 6) / 6)
          .style("fill", colorMap.get(d.pants1));
      }

      // draw shoes rectangle(s)
      if (d.shoes0 === d.shoes1) {
          // create only 1 rectangle
        thisG.append("rect")
          .datum(d.shoes0)
          .attr("width", nodeDimension.x - 6)
          .attr("height", (nodeDimension.y - 6) / 3)
          .attr("x", -nodeDimension.x / 2 + 3)
          .attr("y", (nodeDimension.y - 6) / 6)
          .style("fill", colorMap.get(d.shoes0));

      } else {
          // create main rectangle and small rectangle
        thisG.append("rect")
          .datum(d.shoes0)
          .attr("width", 2 * nodeDimension.x / 3 - 3)
          .attr("height", (nodeDimension.y - 6) / 3)
          .attr("x", -nodeDimension.x / 2 + 3)
          .attr("y", (nodeDimension.y - 6) / 6)
          .style("fill", colorMap.get(d.shoes0));

        thisG.append("rect")
          .datum(d.shoes1)
          .attr("width", nodeDimension.x / 3 - 3)
          .attr("height", (nodeDimension.y - 6) / 3)
          .attr("x", -nodeDimension.x / 2 + 2 * nodeDimension.x / 3)
          .attr("y", (nodeDimension.y - 6) / 6)
          .style("fill", colorMap.get(d.shoes1));
      }

    });

  createForceLayout();

  function randX() {
    return Math.round(Math.random() * (graphDim.right - graphDim.left) + graphDim.left);
  }

  function randY() {
    return Math.round(Math.random() * (graphDim.bottom - graphDim.top) + graphDim.top);
  }
}

function createForceLayout() {
  // .attr("width", WIDTH - pieDiameter - margin.left * 2 - 10)
  // .attr("x", pieDiameter + margin.left * 2 + 10);

  var borderNodeMargin = 10;

  var clampX = d3.scaleLinear()
    .domain([16 + borderNodeMargin, WIDTH - pieDiameter - margin.left * 2 - 26 - borderNodeMargin])
    .range([16 + borderNodeMargin, WIDTH - pieDiameter - margin.left * 2 - 26 - borderNodeMargin])
    .clamp(true);

  var clampY = d3.scaleLinear()
    .domain([24 + borderNodeMargin, HEIGHT - 24 - borderNodeMargin])
    .range([24 + borderNodeMargin, HEIGHT - 24 - borderNodeMargin])
    .clamp(true);

  var node = d3.selectAll(".dataNodeG");

  var link = linkGroup.selectAll(".link")
    .data(links)
  .enter().append("line")
    .attr("class", "link")
    .style("stroke-width", (d) => {
      return d.value - 3.5;
    });

  var simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function(d) {
      return d.id;
    }))
    .force("collision", d3.forceCollide(Math.sqrt(Math.pow(16, 2) + Math.pow(24, 2)) + 5))
    .force("charge", d3.forceManyBody().strength(-500))
    .force("center", d3.forceCenter(
      // (pieDiameter / 2) + margin.left + 5 + (WIDTH / 2),
      (WIDTH - pieDiameter - margin.left * 2 - 10) / 2,
      (HEIGHT / 2)
    ));

  simulation
    .nodes(data)
    .on("tick", () => {
      node
        .datum((d) => {
          d.x = clampX(d.x);
          d.y = clampY(d.y);
          return d;
        })
        .attr("transform", (d) => {
          return "translate(" + d.x + "," + d.y + ")";
        });

      link
        .datum((d) => {
          d.source.x = clampX(d.source.x);
          d.source.y = clampY(d.source.y);
          d.target.x = clampX(d.target.x);
          d.target.y = clampY(d.target.y);

          return d;
        })
        .attr("x1", (d) => {
          return d.source.x;
        })
        .attr("x2", (d) => {
          return d.target.x;
        })
        .attr("y1", (d) => {
          return d.source.y;
        })
        .attr("y2", (d) => {
          return d.target.y;
        });

    });

  simulation.force("link")
      .links(links);
}

function calculateLinks() {
  for (var i = 0; i < data.length - 1; i++) {
    for (var j = i + 1; j < data.length; j++) {
      let similarity = calculateNodeSimilarity(data[i], data[j]);

      if (similarity > 2) {
        links.push({
          source: i,
          target: j,
          value: calculateNodeSimilarity(data[i], data[j])
        });
      }
    }// end for(var j ...
  }// end for(var i ...
}

function calculateNodeSimilarity(p1, p2) {
  // calculate similarity between nodes using color at each level
  let totalSimilarity = 0;

  // compare primary shirt color
  if (p1.shirt0 === p2.shirt0) {
    totalSimilarity += 2;
  } else if (p1.shirt0 === p2.shirt1) {
    totalSimilarity += 1;
  } else if (p1.shirt0 === p2.pants0 || p1.shirt0 === p2.shoes0) {
    totalSimilarity += 0.5;
  }
  // else if (p1.shirt0 === p2.pants1 || p1.shirt0 === p2.shoes1) {
  //   totalSimilarity += 0.5;
  // }

  // compare secondary shirt color
  if (p1.shirt1 === p2.shirt1) {
    totalSimilarity += 1;
  } else if (p1.shirt1 === p2.shirt0) {
    totalSimilarity += 1;
  }
  // else if (p1.shirt1 === p2.pants0 || p1.shirt1 === p2.shoes0) {
  //   totalSimilarity += 0.5;
  // } else if (p1.shirt1 === p2.pants1 || p1.shirt1 === p2.shoes1) {
  //   totalSimilarity += 0.25;
  // }

  // compare primary pants color
  if (p1.pants0 === p2.pants0) {
    totalSimilarity += 2;
  } else if (p1.pants0 === p2.pants1) {
    totalSimilarity += 1;
  } else if (p1.pants0 === p2.shirt0 || p1.pants0 === p2.shoes0) {
    totalSimilarity += 0.5;
  }
  // else if (p1.pants0 === p2.shirt1 || p1.pants0 === p2.shoes1) {
  //   totalSimilarity += 0.5;
  // }

  // compare secondary pants color
  if (p1.pants1 === p2.pants1) {
    totalSimilarity += 1;
  } else if (p1.pants1 === p2.pants0) {
    totalSimilarity += 1;
  }
  // else if (p1.pants1 === p2.shirt0 || p1.pants1 === p2.shoes0) {
  //   totalSimilarity += 0.5;
  // } else if (p1.pants1 === p2.shirt1 || p1.pants1 === p2.shoes1) {
  //   totalSimilarity += 0.25;
  // }

  // compare primary shoes color
  if (p1.shoes0 === p2.shoes0) {
    totalSimilarity += 2;
  } else if (p1.shoes0 === p2.shoes1) {
    totalSimilarity += 1;
  } else if (p1.shoes0 === p2.shirt0 || p1.shoes0 === p2.pants0) {
    totalSimilarity += 0.5;
  }
  // else if (p1.shoes0 === p2.shirt1 || p1.shoes0 === p2.pants1) {
  //   totalSimilarity += 0.5;
  // }

  // compare secondary shoes color
  if (p1.shoes1 === p2.shoes1) {
    totalSimilarity += 1;
  } else if (p1.shoes1 === p2.shoes0) {
    totalSimilarity += 1;
  }
  // else if (p1.shoes1 === p2.shirt0 || p1.shoes1 === p2.pants0) {
  //   totalSimilarity += 0.5;
  // } else if (p1.shoes1 === p2.shirt1 || p1.shoes1 === p2.pants1) {
  //   totalSimilarity += 0.25;
  // }

  return totalSimilarity;
}

function updateGraphOnFilter() {
  d3.selectAll(".dataNodeG")
    .style("opacity", (d) => {
      return dataFitsFilter(d, d.section) ? 1 : 0.25;
    });

  d3.selectAll(".link")
    .style("opacity", (d) => {
      if (!dataFitsFilter(data[d.target.id]) || !dataFitsFilter(data[d.source.id])) {
        return 0.1;
      } else {
        return 1;
      }
    });
}

function dataFitsFilter(dataPoint) {
  if (filters.Top && filters.Top !== dataPoint.shirt0) {
    return false;
  }
  if (filters.Bottom && filters.Bottom !== dataPoint.pants0) {
    return false;
  }
  if (filters.Shoes && filters.Shoes !== dataPoint.shoes0) {
    return false;
  }
  if (filters.Group && filters.Group !== dataPoint.group) {
    return false;
  }
  return true;
}

function filtersPresent() {
  var hasFilters = false;

  pieCategory.forEach((el) => {

    if (filters[el]) {
      hasFilters = true;
    }
  });

  return hasFilters;
}

function updateClearButton() {

  if (!filtersPresent()) {
    d3.select(".clearFilters").transition().duration(250)
      .style("fill", "gray")
      .style("stroke", "lightgray");

    d3.selectAll(".clearFiltersLine").transition().duration(250)
      .style("stroke", "lightgray");
  } else {
    d3.select(".clearFilters").transition().duration(250)
      .style("fill", "red")
      .style("stroke", "darkred");

    d3.selectAll(".clearFiltersLine").transition().duration(250)
      .style("stroke", "darkred");
  }
}

function updateIcons() {

  d3.select(".topIcon")
    .style("fill", filters.Top === null ? "none" : colorMap.get(filters.Top))
    .style("stroke-width", filters.Top === null ? 1 : 2);

  d3.select(".botIcon")
    .style("fill", filters.Bottom === null ? "none" : colorMap.get(filters.Bottom))
    .style("stroke-width", filters.Bottom === null ? 1 : 2);

  d3.select(".shoeIcon")
    .style("fill", filters.Shoes === null ? "none" : colorMap.get(filters.Shoes))
    .style("stroke-width", filters.Shoes === null ? 1 : 2);

  d3.select(".groupIcon")
    .text(filters.Group === null ? "Group" : filters.Group)
    // .style("opacity", filters.Group === null ? 0 : 1)
    .style("fill", filters.Group === null ? "gray" : groupColors[filters.Group]);
}

function clearFilters() {
  if (filtersPresent()) {
    pieCategory.forEach((el) => {
      filters[el] = null;
    });

    drawPies();
    updateClearButton();
    updateGraphOnFilter();
  }
}
