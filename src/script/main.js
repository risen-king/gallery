//main.js
//var $ = require('jquery');

import React from "react";
import {render} from "react-dom";
 

import Gallery from "../component/gallery/gallery.js";
import layer   from "../component/layer/layer.js";


//使用require导入css文件
import '../style/main.scss';

render(<Gallery />,document.getElementById("root"));

// document.getElementById("root").innerHTML = (new layer()).tpl({
//     name:"john",
//     arr:["apple","xiaomi","oppo"]

// });
 

// var img1 = document.createElement("img");
// img1.src = require("./images/small.png");
// document.body.appendChild(img1);

 