

import * as d3 from "d3";

import {
    RADIUS_02,
    RADIUS_03,
    RADIUS_GAP,
    svg
 } from "./config";

interface ILabelOutside {
    _data_raw: any;
    _font_fill: string;
    _font_size: number;
    _font_family: string;
    _letter_spacing: number;
 }

export class LabelOutside {

    readonly data_raw: any;
    readonly font_fill: string;
    readonly font_size: number;
    readonly font_family: string;
    readonly letter_spacing: number;

    private arc!: d3.Arc<any, d3.DefaultArcObject>;
    private pie!: d3.Pie<any, number | {
        valueOf(): number;
    }>;
    private data!: any;
    private g!: d3.Selection<SVGGElement, unknown, HTMLElement, any>;

    private reviseArc!: (d: any, i: number) => void;
    private firstArcSection!: RegExp;
    private thisSection!: string;
    private newArc!: string;
    private locStart!: RegExp;
    private locMiddle!: RegExp;
    private locEnd!: RegExp;
    private newStart!: string;
    private newEnd!: string;
    private middleSec!: string;


    constructor ({
        _data_raw,
        _font_fill,
        _font_size,
        _font_family,
        _letter_spacing
        }: ILabelOutside) {
        
        this.data_raw = _data_raw;
        this.font_fill = _font_fill;
        this.font_size = _font_size;
        this.font_family = _font_family;
        this.letter_spacing = _letter_spacing;
        this.init_vis();

    }

    init_vis() {

        const vis = this;

        vis.arc = d3.arc()
            .innerRadius(RADIUS_02 + RADIUS_GAP)
            .outerRadius(RADIUS_03 - RADIUS_GAP);

        vis.pie = d3.pie()
            .startAngle(0)
            .endAngle(2 * Math.PI)
            .value(function(_d) { return 3; })
            .padAngle(0.01)
            .sort(null);

        vis.g = svg.append("g")
            .attr("class", "label_outside")

        vis.wrangle_data();
    }


    wrangle_data() {

        const vis = this;
        vis.data = vis.data_raw[2]["data"][0]["metric"];
        

        vis.update_vis();
    }


    update_vis() {

        const vis = this;

        vis.reviseArc = function(d: any, i: number) {

            vis.firstArcSection = /(^.+?)L/;
            vis.thisSection = d3.select(<any>this).attr("d");
        
            vis.newArc = vis.firstArcSection.exec(vis.thisSection)![1];
            vis.newArc = vis.newArc.replace(/,/g, " ");

            if (d.endAngle > (0.75 * Math.PI) && d.endAngle < (1.5 * Math.PI)) {

                vis.locStart = /M(.*?)A/;
                vis.locMiddle = /A(.*?)0 0 1/;
                vis.locEnd = /0 0 1 (.*?)$/;

                vis.newStart = vis.locEnd.exec(vis.newArc)![1];
                vis.newEnd = vis.locStart.exec(vis.newArc)![1];
                vis.middleSec = vis.locMiddle.exec(vis.newArc)![1];

                vis.newArc = "M" + vis.newStart + "A" + vis.middleSec + "0 0 0 " + vis.newEnd;
            }

            vis.g.append("path")
                .attr("class", "hiddenDonutArcs")
                .attr("id", "donutArc" + i)
                .attr("d", vis.newArc)
                .style("fill", "none");
        };


        vis.g.selectAll(".donutArcSlices")
            .data(vis.pie(vis.data))
            .enter()
                .append("path")
                .attr("class", "donutArcSlices")
                .attr("d", (<any>vis.arc))
                .attr("fill", "none")
                .each(vis.reviseArc);


        vis.g.selectAll(".donutText")
            .data(vis.pie(vis.data))
            .enter()
                .append("text")
                .attr("class", "donutText")
                .style("fill", "black")
                .attr("dy", function(d: any, _i: number) {
                    return d.endAngle > (0.75 * Math.PI) && d.endAngle < (1.5 * Math.PI) ? 25 : -18;
                })
                .append("textPath")
                .attr("startOffset", "50%")
                .style("z-index", "1")
                .style("text-anchor", "middle")
                .attr("xlink:href", function(_d: any, i: number) { return "#donutArc" + i; })
                .style("font-size", `${vis.font_size}px`)
                .style("font-family", vis.font_family)
                .style("fill", vis.font_fill)
                .style("letter-spacing", `${vis.letter_spacing}px`)
                .text(function(d: any) { return d.data.metric_name.toLowerCase(); })

    }

}