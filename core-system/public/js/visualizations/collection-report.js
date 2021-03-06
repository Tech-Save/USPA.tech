function loadDataMainDashboard() {
  loadConversionFunnel();
  loadAudienceVenn();
  loadChannelPerformance();
}


function loadChannelPerformance() {
  var data = [
    {
      channelName: "Website",
      lead: 33
    },
    {
      channelName: "Loyalty App",
      lead: 12
    },
    {
      channelName: "YouTube",
      lead: 41
    },
    {
      channelName: "Google Search",
      lead: 16
    },
    {
      channelName: "Facebook",
      lead: 59
    }
  ];

  // set the dimensions and margins of the graph
  var margin = {
      top: 20,
      right: 20,
      bottom: 30,
      left: 100
    },
    width = 1200 - margin.left - margin.right,
    height = 350 - margin.top - margin.bottom;

  // set the ranges
  var y = d3
    .scaleBand()
    .range([height, 0])
    .padding(0.1);

  var x = d3.scaleLinear().range([0, width]);

  // append the svg object to the body of the page
  // append a 'group' element to 'svg'
  // moves the 'group' element to the top left margin
  var svg = d3
    .select("#chart svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // format the data
  data.forEach(function(d) {
    d.lead = +d.lead;
  });

  // Scale the range of the data in the domains
  x.domain([
    0,
    d3.max(data, function(d) {
      return d.lead;
    })
  ]);
  y.domain(
    data.map(function(d) {
      return d.channelName;
    })
  );
  //y.domain([0, d3.max(data, function(d) { return d.lead; })]);

  // append the rectangles for the bar chart
  svg
    .selectAll(".bar")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "bar")
    //.attr("x", function(d) { return x(d.lead); })
    .attr("width", function(d) {
      return x(d.lead);
    })
    .attr("y", function(d) {
      return y(d.channelName);
    })
    .attr("height", y.bandwidth());

  // add the x Axis
  svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  // add the y Axis
  svg.append("g").call(d3.axisLeft(y));
}

function loadConversionFunnel() {
  var data = [
    ["View", 21981, "#008080"],
    ["Reach", 7423, "#4AADC6"],
    ["Profile", 2319, "#702963"],
    ["Lead", 161, "#C46511"],
    ["Customer", 58, "#3f2ae2"]
  ];

  var options = {
    chart: {
      curve: {
        enabled: true,
        height: 24
      },
      height: 350
    },
    tooltip: {
      enabled: true
    },
    label: {
      fontSize: "18px"
    },
    events: {
      click: {
        block: function(data) {
          console.log(data.label.raw);
        }
      }
    }
  };

  var chart = new D3Funnel("#funnel");
  chart.draw(data, options);
}

function loadAudienceVenn() {
  var sets = [
    {
      sets: ["Email"],
      figure: 27.92,
      label: "Email",
      size: 27.92
    },
    {
      sets: ["Direct Traffic"],
      figure: 55.28,
      label: "Direct Traffic",
      size: 55.28
    },
    {
      sets: ["Search Engine"],
      figure: 7.62,
      label: "Search Engine",
      size: 7.62
    },
    {
      sets: ["Email", "Direct Traffic"],
      figure: 3.03,
      label: "Email and Direct Traffic",
      size: 3.03
    },
    {
      sets: ["Email", "Search Engine"],
      figure: 1.66,
      label: "Email and Search Engine",
      size: 1.66
    },
    {
      sets: ["Direct Traffic", "Search Engine"],
      figure: 2.4,
      label: "Direct Traffic and Search Engine",
      size: 2.4
    },
    {
      sets: ["Email", "Direct Traffic", "Search Engine"],
      figure: 1.08,
      label: "Email, Direct Traffic, and Search Engine",
      size: 1.08
    }
  ];

  var chart = venn
    .VennDiagram()
    .width(500)
    .height(400);

  var div2 = d3
    .select("#venn_two")
    .datum(sets)
    .call(chart);
  div2.selectAll("text").style("fill", "white");
  div2
    .selectAll(".venn-circle path")
    .style("fill-opacity", 0.8)
    .style("stroke-width", 1)
    .style("stroke-opacity", 1)
    .style("stroke", "fff");

  var tooltip = d3
    .select("body")
    .append("div")
    .attr("class", "venntooltip");

  div2
    .selectAll("g")
    .on("mouseover", function(d, i) {
      // sort all the areas relative to the current item
      venn.sortAreas(div2, d);

      // Display a tooltip with the current size
      tooltip
        .transition()
        .duration(40)
        .style("opacity", 1);
      tooltip.text(d.size + "% of Audience Two saw " + d.label);

      // highlight the current path
      var selection = d3
        .select(this)
        .transition("tooltip")
        .duration(400);
      selection
        .select("path")
        .style("stroke-width", 3)
        .style("fill-opacity", d.sets.length == 1 ? 0.8 : 0)
        .style("stroke-opacity", 1);
    })

    .on("mousemove", function() {
      tooltip
        .style("left", d3.event.pageX + "px")
        .style("top", d3.event.pageY - 28 + "px");
    })

    .on("mouseout", function(d, i) {
      tooltip
        .transition()
        .duration(2500)
        .style("opacity", 0);
      var selection = d3
        .select(this)
        .transition("tooltip")
        .duration(400);
      selection
        .select("path")
        .style("stroke-width", 3)
        .style("fill-opacity", d.sets.length == 1 ? 0.8 : 0)
        .style("stroke-opacity", 1);
    });
}
