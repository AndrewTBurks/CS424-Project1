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

let filters = {
  Top: null,
  Bottom: null,
  Shoes: null,
  Group: null
};

let pieCategory = ["Top", "Bottom", "Shoes", "Group"];
let groupColors = {
  "Me": "#444444",
  "EVL": "#888888",
  "Other": "#CCCCCC"
};

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
  .attr("r", pieDiameter/2 + 5);

// create filter clear button
svg.append("circle")
  .attr("class", "clearFilters")
  .attr("cx", margin.left + pieDiameter - 9)
  .attr("cy", 15)
  .attr("r", 9)
  .style("fill", "gray")
  .style("stroke-width", 4)
  .on("click", (d) => {
    clearFilters();
  });


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
    .padAngle(0.04)
    .sort(filtersPresent() ? (a, b) => {
      return a.value.compareTo(b.value);
    } : null);

  /*
    Count data entries for each property
  */

  // filter data for top pie
  let topCounts = {};
  data.forEach(el => {
    if(!topCounts[el.shirt0]) {
      topCounts[el.shirt0] = {filter: 0, noFilter: 0};
    }

    if(dataFitsFilter(el)) {
      topCounts[el.shirt0].filter += 1;
    } else {
      topCounts[el.shirt0].noFilter += 1;
    }
  })

  let topCountsArr = [];
  Object.keys(topCounts).forEach(el => {
    if(topCounts[el].filter > 0) {
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
    if(!botCounts[el.pants0]) {
      botCounts[el.pants0] = {filter: 0, noFilter: 0};
    }

    if(dataFitsFilter(el)) {
      botCounts[el.pants0].filter += 1;
    } else {
      botCounts[el.pants0].noFilter += 1;
    }
  })

  let botCountsArr = [];
  Object.keys(botCounts).forEach(el => {
    if(botCounts[el].filter > 0){
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
    if(!shoeCounts[el.shoes0]) {
      shoeCounts[el.shoes0] = {filter: 0, noFilter: 0};
    }

    if(dataFitsFilter(el)) {
      shoeCounts[el.shoes0].filter += 1;
    } else {
      shoeCounts[el.shoes0].noFilter += 1;
    }
  })

  let shoeCountsArr = [];
  Object.keys(shoeCounts).forEach(el => {
    if(shoeCounts[el].filter > 0) {
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
    if(!groupCounts[el.group]) {
      groupCounts[el.group] = {filter: 0, noFilter: 0};
    }

    if(dataFitsFilter(el)) {
      groupCounts[el.group].filter += 1;
    } else {
      groupCounts[el.group].noFilter += 1;
    }
  })

  let groupCountsArr = [];
  Object.keys(groupCounts).forEach(el => {
    if(groupCounts[el].filter > 0) {
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

  /*
    Draw Pie Charts
  */
  d3.selectAll(".arc")
    .attr("class", "oldArc")
    .transition()
    .duration(250)
    .style("fill-opacity", 0)

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

      if(filters[d.data.section] === d.data.value) {
        if(d.data.filter) {
            return 3;
        } else {
          return 2;
        }
      } else {
        return 2;
      }

      return filters[d.data.section] === d.data.value ? 3 : 1;
    })
    .style("stroke", function(d, i) {
      if(!d.data.filter) {
        return colorMap.get(d.data.value);
      } else if(filters[d.data.section] === d.data.value) {
        return "#A5A5B5";
      } else {
        return "#C5C5D5";
      }
    })
    .on("click", (d) => {
      if(filters[d.data.section] !== d.data.value) {
        filters[d.data.section] = d.data.value;
        // console.log("Filtering " + d.data.section + " by " + d.data.value);

      }
      else {
        // console.log("Clearing " + d.data.section + " filter");
        filters[d.data.section] = null;
      }


      updateClearButton();
      drawPies();
    })
    .transition()
    .delay(250)
    .duration(250)
    .style("fill-opacity", (d) => {
      return d.data.filter ? 1 : 0.25;
    });


}

function dataFitsFilter(dataPoint) {
  if(filters["Top"] && filters["Top"] !== dataPoint.shirt0){
    return false;
  }
  if(filters["Bottom"] && filters["Bottom"] !== dataPoint.pants0){
    return false;
  }
  if(filters["Shoes"] && filters["Shoes"] !== dataPoint.shoes0){
    return false;
  }
  if(filters["Group"] && filters["Group"] !== dataPoint.group){
    return false;
  }
  return true;
}

function filtersPresent() {
  pieCategory.forEach((el) => {
    if(filters[el] !== null) {
      return true;
    }
  });

  return false;
}

function updateClearButton() {
  if(!filtersPresent()) {
    d3.select(".clearFilters")
      .style("fill", "gray")
      .style("stroke", "lightgray");
  } else {
    d3.select(".clearFilters")
      .style("fill", "red")
      .style("stroke", "darkred");
  }
}

function clearFilters() {
  pieCategory.forEach((el) => {
    filters[el] = null;
  });

  drawPies();
  updateClearButton();
}
