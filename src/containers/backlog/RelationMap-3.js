/**
 * Created by william.xu on 2017/4/17
 */

import React, {PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import { Button, Row, Col } from 'antd';
import G2 from 'g2';
import createG2 from 'g2-react';

let selectNode = null;

G2.track(false);//关闭 G2 的体验改进计划打点请求
const G2Chart = createG2(chart => {

    var drawNode = function(cfg, group, collapsed, isLeaf) {
        var x = cfg.x;
        var y = cfg.y;
        //var y = window.innerHeight;
        var pointSize = 5;
        //var width = cfg.size;
        var width = 200;
        //var height = 28;
        var height = 100;
        //var label = cfg.label;
        var node = cfg.origin._origin;
        var selected = node.selected;
        var shape = group.addShape('rect', {
            attrs: {
                x: x,
                y: y - height / 2 ,
                width: width,
                //height: height,
                height: height,
                fill: selected? '#ffdd76': '#7ec2f3',
                cursor: isLeaf ? '' : 'pointer',
                //stroke: cfg.color
                stroke: '#ccc',
                radius:5
            }
        });
//        group.addShape('text', {//乱码，不能用
//            attrs: {
//                x: x+10,
//                y: y+8,
////                fontFamily: 'simsun',
//                fontSize: 18,
//                text: node.name,
//                stroke: selected? '#FFFFFF': '#000000',
//            }
//        });
        if (!isLeaf) {
            x = x - pointSize;
            group.addShape('circle', {
                attrs: {
                    r: pointSize,
                    x: x,
                    y: y,
                    fill: '#fff',
                    stroke: cfg.color // 可以直接设置颜色 cfg.color，也可以使用映射
                }
            });
            var path = [];
            path.push(['M', x - pointSize/2, y]);
            path.push(['L', x + pointSize/2, y]);
            if (collapsed) {
                path.push(['M', x, y - pointSize/2]);
                path.push(['L', x, y + pointSize/2]);
            }
            group.addShape('path', {
                attrs: {
                    path: path,
                    stroke: cfg.color
                }
            });
        }
        return shape;
    }

    var renderTree = function(nodes, edges, dx, chart) {
        chart.clear();
        var height = Math.max(800, 36 / dx);
        chart.changeSize(800, height);
        chart.forceFit();
        // 首先绘制 edges，点要在边的上面
        // 创建单独的视图
        var edgeView = chart.createView();
        edgeView.source(edges);
        edgeView.coord().transpose().scale(1, -1); //
        edgeView.axis(false);
        edgeView.tooltip(false);
        // Stat.link 方法会生成 ..x, ..y的字段类型，数值范围是 0-1
        edgeView.edge()
            .position(Stat.link('source*target',nodes))
            .shape('vhv')
            .color('#ccc');
        function strLen(str) {
            var len = 0;
            for (var i = 0; i < str.length; i ++) {
                if(str.charCodeAt(i) > 0 && str.charCodeAt(i) < 128) {
                    len ++;
                } else {
                    len += 2;
                }
            }
            return len;
        }
        // 创建节点视图
        var nodeView = chart.createView();
        nodeView.coord('rect').transpose().scale(1, -1); //'polar'
        nodeView.axis(false);
        nodeView.tooltip(false);
        // 节点的x,y范围是 0，1
        // 因为边的范围也是 0,1所以正好统一起来
        nodeView.source(nodes, {
            x: {min: 0,max:1},
            y: {min: 0, max:1},
            value: {min: 0}
        },['id','x','y','name','children','collapsed', 'selected','description']); // 由于数据中没有 'collapsed' 字段，所以需要设置所有的字段名称
        nodeView.point().position('x*y').color('steelblue').size('200').label('name', {
            offset: 6,
            labelEmit: true,
            label:{
                fontSize: 18,
                fill: '#404040'
            },
            custom: true,
            renderer: function(text, item, index)  {
                //console.log(text, item);
                var color = item.point.selected?'#00FF00':'#0000FF';
                //return '<span >'+text+'</span>';
                return '<div style="width:200px">'+item.point.description+'</div>'
            }
        }).shape('children*collapsed*selected', function(children,collapsed,selected, name) {
            if (children) {
                if (collapsed) {
                    return 'collapsed';
                } else {
                    return 'expanded';
                }
            }
            return 'leaf';
//        }).selected(true, {
//            selectedMode: 'single', // multiple 为多选，single 为单选
//            style: {
//                fill: '#FF0000',
////                stroke:'#FF0000'
//            }
        })//.tooltip('description');
        chart.render();
    }

    G2.Shape.registShape('point', 'collapsed', {
        drawShape: function(cfg, group) {
            return drawNode(cfg, group, true)
        }
    });
    G2.Shape.registShape('point', 'expanded', {
        drawShape: function(cfg, group) {
            return drawNode(cfg, group, false);
        }
    });
    G2.Shape.registShape('point', 'leaf', {
        drawShape: function(cfg, group) {
            return drawNode(cfg, group, false, true);
        }
    });

    var data = chart.get('data').data;

    var Layout = G2.Layout;
    // 使用layout，用户可以自己编写自己的layout
    // 仅约定输出的节点 存在 id,x，y字段即可
    var layout = new Layout.Tree({
        nodes: data
    });
    layout.dx = 0.03;
    var dx = layout.dx;
    var nodes = layout.getNodes();
    var edges = layout.getEdges();
    var Stat = G2.Stat;


    chart.animate(false);
    // 不显示title
    /*chart.tooltip({
        title: null,
    });*/
    /*chart.tooltip(true, {
     custom: true,
     html:  '<div class="ac-tooltip" style="position:absolute;visibility: hidden;"><p class="ac-title"></p><table class="ac-list custom-table"></table></div>', // tooltip 的 html 外层模板，可支持类似 jquery 的使用，直接传入 dom id，如 "#c1"
     itemTpl: '<tr><td>{description}</td></tr>', // 使用 html 时每一个显示项的模板，默认支持 index, color, name, value 这四个变量。
     offset: 10, // 偏移量，设置tooltip 显示位置距离 x 轴方向上的偏移
     customFollow: true // 设置 tooltip 是否跟随鼠标移动，默认为 true，跟随。
     });*/
    chart.legend('children', false);
    chart.legend('name', false);

    var timer = null;
    chart.on('plotclick', function(ev) {
        clearTimeout(timer);
        timer = setTimeout(function() {
            //处理click事件
            var shape = ev.shape;
            if (shape) {
                var obj = shape.get('origin');
                var id = obj._origin.id;
                var node = layout.findNode(id);
                if (node) {
                    node.selected = true;
                    selectNode = node;
                    layout.reset();
                    nodes = layout.getNodes();
                    for (var index in nodes){
                        if (nodes[index].id != id){
                            nodes[index].selected = false;
                        }
                    }
                    edges = layout.getEdges();
                    layout.dx = 0.03;
                    dx = layout.dx;
                    renderTree(nodes, edges, dx, chart);
                }
            }
        }, 200);
    });
//    chart.on('itemselected', function(ev){
//        console.log(ev);
//    });
    chart.on('plotdbclick', function(ev){
        clearTimeout(timer);
        var shape = ev.shape;
        if (shape) {
            var obj = shape.get('origin');
            if (!obj){
                return;
            }
            var id = obj._origin.id;
            var node = layout.findNode(id);
            if (node && node.children) {
                node.selected = true;
                node.collapsed = !node.collapsed ? 1 : 0;
                layout.reset();
                nodes = layout.getNodes();
                for (var index in nodes){
                    if (nodes[index].id != id){
                        nodes[index].selected = false;
                    }
                }
                edges = layout.getEdges();
                layout.dx = 0.03;
                dx = layout.dx;
                // edgeView.changeData(edges);
                renderTree(nodes, edges, dx, chart);
            }
        }
    });

    renderTree(nodes, edges, dx, chart);

});





export default class RelationMap extends React.Component{
    constructor(props){
        super(props);
    }

    componentDidMount() {
        selectNode=null;
    }

    getSelectNode(){
        return selectNode;
    }

    render(){
        const config = {
            forceFit: true,
            width: 500,
            height: 450,
            plotCfg: {
                border: {
                    fill: '#FFFFFF',
                    // stroke: '#00FF00'
                },
                background: {
                    // fill: '#Ff0000',
                    // stroke: '#0000FF'
                },
                margin: [10,50]
            }
        };
        return (
            <div>
                <G2Chart
                    data={this.props.data}
                    width={config.width}
                    height={config.height}
                    plotCfg={config.plotCfg}
                    forceFit={config.forceFit} />
            </div>
        );
    }

}


RelationMap.propTypes = {
    data: PropTypes.array.isRequired
};