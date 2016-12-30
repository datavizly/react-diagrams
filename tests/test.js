var React = require("react");
var ReactDOM = require("react-dom");
var Canvas = require("../src/widgets/CanvasWidget");
var TableRelationNodeWidget = require("../src/widgets/TableRelationNodeWidget");
var layerToNodeAndLink = require('./layerToNodeAndLink').GenerateNodeAndLink;
var layer = require('./layerToNodeAndLink').layer;
require("./test.scss");

window.onload = function () {

    var Engine = require("../src/Engine")({
        zoomOnWheel: false,
        singleLink: true,
        linkPointerAble: false,
        singlePointer: true,
        nodeMovable: false,
        pointerMovable: false,
        canvasMovable: false,
        isTableRelation: true,
        onLinkAdd: function (link) {
            let join = {
                "sourceResourceId": link.source,
                "targetResourceId": link.target
            };
            layer.schema.joins.push(join);
            let model = layerToNodeAndLink(layer);
            Engine.loadModel(model);
            Engine.forceUpdate();
        }
    });

    Engine.registerNodeFactory({
        type: 'action',
        generateModel: function (model) {
            return React.createElement(TableRelationNodeWidget, {
                removeAction: function () {
                    Engine.removeNode(model);
                },
                background: model.data.background,
                color: model.data.color,
                node: model,
                name: model.data.name,
                inPorts: model.data.inVariables
            });
        }
    });

    let model = layerToNodeAndLink(layer);

    Engine.loadModel(model);


    ReactDOM.render(React.createElement(Canvas, {engine: Engine}), document.getElementById('eid'));
};