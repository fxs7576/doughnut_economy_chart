
import * as d3 from "d3";

import { 
  country_id_selected,
  url
} from "./config";


import { Boundary } from "./custom_boundary";
import { CircularBar } from "./custom_circular_bar";
import { LabelInside } from "./custom_label_inside";
import { LabelOutside } from "./custom_label_outside";
import { populate_dropdown } from "./custom_dropdown";


let data_raw: any;
let data_inside_array: string[];


let circular_bar_inside: any;
let circular_bar_outside: any;
let label_inside: any;
let label_outside: any;
let boundary_inside: any;
let boundary_middle: any;
let boundary_outside: any;

populate_dropdown(country_id_selected, url);

d3.json(url).then(_data_raw => {
  
  data_raw = _data_raw;

  data_inside_array = data_raw[0]["data"].map((e: any) => e.country_id);

  circular_bar_inside = new CircularBar({
    _perspective: "inside",
    _data_raw: data_raw,
    _data_inside_array: data_inside_array
    });

  circular_bar_outside = new CircularBar({
    _perspective: "outside",
    _data_raw: data_raw,
    _data_inside_array: data_inside_array
    });
  
  label_inside = new LabelInside({
    _data_raw: data_raw,
    _font_fill: "#008080",
    _font_size: 13,
    _font_family: "Gill Sans",
    _letter_spacing: 0
  });

  label_outside = new LabelOutside({
    _data_raw: data_raw,
    _font_fill: "#008080",
    _font_size: 15,
    _font_family: "Optima",
    _letter_spacing: 0
  });

  
  boundary_inside = new Boundary({
    _perspective: "inside",
    _data_raw: data_raw,
    _boundary_fill: "#017241",
    _font_fill: "white",
    _font_size: 12,
    _font_family: "Lucida Console",
    _letter_spacing: 1
  });

  boundary_middle = new Boundary({
    _perspective: "middle",
    _data_raw: data_raw,
    _boundary_fill: "#6FB646",
    _font_fill: "white",
    _font_size: 25,
    _font_family: "Bradley Hand",
    _letter_spacing: 4
  });

  boundary_outside = new Boundary({
    _perspective: "outside",
    _data_raw: data_raw,
    _boundary_fill: "#017241",
    _font_fill: "white",
    _font_size: 12,
    _font_family: "Lucida Console",
    _letter_spacing: 1
  });

});


$("#country-dropdown").on("change", update_chart);
function update_chart() {

  circular_bar_inside.wrangle_data();
  circular_bar_outside.wrangle_data();

};

