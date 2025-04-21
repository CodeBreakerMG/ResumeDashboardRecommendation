import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import cloud from "d3-cloud";

const SkillWordCloud = ({ job, jobs, width = 600, height = 400 }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!job || jobs.length === 0) return;

    const skillCounts = {};
    jobs.forEach(j =>
      j.skills?.forEach(skill => {
        skillCounts[skill] = (skillCounts[skill] || 0) + 1;
      })
    );

    const selectedSkills = new Set(job?.skills || []);
    const maxCount = d3.max(Object.values(skillCounts));

    const words = Object.entries(skillCounts).map(([text, value]) => ({
      text,
      value,
      isSelected: selectedSkills.has(text),
    }));

    const fontScale = d3.scaleLinear()
      .domain([1, maxCount])
      .range([12, 60]);

    const layout = cloud()
      .size([width, height])
      .words(words.map(d => ({
        ...d,
        size: fontScale(d.value),
      })))
      .padding(5)
      .rotate(() => (Math.random() > 0.7 ? 90 : 0)) // Random vertical or horizontal
      .font("Impact")
      .fontSize(d => d.size)
      .on("end", draw);

    layout.start();

    function draw(words) {
      const svg = d3
        .select(svgRef.current)
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("preserveAspectRatio", "xMidYMid meet")
        .html("");

      const color = d3.scaleOrdinal(d3.schemeCategory10);

      svg
        .append("g")
        .attr("transform", `translate(${width / 2},${height / 2})`)
        .selectAll("text")
        .data(words)
        .join("text")
        .style("font-family", "Helvetica")
        .style("font-size", d => `${d.size}px`)
        .style("font-weight", d => (d.isSelected ? "bold" : "normal"))
        .style("fill", d => (d.isSelected ? "#005DAB" : color(d.text)))
        .attr("text-anchor", "middle")
        .attr("transform", d => `translate(${d.x},${d.y}) rotate(${d.rotate})`)
        .text(d => d.text)
        .append("title") // Tooltip
        .text(d => `${d.text}: ${d.value} occurrences`);
    }
  }, [job, jobs, width, height]);

  return (
    <svg
      ref={svgRef}
      style={{ width: "100%", height: "100%", display: "block" }}
    />
  );
};

export default SkillWordCloud;
