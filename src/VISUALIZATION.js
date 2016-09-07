const DATA_FILE = "/csv/data_2016-9-6.csv";
const COLOR_FILE = "/csv/color_2016-9-6.csv";

let WIDTH = 1200,
    HEIGHT = 650;

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

let pieGroups = svg.selectAll(".pieGroup")
  .data(pieCategory)
.enter().append("g")
  .attr("class", "pieGroup")
  .attr("transform", (d, i) => {
      return "translate(" + (pieDiameter/2 + margin.left) + ", " +
              (margin.top + pieDiameter/2 + (pieDiameter + piePadding) * i ) +
              ")";
  });

pieGroups.append("circle")
  .attr("class", "pie")
  .attr("r", pieDiameter/2)
  .on("click", (d, i) => {
    console.log(d);
  });

function readData() {

}

function readColors() {

}

function createColorMap() {

}
