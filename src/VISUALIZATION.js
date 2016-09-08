const DATA_FILE = "./csv/data_2016-9-6.csv";
const COLOR_FILE = "./csv/colors_2016-9-6.csv";

let WIDTH = 1200,
    HEIGHT = 650;

let data = [];
let colors = [];
let colorMap;

let svg = d3.select("body").append("svg");

svg.attr("width", WIDTH)
    .attr("height", HEIGHT);

svg.append("rect")
  .attr("class", "bg")
  .attr("width", "100%")
  .attr("height", "100%");

let margin = {
  top: 25,
  bottom: 25,
  left: 25,
  right: 25
};

let pieCategory = ["Top", "Bottom", "Shoes", "Group"];
let groupColors = ["#444444", "#888888", "#CCCCCC"];

let piePadding = 10;
let pieDiameter = ((HEIGHT - margin.bottom - margin.top) -
                      ((pieCategory.length-1)*piePadding)) / pieCategory.length;

let topPie = svg.append("g")
  .attr("class", "pieGroup")
  .attr("transform", (d, i) => {
      return "translate(" + (pieDiameter/2 + margin.left) + ", " +
              (margin.top + pieDiameter/2 + (pieDiameter + piePadding) * 0 ) +
              ")";
  });

let bottomPie = svg.append("g")
  .attr("class", "pieGroup")
  .attr("transform", (d, i) => {
      return "translate(" + (pieDiameter/2 + margin.left) + ", " +
              (margin.top + pieDiameter/2 + (pieDiameter + piePadding) * 1 ) +
              ")";
  });

let shoePie = svg.append("g")
  .attr("class", "pieGroup")
  .attr("transform", (d, i) => {
      return "translate(" + (pieDiameter/2 + margin.left) + ", " +
              (margin.top + pieDiameter/2 + (pieDiameter + piePadding) * 2 ) +
              ")";
  });

let groupPie = svg.append("g")
  .attr("class", "pieGroup")
  .attr("transform", (d, i) => {
      return "translate(" + (pieDiameter/2 + margin.left) + ", " +
              (margin.top + pieDiameter/2 + (pieDiameter + piePadding) * 3 ) +
              ")";
  });

d3.selectAll(".pieGroup").append("circle")
  .attr("class", "piebg")
  .attr("r", pieDiameter/2 + 10);

readData();

function readData() {
  d3.csv(DATA_FILE)
    .row((d, i) => {
      data.push(d);
    })
    .get((error, rows) => {
      if(error) {
        alert(error);
      }

      readColors();
    });
}

function readColors() {
  d3.csv(COLOR_FILE)
    .row((d, i) => {
      colors.push(d);
    })
    .get((error, rows) => {
      if(error) {
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
}

function drawPies() {
  let arc = d3.arc()
    .innerRadius(pieDiameter/4)
    .outerRadius(pieDiameter/2);

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
    if(!topCounts[el.shirt0]) {
      topCounts[el.shirt0] = 0;
    }
    topCounts[el.shirt0] += 1;
  })

  let topCountsArr = [];
  Object.keys(topCounts).forEach(el => {
    topCountsArr.push({value: el, count: topCounts[el], section: pieCategory[0]});
  });


  // filter data for bot pie
  let botCounts = {};
  data.forEach(el => {
    if(!botCounts[el.pants0]) {
      botCounts[el.pants0] = 0;
    }
    botCounts[el.pants0] += 1;
  })

  let botCountsArr = [];
  Object.keys(botCounts).forEach(el => {
    botCountsArr.push({value: el, count: botCounts[el], section: pieCategory[1]});
  });

  // filter data for shoe pie
  let shoeCounts = {};
  data.forEach(el => {
    if(!shoeCounts[el.shoes0]) {
      shoeCounts[el.shoes0] = 0;
    }
    shoeCounts[el.shoes0] += 1;
  })

  let shoeCountsArr = [];
  Object.keys(shoeCounts).forEach(el => {
    shoeCountsArr.push({value: el, count: shoeCounts[el], section: pieCategory[2]});
  });

  // filter data for group pie
  let groupCounts = {};
  data.forEach(el => {
    if(!groupCounts[el.group]) {
      groupCounts[el.group] = 0;
    }
    groupCounts[el.group] += 1;
  })

  let groupCountsArr = [];
  Object.keys(groupCounts).forEach(el => {
    groupCountsArr.push({value: el, count: groupCounts[el], section: pieCategory[3]});
  });

  /*
    Draw Pie Charts
  */

  // draw Top pie
  topPie.selectAll(".arc")
    .data(arcs(topCountsArr))
  .enter().append("path")
    .attr("class", "arc")
    .attr("d", arc)
    .style("fill", (d) => {
      return colorMap.get(d.data.value);
    });

  // draw Bottom pie
  bottomPie.selectAll(".arc")
    .data(arcs(botCountsArr))
  .enter().append("path")
    .attr("class", "arc")
    .attr("d", arc)
    .style("fill", (d) => {
      return colorMap.get(d.data.value);
    });


  // draw Shoe pie
  shoePie.selectAll(".arc")
    .data(arcs(shoeCountsArr))
  .enter().append("path")
    .attr("class", "arc")
    .attr("d", arc)
    .style("fill", (d) => {
      return colorMap.get(d.data.value);
    });

  // draw Group pie
  groupPie.selectAll(".arc")
    .data(arcs(groupCountsArr))
  .enter().append("path")
    .attr("class", "arc")
    .attr("d", arc)
    .style("fill", (d, i) => {
      return groupColors[i];
    });

  d3.selectAll(".arc")
    .on("click", (d) => {
      console.log((d.data.value +
        (d.data.section !== pieCategory[3] ? (" " + colorMap.get(d.data.value)) :
                                              "")), d.data.count);
    });

}
