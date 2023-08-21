const DisplayGraph = () => {
  const w = 800;
  const h = 400;
  const padding = 60;
  const legendWidth = 350;
  const legendHeight = 10;

  const temperatureColours = [
    {
      temp: 2,
      hex: "#deebf7",
    },
    {
      temp: 3.5,
      hex: "#9ecae1",
    },
    {
      temp: 5,
      hex: "#3182bd",
    },
    {
      temp: 6.5,
      hex: "#fee0d2",
    },
    {
      temp: 8,
      hex: "#fc9272",
    },
    {
      temp: 9.5,
      hex: "#de2d26",
    },
  ];

  document.addEventListener("DOMContentLoaded", () =>
    fetch(
      "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json"
    )
      .then((response) => response.json())
      .then((data) => {
        const description = d3
          .select(".graph")
          .append("heading")
          .append("h1")
          .attr("id", "description")
          .text(
            `${data.monthlyVariance[0].year} - ${
              data.monthlyVariance[data.monthlyVariance.length - 1].year
            } base temperature: ${data.baseTemperature}`
          );

        const svg = d3
          .select(".graph")
          .append("svg")
          .attr("width", w + 100)
          .attr("height", h + 50);

        var tooltip = d3
          .select(".graph")
          .append("div")
          .attr("id", "tooltip")
          .style("opacity", 0)
          .style("position", "absolute");

        let months = [
          ...new Set(data.monthlyVariance.map((entry) => entry.month)),
        ];
        let monthNames = [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ];

        const yScale = d3
          .scaleBand()
          .domain([...months])
          .range([0, h]);

        const yAxis = d3.axisLeft(yScale).tickFormat((d, i) => monthNames[i]);

        svg
          .append("g")
          .attr("transform", "translate(" + padding + ",0)")
          .attr("id", "y-axis")
          .call(yAxis);

        let years = [
          ...new Set(data.monthlyVariance.map((entry) => entry.year)),
        ];
        const xScale = d3
          .scaleBand()
          .domain([...years])
          .range([0, w]);

        const xAxis = d3.axisBottom(xScale).tickValues(
          xScale.domain().filter(function (year) {
            return year % 10 === 0;
          })
        );

        svg
          .append("g")
          .attr("transform", "translate(" + padding + "," + h + ")")
          .attr("id", "x-axis")
          .call(xAxis);

        const legendScale = d3
          .scaleBand()
          .domain(temperatureColours.map((colour) => colour.temp))
          .range([0, legendWidth]);

        const legendAxis = d3.axisBottom(legendScale);

        const legend = d3
          .select(".graph")
          .append("svg")
          .attr("id", "legend")
          .attr("width", legendWidth)
          .attr("height", 100);

        legend
          .append("g")
          .attr("transform", "translate(" + padding + "," + legendHeight + ")")
          .attr("id", "legend-axis")
          .call(legendAxis);

        legend
          .append("g")
          .selectAll("rect")
          .data(temperatureColours)
          .enter()
          .append("rect")
          .attr("transform", "translate(" + padding + "," + 0 + ")")
          .attr("width", legendWidth / temperatureColours.length)
          .attr("height", legendHeight)
          .attr("x", (d) => legendScale(d.temp))
          .attr("y", 0)
          .attr("fill", (d) => d.hex);

        svg
          .selectAll("rect")
          .data(data.monthlyVariance)
          .enter()
          .append("rect")
          .attr("transform", "translate(" + padding + "," + 0 + ")")
          .attr("class", "cell")
          .attr("data-month", (d) =>  {
            return d.month - 1;
          })
          .attr("data-year", (d) => {
            return d.year;
          })
          .attr("data-temp", (d) => {
            return data.baseTemperature + d.variance;
          })
          .attr("x", (d) => xScale(d.year))
          .attr("y", (d) => yScale(d.month))
          .attr("width", (d) => xScale.bandwidth(d.year))
          .attr("height", (d) => yScale.bandwidth(d.month))

          .attr("fill", (d) => {
            let hexadeximal = "";
            let temperature = d.variance + data.baseTemperature;

            temperatureColours.forEach((colour) => {
              if (temperature >= colour.temp) {
                hexadeximal = colour.hex;
              }
            });
            return hexadeximal;
          })

          .on("mouseover", function (event, d) {
            let coordinates = d3.pointer(event);
            let coordinateY = coordinates[0];
            let coordinateX = coordinates[1];
            tooltip.style("opacity", 0.6).attr("data-year", d.year);
            tooltip
              .text(
                `month: ${d.month}, year: ${d.year}, variance: ${d.variance}`
              )
              .style("left", coordinateY + "px")
              .style("top", coordinateX + "px");
          })
          .on("mouseout", function (event, d) {
            tooltip.style("opacity", 0.0);
          });
      })
  );
};
