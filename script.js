const dataurl = "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json"

const data = fetch(dataurl)
                .then((res) => res.json())
                .then(data => drawChart(data));

const drawChart = (data) => {
    console.log(data);
    const w = 1000;
    const h = 500;
    const padding = 50;

    const color = d3.scaleOrdinal(data.children.map(d => d.name), d3.schemeTableau10);

    const root = d3.treemap()
    .tile(d3.treemapBinary)
    .size([w, h])
    .padding(1)
    .round(true)
  (d3.hierarchy(data)
      .sum(d => d.value)
      .sort((a, b) => b.value - a.value));
    
    const svg = d3.select(".treemap")
      .append("svg")
      .attr("viewBox", [0, 0, w, h])
      .attr("width", w)
      .attr("height", h)
      .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif;");

    const leaf = svg.selectAll("g")
    .data(root.leaves())
    .join("g")
      .attr("transform", d => `translate(${d.x0},${d.y0})`);

    const format = d3.format(",d");
    leaf.append("title")
        .text(d => `${d.ancestors().reverse().map(d => d.data.name).join(".")}\n${format(d.value)}`);

    leaf.append("rect")
      // .attr("id", d => (d.leafUid = DOM.uid("leaf")).id)
      .attr("fill", d => { while (d.depth > 1) d = d.parent; return color(d.data.name); })
      .attr("fill-opacity", 0.6)
      .attr("width", d => d.x1 - d.x0)
      .attr("height", d => d.y1 - d.y0);
    // const color = d3.scaleOrdinal(d3.schemeDark2);
    // const minYear = new Date(0).setFullYear(d3.min(data, d => d.Year - 1));
    // const maxYear = new Date(0).setFullYear(d3.max(data, d => d.Year + 1));
    // const minTime = new Date("2000-01-01T00:"+ d3.min(data, d => d.Time));
    // const maxTime = new Date("2000-01-01T00:" + d3.max(data, d => d.Time));

    // const scaleYear = d3.scaleTime()
    //     .domain([minYear, maxYear])
    //     .range([padding, w - padding]);
    // const scaleTime = d3.scaleTime()
    //     .domain([minTime, maxTime])
    //     .range([padding, h - padding]);
        
    // svg.selectAll("circle")
    //     .data(data)
    //     .enter()
    //     .append("circle")
    //     .attr("cx", (d) => scaleYear(new Date(0).setFullYear(d.Year)) )
    //     .attr("cy", (d) => scaleTime(new Date("2000-01-01T00:" + d.Time)))
    //     .attr("r", 5)
    //     .attr("class", "dot")
    //     .attr("data-xvalue", d => d.Year)
    //     .attr("data-yvalue", d => new Date("2000-01-01T00:" + d.Time))
    //     .style("fill", d=> color(d.Doping !== ''))
    //     .on("mouseover", (e, d) => {
    //         e.target.style.fill = "#aaa";
    //         const tooltip = d3.select("#tooltip")
    //             .attr("data-year", d.Year)
    //             .attr("data-time", d.Time)
    //             .style("visibility", "visible")
    //             .style("transform", `translateX(${e.clientX}px) translateY(${e.clientY}px)`)
    //         tooltip.append("div")
    //             .text(d.Year)
    //         tooltip.append("div")
    //             .text(d.Time)
    //     })
    //     .on("mouseout", (e,d) => {
    //         e.target.style.fill = color(d.Doping !== '');
    //         d3.select("#tooltip")
    //             .style("visibility", "hidden")
    //             .text("");
            
    //     })
    
    // const xAxis = d3.axisBottom(scaleYear);
    // const yAxis = d3.axisLeft(scaleTime)
    //     .tickFormat(d3.timeFormat("%M:%S"));
    // const xAxisLine = svg.append("g")
    //     .attr("id", "x-axis")
    //     .attr("transform", `translate(${0}, ${h - padding})`)
    //     .call(xAxis);

    // const yAxisLine = svg.append("g")
    //     .attr("id", "y-axis")
    //     .attr("transform", `translate(${padding}, ${0})`)
    //     .call(yAxis);
    
    // const legendContainer = svg.append('g').attr('id', 'legend');

    // const legend = legendContainer
    //       .selectAll('#legend')
    //       .data(color.domain())
    //       .enter()
    //       .append('g')
    //       .attr('class', 'legend-label')
    //       .attr('transform', function (d, i) {
    //         return 'translate(0,' + (h / 2 - i * 20) + ')';
    //       });
    
    //     legend
    //       .append('rect')
    //       .attr('x', w - 18)
    //       .attr('width', 18)
    //       .attr('height', 18)
    //       .style('fill', color);
    
    //     legend
    //       .append('text')
    //       .attr('x', w - 24)
    //       .attr('y', 9)
    //       .attr('dy', '.35em')
    //       .style('text-anchor', 'end')
    //       .text(function (d) {
    //         if (d) {
    //           return 'Riders with doping allegations';
    //         } else {
    //           return 'No doping allegations';
    //         }
    //       });

    // d3.select(".scatterplot")
    //     .append("div")
    //     .attr("id", "tooltip")
    //     .style("visibility", "hidden");
}