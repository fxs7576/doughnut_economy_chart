
import * as d3 from "d3";


export const country_id_selected: string = "ALB";
export const url: string = "data/data.json";
export const t_duration: number = 1000;
const t_duration_tooltip_mouseover: number = 300;
const t_duration_tooltip_mouseout: number = 100;

export const MARGIN: {
  TOP: number;
  RIGHT: number;
  BOTTOM: number;
  LEFT: number;
} = {TOP: 0, RIGHT: 0, BOTTOM: 0, LEFT: 0};
export const WIDTH: number = 720 - MARGIN.LEFT - MARGIN.RIGHT;
export const HEIGHT: number = 720 - MARGIN.TOP - MARGIN.BOTTOM;
export const RADIUS_02: number = 180;
export const RADIUS_03: number = RADIUS_02 + 100;
export const RADIUS_05: number = Math.min(WIDTH, HEIGHT) / 2; // the RADIUS_05 goes from the middle of the SVG area to the border
export const RADIUS_GAP: number = 2;
export const BOUNDARY_GAP: number = 20;


export const svg: d3.Selection<SVGGElement, unknown, HTMLElement, any> = d3.select("#chart-area")
  .append("svg")
    .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
    .attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)
  .append("g")
    .attr("transform", `translate(${WIDTH / 2 + MARGIN.LEFT}, ${HEIGHT / 2 + MARGIN.TOP})`)
    ;




export const tooltip: d3.Selection<HTMLDivElement, unknown, HTMLElement, any> = d3.select("#chart-area")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0)
  .style("background-color", "white")
  .style("border", "solid")
  .style("border-width", "2px")
  .style("border-radius", "5px")
  .style("padding", "5px")
  .style("width", "300px")
  .style("position", "absolute")
  ;


export let mouseover: (_event: MouseEvent, _d: any) => void = (_event: MouseEvent, _d: any) => {
    tooltip.transition()
        .duration(t_duration_tooltip_mouseover)
        .style("display", null)
        .style("opacity", .9)
        .style("font", "12px sans-serif")
        ;
    
    d3.select(<any>_event.currentTarget)
        .style("stroke-width", "3px")
  };

export let mouseleave: (_event: MouseEvent, _d: any) => void = (_event: MouseEvent, _d: any) => {
    tooltip.transition()
        .duration(t_duration_tooltip_mouseout)
        .style("display", "none")
    d3.select(<any>_event.currentTarget)
        .style("stroke-width", "1px")
};

