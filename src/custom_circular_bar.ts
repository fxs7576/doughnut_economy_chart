

import * as d3 from "d3";

import { 
    HEIGHT,
    MARGIN,
    mouseover,
    mouseleave,
    RADIUS_02,
    RADIUS_03,
    RADIUS_05,
    svg,
    tooltip,
    t_duration,
    WIDTH
 } from "./config";

interface ICircularBar {
    _perspective: string;
    _data_raw: any;
    _data_inside_array: string[];
}

export class CircularBar {

    readonly perspective: string;
    readonly data_raw: any;
    readonly data_inside_array: string[];

    private tooltip_offset_event_pageX!: number;
    private tooltip_translateX!: number;
    private tooltip_offset_event_pageY!: number;

    private radius_inner!: number;
    private radius_outer!: number;
    private radius_gradient!: number;
    private color_bar_0!: string;
    private color_bar_100!: string;
    private offset_0!: number;
    private color_stroke!: string;
    private domain_y_min!: number;
    private domain_y_max!: number;

    private x_scale!: d3.ScaleBand<string>;
    private y_scale!: d3.ScaleRadial<number, number, never>;
    private arc!: d3.Arc<any, d3.DefaultArcObject>;
    private pie!: d3.Pie<any, number | {
        valueOf(): number;
    }>;
    private g!: d3.Selection<SVGGElement, unknown, HTMLElement, any>;
    private defs!: d3.Selection<SVGGElement, unknown, HTMLElement, any>;
    private radial_gradient!: d3.Selection<SVGRadialGradientElement, unknown, HTMLElement, any>;

    private selected_option!: string | number | string[] | undefined;
    private selected_option_text!: string;
    private country_id_index!: number;

    private data!: any;
    private mousemove!: (_event: MouseEvent, d: any) => void;
    private transition_duration!: d3.Transition<d3.BaseType, unknown, null, undefined>;
    private bar!: any;

    private arc_tween!: (d_: any) => (t_: any) => string | null;
    private _current!: number;


    constructor ({_perspective, _data_raw, _data_inside_array}: ICircularBar) {

        this.perspective = _perspective;
        this.data_raw = _data_raw;
        this.data_inside_array = _data_inside_array;
        this.init_vis();

    }


    init_vis() {


        const vis = this;

        vis.tooltip_offset_event_pageX = 0;
        vis.tooltip_translateX = -50;
        vis.tooltip_offset_event_pageY = -385;

        if (vis.perspective == "inside") {

            vis.radius_inner = RADIUS_02;
            vis.radius_outer = 0;
            vis.radius_gradient = vis.radius_inner;
            vis.color_bar_0 = "#FAA0A0";
            vis.color_bar_100 = "white";
            vis.offset_0 = 80;
            vis.color_stroke = "#FA8072";
            vis.domain_y_min = 5;
            vis.domain_y_max = 100;

        } else if (vis.perspective == "outside") {

            vis.radius_inner = RADIUS_03;
            vis.radius_outer = RADIUS_05;
            vis.radius_gradient = vis.radius_outer;
            vis.color_bar_0 = "white";
            vis.color_bar_100 = "#FAA0A0";
            vis.offset_0 = 70;
            vis.color_stroke = "#FA8072";
            vis.domain_y_min = 0.25;
            vis.domain_y_max = 4;

        }

  
        vis.x_scale = d3.scaleBand()
            .range([0, 2 * Math.PI])
            .align(0)


        vis.y_scale = d3.scaleRadial()
            .range([vis.radius_inner, vis.radius_outer])
            .domain([0, vis.domain_y_max]);
        
        vis.arc = d3.arc()
            .innerRadius(vis.radius_inner)
            .padRadius(vis.radius_inner);

        vis.pie = d3.pie()
            .padAngle(0.01)
            .sort(null);

        vis.g = svg.append("g")
            .attr("class", `bar_${vis.perspective}`)
            

        vis.defs = vis.g.append("svg:defs")
        vis.radial_gradient = vis.defs.append("radialGradient")
            .attr("gradientUnits", "userSpaceOnUse")
            .attr("cx", '50%')
            .attr("cy", '50%')
            .attr("r", vis.radius_gradient)
            .attr('gradientTransform', `translate(-${WIDTH / 2}, -${HEIGHT / 2 + (3 * MARGIN.TOP)})`)
            .attr("id", `bar_${vis.perspective}_id`);
        vis.radial_gradient.append("stop").attr("offset", `${vis.offset_0}%`).style("stop-color", vis.color_bar_0);
        vis.radial_gradient.append("stop").attr("offset", "100%").style("stop-color", vis.color_bar_100);

        vis.wrangle_data();

    }


