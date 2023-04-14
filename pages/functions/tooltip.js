const {d3} = require ('d3');
// Exported as function -> if waterfall chart is refactored into observable, can easily wrap Plot.plot() with this function to activate tooltips
// NOTE - When observable native tooltip functionality is added, remove this and use the native functionality instead.   

export default function tooltips (chart) {  

    // selects the whole chart
    const wrap = d3.select(chart);
    // creates a tooltip element, assigns it a hover class, joins it to a group of hover
    const tooltip = wrap
      .selectAll(".hover")
      .data([1])
      .join("g")
      .attr("class", "hover")

    wrap.selectAll("title").each(function () {
      // Takes text from title attr, sets it as an attr on parent node if it exists, then cleans up by removing it.
      const title = d3.select(this);
      const parentNode = d3.select(this.parentNode);

      if (title.text()) {
        parentNode.attr("titletext", title.text()).classed("has-title", true);
        title.remove();
      }
      // Governs pointer movement behavior interaction w parent node of title
      parentNode
        .on("pointerenter pointermove", function (event) {
          const text = d3.select(this).attr("titletext");
          const pointer = d3.pointer(event, wrap.node());
          if (text) tooltip.call(hover, pointer, text.split("\n"));
          else tooltip.selectAll("*").remove();
  
          // Raise it
          d3.select(this).raise();
          // Disappears under toolbar without this

          // Checks position of the tip's x & y, translates box position if it would be outside the div
          const tipSize = tooltip.node().getBBox();
          // Left side logic
          if (pointer[0] + tipSize.x < 0)
            tooltip.attr(
              "transform",
              `translate(${tipSize.width / 2}, ${pointer[1] + 7})`
            ); // Right side logic
          else if (pointer[0] + tipSize.width / 2 > wrap.attr("width"))
            tooltip.attr(
              "transform",
              `translate(${wrap.attr("width") - tipSize.width / 2}, ${
                pointer[1] + 7
              })`
            );
        })
        .on("pointerout", function (event) {
          tooltip.selectAll("*").remove();
        });
    });

    // Hover function
      const hover = (tooltip, pos, text) => {
        const side_padding = 5;
        const vertical_padding = 5;
        const vertical_offset = 17;
        
        // Removes hover element as it moves - endleslly expands without this
        tooltip.selectAll("*").remove();
        
        // Creates text based on position
        tooltip
          .style("text-anchor", "middle")
          .attr("transform", `translate(${pos[0]}, ${pos[1] + 7})`)
          .selectAll("text")
          .data(text)
          .join("text")
          .style("dominant-baseline", "ideographic")
          .text((d) => d)
          .attr("y", (d, i) => (i - (text.length - 1)) * 15 - vertical_offset)
          .style("font-weight", (d, i) => (i === 0 ? "bold" : "normal"));
        
        // Grabs the size of the box created by the text

        const bbox = tooltip.node().getBBox();
        
        // Governs tooltip rear -> currently creates a rectangle based on side & vertical positions
        // .style determines background, stroke determines text color
        // FUTURE ADDITION: option to change styles to preferences? 
        tooltip
          .append("rect")
          .attr("x", bbox.x - side_padding)
          .attr("y", bbox.y - vertical_padding)
          .attr("width", bbox.width + side_padding * 2)
          .attr("height", bbox.height + vertical_padding * 2)
          .style("fill", "white")
          .lower(); // Moves the rectangle below the text - DO NOT REMOVE
      }  

    return chart;
}