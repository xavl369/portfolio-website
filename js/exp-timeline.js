(function () {
  "use strict";

  var jobs = [
    { company: "PhoenixCare",       start: new Date(2026,2,1),  end: new Date(),           active: true  },
    { company: "Excelia",           start: new Date(2024,3,1),  end: new Date(2026,3,1),   active: false },
    { company: "Trialshub",         start: new Date(2024,1,1),  end: new Date(2025,4,1),   active: false },
    { company: "Pinnacle · Genety", start: new Date(2023,1,1),  end: new Date(2024,1,1),   active: false },
    { company: "Pinnacle · Campus", start: new Date(2020,10,1), end: new Date(2023,1,1),   active: false },
    { company: "Intersel",          start: new Date(2019,10,1), end: new Date(2020,10,1),  active: false },
    { company: "Qualisys",          start: new Date(2018,1,1),  end: new Date(2019,10,1),  active: false },
    { company: "EDI Service",       start: new Date(2016,5,1),  end: new Date(2018,1,1),   active: false },
    { company: "NPC Group",         start: new Date(2015,3,1),  end: new Date(2016,5,1),   active: false },
    { company: "IENova",            start: new Date(2014,9,1),  end: new Date(2015,3,1),   active: false },
  ];

  var ACCENT       = "#58a6ff";
  var MUTED        = "#21262d";
  var MUTED_BORDER = "#30363d";
  var TEXT         = "#e6edf3";
  var TEXT_DIM     = "#8b949e";
  var GRID_LINE    = "#21262d";

  function durationLabel(start, end) {
    var months = Math.round((end - start) / (1000 * 60 * 60 * 24 * 30.44));
    var y = Math.floor(months / 12);
    var m = months % 12;
    return y > 0 ? (y + "y" + (m > 0 ? " " + m + "m" : "")) : (months + "m");
  }

  function drawChart() {
    var container = document.getElementById("exp-chart");
    if (!container) return;

    d3.select("#exp-chart").selectAll("*").remove();

    var margin = { top: 8, right: 16, bottom: 32, left: 136 };
    var totalW  = container.clientWidth || 600;
    var width   = totalW - margin.left - margin.right;
    var rowH    = 24;
    var rowGap  = 5;
    var chartH  = jobs.length * (rowH + rowGap);
    var totalH  = chartH + margin.top + margin.bottom;

    container.style.marginBottom = "2rem";

    var svg = d3.select("#exp-chart")
      .append("svg")
        .attr("width",  totalW)
        .attr("height", totalH)
        .style("font-family", "'Poppins', sans-serif")
        .style("overflow", "visible")
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var xMax = new Date();
    xMax.setMonth(xMax.getMonth() + 2);

    var xScale = d3.scaleTime()
      .domain([new Date(2014, 6, 1), xMax])
      .range([0, width]);

    svg.append("g")
      .attr("transform", "translate(0," + chartH + ")")
      .call(
        d3.axisBottom(xScale)
          .ticks(d3.timeYear.every(2))
          .tickFormat(d3.timeFormat("%Y"))
          .tickSize(-chartH)
      )
      .call(function (g) {
        g.select(".domain").remove();
        g.selectAll(".tick line")
          .attr("stroke", GRID_LINE)
          .attr("stroke-dasharray", "3,3");
        g.selectAll(".tick text")
          .attr("fill", TEXT_DIM)
          .attr("font-size", "10px");
      });

    var tooltip = d3.select("body").select("#exp-tooltip");
    if (tooltip.empty()) {
      tooltip = d3.select("body").append("div").attr("id", "exp-tooltip");
    }
    tooltip
      .style("position",       "absolute")
      .style("background",     "#161b22")
      .style("border",         "1px solid #30363d")
      .style("border-radius",  "6px")
      .style("padding",        "8px 12px")
      .style("font-size",      "12px")
      .style("color",          TEXT)
      .style("pointer-events", "none")
      .style("display",        "none")
      .style("z-index",        "9999")
      .style("line-height",    "1.6");

    jobs.forEach(function (job, i) {
      var y   = i * (rowH + rowGap);
      var x1  = xScale(job.start);
      var x2  = xScale(job.end);
      var bw  = Math.max(x2 - x1, 3);
      var dur = durationLabel(job.start, job.end);

      var grp = svg.append("g").style("cursor", "default");

      grp.append("rect")
        .attr("x", x1 - 1).attr("y", y - 1)
        .attr("width", bw + 2).attr("height", rowH + 2)
        .attr("rx", 4).attr("ry", 4)
        .attr("fill", job.active ? ACCENT : MUTED_BORDER)
        .attr("opacity", 0.3);

      grp.append("rect")
        .attr("x", x1).attr("y", y)
        .attr("width", bw).attr("height", rowH)
        .attr("rx", 3).attr("ry", 3)
        .attr("fill", job.active ? ACCENT : MUTED)
        .attr("opacity", job.active ? 0.9 : 0.85);

      if (bw > 30) {
        grp.append("text")
          .attr("x", x1 + bw / 2)
          .attr("y", y + rowH / 2)
          .attr("dy", "0.35em")
          .attr("text-anchor", "middle")
          .attr("fill", job.active ? "#fff" : TEXT_DIM)
          .attr("font-size", "9px")
          .attr("pointer-events", "none")
          .text(dur);
      }

      svg.append("text")
        .attr("x", -8)
        .attr("y", y + rowH / 2)
        .attr("dy", "0.35em")
        .attr("text-anchor", "end")
        .attr("fill", job.active ? ACCENT : TEXT_DIM)
        .attr("font-size", "11px")
        .text(job.company);

      var fmt = d3.timeFormat("%b %Y");
      grp
        .on("mouseover", function (event) {
          tooltip
            .style("display", "block")
            .style("left", (event.pageX + 14) + "px")
            .style("top",  (event.pageY - 40) + "px")
            .html(
              "<strong style='color:" + (job.active ? ACCENT : TEXT) + "'>" + job.company + "</strong><br>" +
              fmt(job.start) + " – " + (job.active ? "Present" : fmt(job.end)) + "<br>" +
              "<span style='color:" + TEXT_DIM + "'>" + dur + "</span>"
            );
        })
        .on("mousemove", function (event) {
          tooltip
            .style("left", (event.pageX + 14) + "px")
            .style("top",  (event.pageY - 40) + "px");
        })
        .on("mouseout", function () {
          tooltip.style("display", "none");
        });
    });
  }

  $(document).ready(function () {
    drawChart();
    var t;
    $(window).on("resize", function () {
      clearTimeout(t);
      t = setTimeout(drawChart, 200);
    });
  });
}());
