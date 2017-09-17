var margin = {top: 20, right: 20, bottom: 30, left: 40},
width = 960 - margin.left - margin.right,
height = 500 - margin.top - margin.bottom;

var formatPercent = d3.format("");

var x = d3.scale.ordinal()
.rangeRoundBands([0, width], .1, 1);

var y = d3.scale.linear()
.range([height, 0]);

var xAxis = d3.svg.axis()
.scale(x)
.orient("bottom");

var yAxis = d3.svg.axis()
.scale(y)
.orient("left")
.tickFormat(formatPercent);

var svg = d3.select("#svgGG")
.append("svg")
    .attr("class", "svgGraph")
    .attr("viewBox", "0 0 1300 500")
.append("g")
    .attr("transform", 
          "translate("+60+","+10+")");

d3.tsv("./rankings.tsv", function(error, data) {

data.forEach(function(d) {
d.total_votes = +d.total_votes;
});

x.domain(data.map(function(d) { return d.poster_id; }));
y.domain([0, d3.max(data, function(d) { return d.total_votes; })]);

svg.append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + height + ")")
  .call(xAxis);

svg.append("g")
  .attr("class", "y axis")
  .call(yAxis)
.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 6)
  .attr("dy", ".71em")
  .style("text-anchor", "end")
  .text("total_votes");

svg.selectAll(".bar")
  .data(data)
.enter().append("rect")
  .attr("class", "bar")
  .attr("x", function(d) { return x(d.poster_id); })
  .attr("width", x.rangeBand())
  .attr("y", function(d) { return y(d.total_votes); })
  .attr("height", function(d) { return height - y(d.total_votes); });

d3.select("input").on("change", change);

var sortTimeout = setTimeout(function() {
d3.select("input").property("checked", true).each(change);
}, 2000);

function change() {
clearTimeout(sortTimeout);

// Copy-on-write since tweens are evaluated after a delay.
var x0 = x.domain(data.sort(this.checked
    ? function(a, b) { return b.total_votes - a.total_votes; }
    : function(a, b) { return d3.ascending(a.poster_id, b.poster_id); })
    .map(function(d) { return d.poster_id; }))
    .copy();

svg.selectAll(".bar")
    .sort(function(a, b) { return x0(a.poster_id) - x0(b.poster_id); });

var transition = svg.transition().duration(750),
    delay = function(d, i) { return i * 50; };

transition.selectAll(".bar")
    .delay(delay)
    .attr("x", function(d) { return x0(d.poster_id); });

transition.select(".x.axis")
    .call(xAxis)
  .selectAll("g")
    .delay(delay);
}
});
