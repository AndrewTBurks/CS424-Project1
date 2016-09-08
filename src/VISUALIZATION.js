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

let pieCategory = ["Top", "Bottom", "Shoes", "Demographic"];

let piePadding = 10;
let pieDiameter = ((HEIGHT - margin.bottom - margin.top) -
                      ((pieCategory.length-1)*piePadding)) / pieCategory.length;

let topPie = svg.append("g")
  .attr("class", "pieGroupTop")
  .attr("transform", (d, i) => {
      return "translate(" + (pieDiameter/2 + margin.left) + ", " +
              (margin.top + pieDiameter/2 + (pieDiameter + piePadding) * 0 ) +
              ")";
  });

let bottomPie = svg.append("g")
  .attr("class", "pieGroupBot")
  .attr("transform", (d, i) => {
      return "translate(" + (pieDiameter/2 + margin.left) + ", " +
              (margin.top + pieDiameter/2 + (pieDiameter + piePadding) * 1 ) +
              ")";
  });

let shoePie = svg.append("g")
  .attr("class", "pieGroupShoe")
  .attr("transform", (d, i) => {
      return "translate(" + (pieDiameter/2 + margin.left) + ", " +
              (margin.top + pieDiameter/2 + (pieDiameter + piePadding) * 2 ) +
              ")";
  });

let groupPie = svg.append("g")
  .attr("class", "pieGroupGroup")
  .attr("transform", (d, i) => {
      return "translate(" + (pieDiameter/2 + margin.left) + ", " +
              (margin.top + pieDiameter/2 + (pieDiameter + piePadding) * 3 ) +
              ")";
  });

// pieGroups.append("circle")
//   .attr("class", "pie")
//   .attr("r", pieDiameter/2)
//   .on("click", (d, i) => {
//     console.log(d);
//   });

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
    topCountsArr.push({color: el, count: topCounts[el]});
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
    botCountsArr.push({color: el, count: botCounts[el]});
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
    shoeCountsArr.push({color: el, count: shoeCounts[el]});
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
    groupCountsArr.push({color: el, count: groupCounts[el]});
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
      return colorMap.get(d.data.color);
    });

  // draw Bottom pie
  bottomPie.selectAll(".arc")
    .data(arcs(botCountsArr))
  .enter().append("path")
    .attr("class", "arc")
    .attr("d", arc)
    .style("fill", (d) => {
      return colorMap.get(d.data.color);
    });


  // draw Shoe pie
  shoePie.selectAll(".arc")
    .data(arcs(shoeCountsArr))
  .enter().append("path")
    .attr("class", "arc")
    .attr("d", arc)
    .style("fill", (d) => {
      return colorMap.get(d.data.color);
    });

  // draw Group pie


}
