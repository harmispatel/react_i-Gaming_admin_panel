// import React, { useEffect } from "react";

// const GanttChart = () => {
//   useEffect(() => {
//     const loadGoogleCharts = () => {
//       if (window.google && window.google.charts) {
//         window.google.charts.load("current", { packages: ["gantt"] });
//         window.google.charts.setOnLoadCallback(drawChart);
//       }
//     };

//     const drawChart = () => {
//       var data = new window.google.visualization.DataTable();
//       data.addColumn("string", "Task ID");
//       data.addColumn("string", "Task Name");
//       data.addColumn("string", "Resource");
//       data.addColumn("date", "Start Date");
//       data.addColumn("date", "End Date");
//       data.addColumn("number", "Duration");
//       data.addColumn("number", "Percent Complete");
//       data.addColumn("string", "Dependencies");

//       data.addRows([
//         [
//           "2014Spring",
//           "Spring 2014",
//           "spring",
//           new Date(2014, 2, 22),
//           new Date(2014, 5, 20),
//           null,
//           100,
//           null,
//         ],
//         [
//           "2014Summer",
//           "Summer 2014",
//           "summer",
//           new Date(2014, 5, 21),
//           new Date(2014, 8, 20),
//           null,
//           100,
//           null,
//         ],
//         [
//           "2014Autumn",
//           "Autumn 2014",
//           "autumn",
//           new Date(2014, 8, 21),
//           new Date(2014, 11, 20),
//           null,
//           100,
//           null,
//         ],
//         [
//           "2014Winter",
//           "Winter 2014",
//           "winter",
//           new Date(2014, 11, 21),
//           new Date(2015, 2, 21),
//           null,
//           100,
//           null,
//         ],
//         [
//           "2015Spring",
//           "Spring 2015",
//           "spring",
//           new Date(2015, 2, 22),
//           new Date(2015, 5, 20),
//           null,
//           50,
//           null,
//         ],
//         [
//           "2015Summer",
//           "Summer 2015",
//           "summer",
//           new Date(2015, 5, 21),
//           new Date(2015, 8, 20),
//           null,
//           0,
//           null,
//         ],
//         [
//           "2015Autumn",
//           "Autumn 2015",
//           "autumn",
//           new Date(2015, 8, 21),
//           new Date(2015, 11, 20),
//           null,
//           0,
//           null,
//         ],
//         [
//           "2015Winter",
//           "Winter 2015",
//           "winter",
//           new Date(2015, 11, 21),
//           new Date(2016, 2, 21),
//           null,
//           0,
//           null,
//         ],
//         [
//           "Football",
//           "Football Season",
//           "sports",
//           new Date(2014, 8, 4),
//           new Date(2015, 1, 1),
//           null,
//           100,
//           null,
//         ],
//         [
//           "Baseball",
//           "Baseball Season",
//           "sports",
//           new Date(2015, 2, 31),
//           new Date(2015, 9, 20),
//           null,
//           14,
//           null,
//         ],
//         [
//           "Basketball",
//           "Basketball Season",
//           "sports",
//           new Date(2014, 9, 28),
//           new Date(2015, 5, 20),
//           null,
//           86,
//           null,
//         ],
//         [
//           "Hockey",
//           "Hockey Season",
//           "sports",
//           new Date(2014, 9, 8),
//           new Date(2015, 5, 21),
//           null,
//           89,
//           null,
//         ],
//       ]);

//       var options = {
//         height: 400,
//         gantt: {
//           trackHeight: 30,
//         },
//       };

//       var chart = new window.google.visualization.Gantt(
//         document.getElementById("chart_div")
//       );
//       chart.draw(data, options);
//     };

//     if (window.google && window.google.charts) {
//       loadGoogleCharts();
//     } else {
//       const script = document.createElement("script");
//       script.src = "https://www.gstatic.com/charts/loader.js";
//       script.onload = loadGoogleCharts;
//       document.body.appendChild(script);
//     }
//   }, []);

//   return (
//     <>
//       <div className="tracker-details-head mb-5">
//         <h5 className="m-0">Game Section Changes</h5>
//       </div>
//       <div>
//         <div id="chart_div" style={{ width: "100%", height: "400px" }}></div>
//       </div>
//     </>
//   );
// };

// export default GanttChart;

import React, { useEffect } from "react";
import * as d3 from "d3";

const GanttChart = ({ trackingDetails }) => {
  useEffect(() => {
    const margin = { top: 20, right: 30, bottom: 30, left: 150 };
    const height = 300 - margin.top - margin.bottom;
    const defaultDuration = 1; // Default duration in days

    // Extract daywise data with a default duration
    const data = trackingDetails.daywise_data.map(d => {
      const startDate = new Date(d.created_date);
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + defaultDuration); // Set endDate with default duration
      return {
        task: d.section_name,
        startDate: startDate,
        endDate: endDate
      };
    });

    const containerWidth = document.getElementById('ganttChart').parentElement.offsetWidth;
    const width = containerWidth - margin.left - margin.right;

    const svg = d3
      .select("#ganttChart")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .select("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Update x scale to use the created_date
    const x = d3
      .scaleTime()
      .domain([
        d3.min(data, (d) => d.startDate),
        d3.max(data, (d) => d.endDate),
      ])
      .range([0, width]);

    const y = d3
      .scaleBand()
      .domain(data.map((d) => d.task))
      .range([0, height])
      .padding(0.1);

    svg.selectAll("rect").remove(); // Clear any previous rectangles

    svg
      .append("g")
      .selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (d) => x(d.startDate))
      .attr("y", (d) => y(d.task))
      .attr("width", (d) => x(d.endDate) - x(d.startDate))
      .attr("height", 20)
      .attr("fill", "steelblue");

    svg
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).ticks(d3.timeDay.every(1)));

    svg
      .append("g")
      .attr("class", "y-axis")
      .call(d3.axisLeft(y));
  }, [trackingDetails]);

  return <svg id="ganttChart"></svg>;
};

export default GanttChart;
