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
        var pointSize = 5;
        var width = cfg.size;
        var height = 28;
        //var label = cfg.label;
        var node = cfg.origin._origin;
        var selected = node.selected;

        var shape = group.addShape('rect', {
            attrs: {
                x: x,
                y: y - height / 2 ,
                width: width,
                height: height,
                fill: selected? '#ffdd76': '#7ec2f3',
                cursor: isLeaf ? '' : 'pointer',
                //stroke: cfg.color
                stroke: '#ccc',
                radius:5
            }
        });

//        group.addShape('text', {//乱码，不能用，是G6提供的功能
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
        //console.log(edges);
        edgeView.edge()
            .position(Stat.link('source*target',nodes))
            .shape('smooth')
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
        //nodeView.tooltip(false);
        // 节点的x,y范围是 0，1
        // 因为边的范围也是 0,1所以正好统一起来
        nodeView.source(nodes, {
            x: {min: 0,max:1},
            y: {min: 0, max:1},
            value: {min: 0}
        },['id','x','y','name','children','collapsed', 'selected','description']); // 由于数据中没有 'collapsed' 字段，所以需要设置所有的字段名称
        nodeView.point().position('x*y').color('steelblue').size('name', function(name) {
            var length = strLen(name);
            //return length * 7 + 25 * 2;
            return length * 10;

        }).label('name', {
            offset: 6,
            labelEmit: true,
            label:{
                fontSize: 18,
                fill: '#404040'
            },
//            custom: true,
//            renderer: function(text, item, index)  {
//                console.log(text, item);
//                var color = item.point.selected?'#00FF00':'#0000FF';
//                return '<span style="font-weight: bold; color:'+color+'">'+text+'</span>';
//            }
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
    var dx = layout.dx;
    var nodes = layout.getNodes();
    var edges = layout.getEdges();
    var Stat = G2.Stat;


    chart.animate(false);
    chart.col('name');
    // 不显示title
    chart.tooltip({
        title: null,
    });
    chart.tooltip(true, {
        offset: 10,
        custom: true,
        html: '#p1'
    });

    // 查找对应的数据
    function findObj(name,data) {
        let result;
        const data_temp = data.map((item)=>{
            if(name == item.name){
                return item;
            }else if(item.children){
                return findObj(name,item.children)
            }
        });
        for(let i=0; i<data_temp.length; i++){
            if(data_temp[i]){
                result = data_temp[i];
            }
        }

        return result;
    }
    // 监听 tooltip 改变事件
    chart.on('tooltipchange', function(ev) {
        //console.log('tooltipchange');
        //console.log('ev:',ev)
        var item = ev.items[0]; // 获取tooltip要显示的内容
        //console.log('item:',item)
        var name = item.name;
        var obj = findObj(name,data);
        let desc = document.getElementById('c4');
        desc.innerHTML=obj.description?obj.description:"无";
    });

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
                dx = layout.dx;
                // edgeView.changeData(edges);
                renderTree(nodes, edges, dx, chart);
            }
        }
    });

    renderTree(nodes, edges, dx, chart);

});



const HiddenStyle = {
    display: 'none'
};
const pieContainerStyle = {
    position: 'absolute',
    visibility: 'hidden',
    border : '1px solid #efefef',
    backgroundColor: 'white',
    opacity: '.8',
    padding: '5px',
    transition: 'top 200ms,left 200ms',
};

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
                <div style={HiddenStyle}>
                    <div id="p1" className="ac-tooltip" style={pieContainerStyle}>
                        <span>描述</span>
                        <div id="c4"></div>
                    </div>
                </div>

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