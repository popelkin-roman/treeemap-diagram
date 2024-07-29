const dataurl = "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json"

const data = fetch(dataurl)
                .then((res) => res.json())
                .then(data => drawChart(data));

const drawChart = (data) => {
    console.log(data);
    const w = 1000;
    const h = 500;
    let tileColor = '';
    const color = d3.scaleOrdinal(data.children.map(d => d.name), d3.schemeTableau10);
    let tooltip;

    const root = d3.treemap()
    .tile(d3.treemapBinary)
    .size([w, h])
  (d3.hierarchy(data)
      .sum(d => d.value)
      .sort((a, b) => b.value - a.value));
    
    const svg = d3.select(".treemap")
      .append("svg")
      .attr("viewBox", [0, 0, w, h])
      .attr("width", w)
      .attr("height", h)
      .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif;");
    
    d3.select(".treemap")
      .append("div")
      .attr("id", "tooltip")
      .style("visibility", "hidden");

    const leaf = svg.selectAll("g")
    .data(root.leaves())
    .join("g")
      .attr("transform", d => `translate(${d.x0},${d.y0})`);

    leaf.append("rect")
      .attr("class", "tile")
      .attr("data-name", d => d.data.name)
      .attr("data-category", d => d.data.category)
      .attr("data-value", d => d.data.value)
      .attr("fill", d => { while (d.depth > 1) d = d.parent; return color(d.data.name); })
      .attr("width", d => d.x1 - d.x0)
      .attr("height", d => d.y1 - d.y0)
      .on("mouseover", (e, d) => {
            tileColor = e.target.style.fill;
            e.target.style.fill = "#aaa";
            let formattedValue = '';
            for (let i = 0; i < d.data.value.length; i++) {
              let currentChar = d.data.value[d.data.value.length - i - 1];
              if ( (i + 1) % 3 == 0 && !(i == d.data.value.length - 1) ) currentChar = " " + currentChar;
              formattedValue = currentChar + formattedValue;
            }

            tooltip = d3.select("#tooltip")
                .attr("data-name", d.data.name)
                .attr("data-category", d.data.category)
                .attr("data-value", d.data.value)
             
                // console.log(document.querySelector('#tooltip').getBoundingClientRect().bottom);
                
                
            tooltip.append("div")
                .text(d.data.name)
            tooltip.append("div")
                .text("$" + formattedValue);

            const tooltipHeight = document.querySelector('#tooltip').getBoundingClientRect().height;

            // tooltip
            //   .style("visibility", "visible")
            //   .style("transform", `translateX(${e.clientX}px) translateY(${e.clientY - tooltipHeight}px)`);
            // console.log(document.querySelector('#tooltip').getBoundingClientRect());
        })
        .on ("mousemove", (e) => {
          const tooltipBoundingRect = document.querySelector('#tooltip').getBoundingClientRect();
          const tooltipHeight = tooltipBoundingRect.height;
          const tooltipWidth = tooltipBoundingRect.width;
          const tooltipRight = tooltipBoundingRect.right;
          // console.log(tooltipBoundingRect.right);
          // console.log(window.innerWidth);

          const tooltipOffset = tooltipRight > window.innerWidth ? tooltipWidth : 0;

            tooltip
              .style("visibility", "visible")
              .style("transform", `translateX(${e.clientX - tooltipOffset}px) translateY(${e.clientY - tooltipHeight}px)`);
        })
        .on("mouseout", (e) => {
            e.target.style.fill = tileColor;
            d3.select("#tooltip")
                .style("visibility", "hidden")
                .text("");
            
        })
    
      leaf.append("text")
      .selectAll("tspan")
      .data(d => d.data.name.split(/(?=[A-Z][a-z])|\s+/g).concat())
      .join("tspan")
        .attr("x", 3)
        .attr("y", (d, i, nodes) => `${(i === nodes.length - 1) * 0.3 + 1.1 + i * 0.9}em`)
        .attr("fill-opacity", (d, i, nodes) => i === nodes.length - 1 ? 0.7 : null)
        .text(d => d);

    const legendContainer = d3.select(".legend")
      .append("svg")
      .attr("width", 250)
      .attr("height", 100)
      .append('g').attr('id', 'legend');

    const legend = legendContainer
          .selectAll('#legend')
          .data(color.domain())
          .enter()
          .append('g')
          .attr('class', 'legend-label')
          .attr('transform', function (d, i) {
            const rows = Math.ceil(color.domain().length / 2);
            const row = i < rows ? 0 : 1;
            return `translate(${row * 150}, ${(i - rows*row)*20})`;
          });
    
    legend
          .append('rect')
          .attr('width', 18)
          .attr('height', 18)
          .attr('class', 'legend-item')
          .style('fill', color);
    
    legend
          .append('text')
          .attr('dy', '14')
          .attr('dx', '20')
          .text(d => d);
}