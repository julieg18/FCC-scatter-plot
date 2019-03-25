let url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";
let xMargin = 50;
let yMargin = 50;
let chartWidth = 700;
let chartHeight = 400;
let width = chartWidth + xMargin * 2;
let height = chartHeight + yMargin * 2;

//svg
const svg = d3.select("svg")
  .attr("height", height)
  .attr("width", width);

//legend
const legendText = svg.append("text")
  .attr("id", "legend");
legendText.append("tspan")
    .text("Riders with no doping allegations")
    .attr("x", 500)
    .attr("y", 60);
legendText.append("tspan")
    .text("Riders with doping allegations")
    .attr("x", 500)
    .attr("y", 80);

svg.append("rect")
  .attr("width", 10)
  .attr("height", 10)
  .attr("id", "legend-square-1")
  .attr("x", 485)
  .attr("y", 50)
svg.append("rect")
  .attr("width", 10)
  .attr("height", 10)
  .attr("id", "legend-square-2")
  .attr("x", 485)
  .attr("y", 70)


let req = new XMLHttpRequest();
req.open("GET", url, true);
req.send();
req.onload = function() {
  const dataset = JSON.parse(req.responseText);
  
  //adds new key to each dataset item
  dataset.forEach((currentValue, index) => {
    let temp = dataset[index]["Time"].split(':');
    let timeObj = new Date();
    timeObj.setHours(0);
    timeObj.setMinutes(temp[0]);
    timeObj.setSeconds(temp[1]);
    dataset[index].timeObj = timeObj;
  });
  
  //scales
  const xScale = d3.scaleLinear()
    .domain([
      d3.min(dataset, (d) => d["Year"] - 1),
      d3.max(dataset, (d) => d["Year"] + 1)
    ]).range([xMargin, chartWidth]);
  const yScale = d3.scaleTime()
    .domain([
      d3.min(dataset, (d) => d["timeObj"]),
      d3.max(dataset, (d) => d["timeObj"])
    ])
    .range([yMargin, chartHeight]);

  //axis
  const xAxis = d3.axisBottom(xScale)
    .tickFormat(d3.format("d"));
  const yAxis = d3.axisLeft(yScale)
    .tickFormat(d3.timeFormat("%M:%S"));

  svg.append("g")
    .attr("id", "x-axis")
    .attr("transform", `translate(0, ${chartHeight})`)
    .call(xAxis);
  svg.append("g")
    .attr("id", "y-axis")
    .attr("transform", `translate(${xMargin}, 0)`)
    .call(yAxis); 

  //circles 
  svg.selectAll("circle")
    .data(dataset)
    .enter()
    .append("circle")
    .attr("r", 5)
    .attr("class", "dot")
    .attr("data-xvalue", (d, i) => d["Year"])
    .attr("data-yvalue", (d) => d["timeObj"])
    .attr("cx", (d) => xScale(d["Year"]))
    .attr("cy", (d) => yScale(d["timeObj"]))
    //tooltip
    .on("mouseover", (d, i) => {
      d3.select("div")
        .style("visibility", "visible")
        .style("left", (event.pageX + 5) + "px")
        .style("top", (event.pageY - 30) + "px")
        .attr("data-year", d["Year"]);
      addTextToTooltip(d);
    })
    .on("mouseout", (d, i) => {
        d3.select("div")
        .style("visibility", "hidden");
    });
  };

  function addTextToTooltip(data) {
    d3.select("div")
      .html(`Name: ${data["Name"]} </br> Year: ${data["Year"]} </br> Time: ${data["Time"]} </br> Nationality: ${data["Nationality"]} </br> ${data["Doping"]}`);
  }