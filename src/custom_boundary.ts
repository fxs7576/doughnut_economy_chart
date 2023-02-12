
import * as d3 from "d3";

import { 
    BOUNDARY_GAP,
    mouseover,
    mouseleave,
    RADIUS_02,
    RADIUS_03,
    RADIUS_GAP,
    svg,
    tooltip
 } from "./config";

 interface IBoundary {
    _perspective: string;
    _data_raw: any;
    _boundary_fill: string;
    _font_fill: string;
    _font_size: number;
    _font_family: string;
    _letter_spacing: number;
}

export class Boundary {

    readonly perspective: string;
    readonly data_raw: any;
    readonly boundary_fill: string;
    readonly font_fill: string;
    readonly font_size: number;
    readonly font_family: string;
    readonly letter_spacing: number;

    private tooltip_offset_event_pageX!: number;
    private tooltip_translateX!: number;
    private tooltip_offset_event_pageY!: number;

    private data!: any;
    private text!: string;
    private description!: string;
    private inner_radius!: number;
    private outer_radius!: number;

    private mousemove!: (_event: MouseEvent, d: any) => void;
    private middle_radius!: number;
    private startAngle!: number;
    private endAngle!: number;
    private text_for_id!: string;
    private arc_shape!: d3.Arc<any, d3.DefaultArcObject>;
    private arc_text!: d3.Arc<any, d3.DefaultArcObject>;

    private g!: d3.Selection<SVGGElement, unknown, HTMLElement, any>;

    constructor ({
        _perspective,
        _data_raw,
        _boundary_fill,
        _font_fill,
        _font_size,
        _font_family,
        _letter_spacing
        }: IBoundary) {

            this.perspective = _perspective;
            this.data_raw = _data_raw;
            this.boundary_fill = _boundary_fill;
            this.font_fill = _font_fill;
            this.font_size = _font_size;
            this.font_family = _font_family;
            this.letter_spacing = _letter_spacing;
            this.init_vis();

        }


    init_vis() {

        const vis = this;

        vis.tooltip_offset_event_pageX =  0;
        vis.tooltip_translateX = -50;
        vis.tooltip_offset_event_pageY = -385;

        if (vis.perspective == "inside") {
            vis.data = vis.data_raw[0];
            vis.text = vis.data["name"];
            vis.description = vis.data["description"];
            vis.inner_radius = RADIUS_02 + RADIUS_GAP;
            vis.outer_radius = RADIUS_02 + RADIUS_GAP + BOUNDARY_GAP;
  
        } else if (vis.perspective == "middle") {
            vis.data = vis.data_raw[1];
            vis.text = vis.data["name"];
            vis.description = vis.data["description"];
            vis.inner_radius = RADIUS_02 + RADIUS_GAP + BOUNDARY_GAP;
            vis.outer_radius = RADIUS_03 - RADIUS_GAP - BOUNDARY_GAP;

        } else if (vis.perspective == "outside") {
            vis.data = vis.data_raw[2];
            vis.text = vis.data["name"];
            vis.description = vis.data["description"];
            vis.inner_radius = RADIUS_03 - RADIUS_GAP - BOUNDARY_GAP;
            vis.outer_radius = RADIUS_03 - RADIUS_GAP;

        };

        vis.mousemove = function(event: MouseEvent, _d: any) {
        tooltip
            .style("left", "50%")
            .style("transform", `translateX(${vis.tooltip_translateX}%)`)
            .style("top", (event.pageY + vis.tooltip_offset_event_pageY) + "px")
            .html(`${vis.description}`)
            ;
        };

        function remove_inner_arc(_path: string | null) {
            return _path!.replace(/(M.*A.*)(A.*Z)/, function(_, m1) {
                return m1 || _path;
            });
        }

        vis.middle_radius = (vis.inner_radius + vis.outer_radius) / 2;
        vis.startAngle = 90 * Math.PI/180;
        vis.endAngle = 90 * Math.PI/180 + 2 * Math.PI;
        
        vis.text = vis.text.trim().toLowerCase();
        vis.text_for_id = vis.text.replace(/\s+/g, '');

        vis.arc_shape = d3.arc()
            .innerRadius(vis.inner_radius)
            .outerRadius(vis.outer_radius)
            .startAngle(vis.startAngle)
            .endAngle(vis.endAngle);
    
        vis.arc_text = d3.arc()
            .innerRadius(vis.middle_radius)
            .outerRadius(vis.middle_radius)
            .startAngle(vis.startAngle)
            .endAngle(vis.endAngle);


        vis.g = svg.append("g")
            .attr("class", `boundary_${vis.perspective}`)
    
    
        vis.g
            .append("defs")
                .append("path")
                .attr("id", `arc_boundary_${vis.text_for_id}_text`)
                .attr("d", remove_inner_arc(vis.arc_text((<any>1))))
                ;

        vis.g
            .append("path")
            .attr("id", `arc_boundary_${vis.text_for_id}_shape`)
            .attr("d", vis.arc_shape((<any>1)))
            .attr("fill", vis.boundary_fill)
            .style("stroke", "yellow")
            .style("stroke-width", "1px")
    
            .on("mouseover", mouseover)
            .on("mousemove", vis.mousemove)
            .on("mouseleave", mouseleave)
            ;

        vis.g
            .append("clipPath")
            .attr("id", `arc_boundary_${vis.text_for_id}_text_clip`)
                .append("use")
                .attr("xlink:href", `#arc_boundary_${vis.text_for_id}_shape`);
        
        vis.g
            .append("text")
            .attr("dy", 4)
            .attr("clip-path", `url(#arc_boundary_${vis.text_for_id}_text_clip)`)
                .append("textPath")
                .attr("xlink:href", `#arc_boundary_${vis.text_for_id}_text`)
                
                .attr("startOffset", "50%")
                .style("text-anchor", "middle")
                .style("fill", vis.font_fill)
                .style("font-size", `${vis.font_size}px`)
                .style("font-family", vis.font_family)
                .style("letter-spacing", `${vis.letter_spacing}px`)
                .text(vis.text)
    
    }
}