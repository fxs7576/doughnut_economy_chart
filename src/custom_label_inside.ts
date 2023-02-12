
import * as d3 from "d3";

import {
    RADIUS_02,
    svg,
 } from "./config";

 interface ILabelInside {
    _data_raw: any;
    _font_fill: string;
    _font_size: number;
    _font_family: string;
    _letter_spacing: number;
 }

export class LabelInside {

    readonly data_raw: any;
    readonly font_fill: string;
    readonly font_size: number;
    readonly font_family: string;
    readonly letter_spacing: number;

    private padding!: number;

    private arc!: d3.Arc<any, d3.DefaultArcObject>;
    private pie!: d3.Pie<any, number | {
        valueOf(): number;
    }>;
    private g!: d3.Selection<SVGGElement, unknown, HTMLElement, any>;
    private data!: any;
    private x!: number;
    private y!: number;

    constructor ({
        _data_raw,
        _font_fill,
        _font_size,
        _font_family,
        _letter_spacing
        }: ILabelInside) {

        this.data_raw = _data_raw;
        this.font_fill = _font_fill;
        this.font_size = _font_size;
        this.font_family = _font_family;
        this.letter_spacing = _letter_spacing;
        this.init_vis();

    }

    init_vis() {

        const vis = this;

        vis.padding = 20;

        vis.arc = d3.arc()
            .innerRadius(RADIUS_02 - vis.padding)
            .outerRadius(RADIUS_02);

        vis.pie = d3.pie()
            .startAngle(0)
            .endAngle(2 * Math.PI)
            .value(function(_d) { return 3; })
            .padAngle(0.01)
            .sort(null);

        vis.g = svg.append("g")
            .attr("class", "label_inside")

        vis.wrangle_data();
    }

    wrangle_data() {

        const vis = this;

        vis.data = vis.data_raw[0]["data"][0]["metric"];

        vis.update_vis();
    }


    update_vis() {

        const vis = this;

        vis.g
            .selectAll(".arc_inside")
            .data(vis.pie(vis.data))
            .enter();
                
        vis.pie(vis.data)
            .forEach(function(d: any, _i: number) {
                [vis.x, vis.y] = vis.arc.centroid(d);
                let text = d.data.metric_name.trim().toLowerCase();
                let end_angle = d.endAngle;
                let rotation = end_angle <= Math.PI ? 
                    (d.startAngle / 2 + d.endAngle / 2) * 180 / Math.PI :
                    (d.startAngle / 2 + d.endAngle / 2 + Math.PI) * 180 / Math.PI;
                let text_anchor = end_angle <= Math.PI ? "end" : "start";
                let transform = "translate(" + [vis.x, vis.y] + ") rotate(-90) rotate(" + rotation + ")";

                vis.g
                    .append("text")
                    .attr("text-anchor", text_anchor)
                    .attr("transform", transform)
                    .style("z-index", "1")
                    .style("font-size", `${vis.font_size}px`)
                    .style("font-family", vis.font_family)
                    .style("fill", vis.font_fill)
                    .style("letter-spacing", `${vis.letter_spacing}px`)
                    .text(text);
            })
    }

}