var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define("interfaces/IData", ["require", "exports"], function (require, exports) {
    "use strict";
});
define("utils", ["require", "exports"], function (require, exports) {
    "use strict";
    var Types;
    (function (Types) {
        Types[Types["pie"] = 0] = "pie";
    })(Types = exports.Types || (exports.Types = {}));
    ;
    var VAlign;
    (function (VAlign) {
        VAlign[VAlign["top"] = 0] = "top";
        VAlign[VAlign["middle"] = 1] = "middle";
        VAlign[VAlign["bottom"] = 2] = "bottom";
    })(VAlign = exports.VAlign || (exports.VAlign = {}));
    ;
    var Align;
    (function (Align) {
        Align[Align["left"] = 0] = "left";
        Align[Align["center"] = 1] = "center";
        Align[Align["right"] = 2] = "right";
    })(Align = exports.Align || (exports.Align = {}));
    ;
    var Colors;
    (function (Colors) {
        Colors[Colors["#98abc5"] = 0] = "#98abc5";
        Colors[Colors["#8a89a6"] = 1] = "#8a89a6";
        Colors[Colors["#7b6888"] = 2] = "#7b6888";
        Colors[Colors["#6b486b"] = 3] = "#6b486b";
        Colors[Colors["#a05d56"] = 4] = "#a05d56";
        Colors[Colors["#d0743c"] = 5] = "#d0743c";
        Colors[Colors["#ff8c00"] = 6] = "#ff8c00";
    })(Colors = exports.Colors || (exports.Colors = {}));
    ;
    ;
});
define("opencharts", ["require", "exports", "d3"], function (require, exports, d3) {
    "use strict";
    var Chart = (function () {
        function Chart(selector) {
            this.width = 400;
            this.height = 400;
            this.margin = {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0
            };
            this.legend = {
                shapeSize: 14
            };
            this.selector = selector.replace("#", "");
            this.colors = d3.schemeCategory20c;
        }
        Chart.prototype.setData = function (data) {
            this.dataArray = data;
        };
        Chart.prototype.createSVG = function () {
            var width = this.width;
            var height = this.height;
            return d3.select("#" + this.selector)
                .append("svg")
                .attr("width", width)
                .attr("height", height)
                .attr("preserveAspectRatio", "xMinYMin meet")
                .attr("viewBox", "0 0 " + width + " " + height)
                .classed("svg-content-responsive", true);
        };
        ;
        Chart.prototype.createSVGLegends = function (svg) {
            var main = this;
            var calculatedLegends = [];
            var width = this.width;
            var margin = this.margin;
            var shapeSize = this.getLegendShapeSize();
            var legend = svg.selectAll(".legend")
                .data(this.dataArray)
                .enter()
                .append("g")
                .attr("class", "legend");
            legend.append("text")
                .text(function (d) { return d.label; })
                .attr("x", function (d, i) {
                var legendWidth = this.getComputedTextLength();
                var legendHeight = this.clientHeight;
                return main.getLegendX(calculatedLegends, i, legendWidth, legendHeight);
            })
                .attr("y", function (d, i) {
                return main.getLegendY(calculatedLegends, i);
            });
            var circleR = shapeSize / 2;
            legend.append("circle")
                .attr("r", circleR)
                .attr("fill", function (d, i) {
                return main.getColor(i);
            })
                .attr("cx", function (d, i) {
                return calculatedLegends[i].left + circleR;
            })
                .attr("cy", function (d, i) {
                return -1 * (margin.top + (calculatedLegends[i].height / 2)) + calculatedLegends[i].top + (circleR / 2);
            });
            legend.attr("transform", function (d, i) {
                var horz = margin.left;
                var vert = margin.top + calculatedLegends[i].height;
                return "translate(" + horz + "," + vert + ")";
            });
            return calculatedLegends;
        };
        ;
        Chart.prototype.getLegendX = function (calculatedLegends, i, legendWidth, legendHeight) {
            var width = this.width;
            var canvasWidth = this.getCanvasWidth();
            var shapeSize = this.getLegendShapeSize();
            calculatedLegends[i] = {};
            calculatedLegends[i].height = legendHeight;
            if (calculatedLegends[i - 1]) {
                var legendLeft = calculatedLegends[i - 1].left + calculatedLegends[i - 1].width + (shapeSize * 2);
                if ((legendLeft + legendWidth) <= canvasWidth) {
                    calculatedLegends[i].left = legendLeft;
                    calculatedLegends[i].top = calculatedLegends[i - 1].top || 0;
                }
                else {
                    calculatedLegends[i].left = 0;
                    calculatedLegends[i].top = calculatedLegends[i - 1].top + legendHeight;
                }
                calculatedLegends[i].width = legendWidth + shapeSize;
            }
            else {
                calculatedLegends[i].top = 0;
                calculatedLegends[i].left = 0;
                calculatedLegends[i].width = legendWidth + shapeSize;
            }
            return calculatedLegends[i].left + (shapeSize * 1.5);
        };
        ;
        Chart.prototype.getLegendY = function (calculatedLegends, i) {
            calculatedLegends.height = calculatedLegends[i].top + calculatedLegends[i].height;
            return calculatedLegends[i].top;
        };
        ;
        Chart.prototype.getCanvasWidth = function () {
            var width = this.width;
            var margin = this.margin;
            return width - (margin.left + margin.right);
        };
        ;
        Chart.prototype.getCanvasHeight = function () {
            var height = this.height;
            var margin = this.margin;
            return height - (margin.top + margin.bottom);
        };
        ;
        Chart.prototype.getLegendShapeSize = function () {
            return this.legend.shapeSize;
        };
        ;
        Chart.prototype.getColor = function (index) {
            console.log(this.dataArray[index].color);
            return this.dataArray[index].color || this.colors[index];
        };
        ;
        return Chart;
    }());
    exports.Chart = Chart;
});
define("opencharts.pie", ["require", "exports", "opencharts", "d3"], function (require, exports, opencharts_1, d3) {
    "use strict";
    var Pie = (function (_super) {
        __extends(Pie, _super);
        function Pie(selector) {
            var _this = _super.call(this, selector) || this;
            _this.update = function () {
                var main = this;
                function arcTween(a) {
                    var i = d3.interpolate(this._current, a);
                    this._current = i(0);
                    return function (t) {
                        return main.arc(i(t));
                    };
                }
                main.svg.selectAll(".arc .inner-arc")
                    .data(main.pie(main.dataArray))
                    .transition()
                    .duration(1000)
                    .attrTween("d", arcTween);
                main.svg.selectAll(".arc .outer-arc")
                    .data(main.pie(main.dataArray))
                    .on("end", function () { console.log("all done"); })
                    .attr("d", function (d) {
                    return main.outArc(d);
                });
            };
            return _this;
        }
        Pie.prototype.create = function () {
            var main = this;
            var data = main.dataArray;
            var canvasWidth = main.getCanvasWidth();
            var canvasHeight = main.getCanvasHeight();
            var chartName = main.selector + "-chart";
            var synchronizedMouseOver = function () {
                var arc = d3.select(this);
                var index = arc.attr("index");
                var color = arc.attr("color");
                var arcSelector = "." + "pie-outer-" + chartName + "-arc-index-" + index;
                d3.selectAll(arcSelector).style("fill", color)
                    .classed("animate", true);
            };
            var synchronizedMouseOut = function () {
                var arc = d3.select(this);
                var index = arc.attr("index");
                var arcSelector = "." + "pie-outer-" + chartName + "-arc-index-" + index;
                var selectedArc = d3.selectAll(arcSelector);
                selectedArc.style("fill", "#ffffff")
                    .classed("animate", false);
            };
            main.svg = main.createSVG();
            var calculatedLegends = main.createSVGLegends(main.svg);
            main.pie = d3.pie().value(function (d) {
                return d.value;
            });
            var legendHeight = calculatedLegends.height + 10;
            canvasHeight = canvasHeight - legendHeight;
            var radius = Math.min(canvasWidth, canvasHeight) / 2;
            main.arc = d3.arc().outerRadius(radius - 10).innerRadius(0);
            main.outArc = d3.arc().innerRadius(radius).outerRadius(radius - 6);
            var g = main.svg.selectAll(".arc")
                .data(main.pie(data))
                .enter().append("g")
                .classed("arc", true)
                .attr("transform", "translate(" + (canvasWidth / 2) + "," + (radius + legendHeight) + ")")
                .attr("index", function (d, i) { return i; })
                .attr("color", function (d, i) {
                return main.getColor(i);
            });
            g.append("path")
                .attr("class", function (d, i) {
                return "inner-arc pie-" + chartName + "-arc-index-" + i;
            })
                .attr("fill", function (d, i) {
                return main.getColor(i);
            })
                .attr("d", function (d) {
                return main.arc(d);
            })
                .each(function (d) { this._current = d; });
            g.append("path")
                .attr("class", function (d, i) {
                return "outer-arc pie-outer-arc pie-outer-" + chartName + "-arc-index-" + i;
            })
                .attr("fill", "#ffffff")
                .attr("d", function (d) {
                return main.outArc(d);
            })
                .each(function (d) { this._current = d; });
            g.on("mouseover", synchronizedMouseOver)
                .on("mouseout", synchronizedMouseOut);
        };
        ;
        return Pie;
    }(opencharts_1.Chart));
    exports.Pie = Pie;
});
//# sourceMappingURL=opencharts.js.map