    wrangle_data() {
        const vis = this;

 
        vis.selected_option = $("#country-dropdown").val();
        vis.selected_option_text = $("#country-dropdown option:selected").text();
        vis.country_id_index = vis.data_inside_array.indexOf(<string>vis.selected_option);

        if (vis.perspective == "inside") {
            vis.data = vis.data_raw[0]["data"][vis.country_id_index]["metric"];

            vis.mousemove = function(_event: MouseEvent, d: any) {
                tooltip
                    .style("left", "50%")
                    .style("transform", `translateX(${vis.tooltip_translateX}%)`)
                    .style("top", (_event.pageY + vis.tooltip_offset_event_pageY) + "px")
                    .html(`
                        <strong>${d.data.metric_category} - ${d.data.metric_name}</strong>
                        <br><i><sub>${vis.selected_option_text}</sub></i>

                        <br><br>${d.data.metric_description}
                        <br><br>Display value: <b>${user_friendly_number(d.data.metric_value_display)}%</b>

                        <br><br><u>Source</u>
                        <br>Actual value: ${user_friendly_number(d.data.metric_value_current)}
                        <br>Year: ${d.data.metric_year}
                        <br>Credit: ${d.data.metric_source}
                        <br>Metric ID: ${d.data.metric_id}
                    `)
                        
                    ;
            };

            
        } else if (vis.perspective == "outside") {
            vis.data = vis.data_raw[2]["data"][vis.country_id_index]["metric"];

            vis.mousemove = function(_event: MouseEvent, d: any) {

                tooltip
                    .style("left", "50%")
                    .style("transform", `translateX(${vis.tooltip_translateX}%)`)
                    .style("top", (_event.pageY + vis.tooltip_offset_event_pageY) + "px")
                    .html(`
                        <strong>${d.data.metric_name}</strong>
                        <br><i><sub>${vis.selected_option_text}</sub></i>

                        <br><br>${d.data.metric_description}
                        <br><br>Normalized value (value of 1 represents the boundary): <b>${user_friendly_number(d.data.metric_value_display)}</b> (ideal is <1)
                        
                        <br><br><u>Source</u>
                        <br>Year: ${d.data.metric_year}
                        <br>Credit: ${d.data.metric_source}
                        <br>Metric ID: ${d.data.metric_id}
                    `)
                    ;
            };
        };

        vis.x_scale
            .domain(vis.data.map((d: any) => d.metric_name));

        
        vis.update_vis();
    }


    update_vis() {

        const vis = this;
        vis.transition_duration = d3.transition().duration(t_duration);

        vis.bar = vis.g
            .selectAll(`path.bar_${vis.perspective}_path`)
            .data(vis.pie(vis.data))

        vis.bar
            .enter()
                .append("path")
                .attr("class", `bar_${vis.perspective}_path`)
                .attr(
                    "d", vis.arc
                    .startAngle((d: any) => (<number>vis.x_scale(d.data.metric_name)))
                    .endAngle((d: any) => (<number>vis.x_scale(d.data.metric_name)) + vis.x_scale.bandwidth())
                    .outerRadius(function(d: any) {
                        let data_y = d.data.metric_value_display;
                        if (d.data.metric_value_display > vis.domain_y_max) {
                            data_y = vis.domain_y_max;
                        } else if (d.data.metric_value_display === null) {
                            data_y = 0;
                        } else if (d.data.metric_value_display <= vis.domain_y_min) {
                            data_y = vis.domain_y_min;
                        }
                        return vis.y_scale(data_y);
                    })
                )
                .style("fill", `url(#bar_${vis.perspective}_id)`)
                .style("stroke", vis.color_stroke)
                .style("stroke-width", "1px")
 
                .on("mouseover", mouseover)
                .on("mousemove", vis.mousemove)
                .on("mouseleave", mouseleave)
                ;

        vis.bar
            .exit()
            .transition(vis.transition_duration)
            .attrTween("d", vis.arc_tween) 
                .remove();

        vis.bar
            .transition(vis.transition_duration)   
            .attrTween("d", vis.arc_tween)   
            
        

        vis.arc_tween = (d_: any) => {
            const i_ = d3.interpolate(this._current, d_);
            this._current = i_(1);
            return (t_: any) => vis.arc(i_(t_));
        }

        
    };
};

function user_friendly_number (_value: number) {

    let value!: string;

    if (_value !== null) {
        value = _value.toFixed(2);
    } else {
        value = _value
    }
    return value
};

