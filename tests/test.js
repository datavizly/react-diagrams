var React = require("react");
var ReactDOM = require("react-dom");
var Canvas = require("../src/widgets/CanvasWidget");
var TableRelationNodeWidget = require("../src/widgets/TableRelationNodeWidget");
var layerToNodeAndLink = require('./layerToNodeAndLink').GenerateNodeAndLink;
var layerRemoveResource = require('./layerToNodeAndLink').removeResource;
var layer = require('./layerToNodeAndLink').layer;
require("./test.scss");

window.onload = function () {

    var Engine = require("../src/Engine")({
        zoomOnWheel: false,
        singleLink: true,
        linkPointerAble: false,
        singlePointer: true,
        nodeMovable: true,
        pointerMovable: false,
        canvasMovable: false,
        isTableRelation: true,
        onLinkClick: function (link) {
            console.log(link);
        },
        onNodeRemove: function (id) {
            layer = layerRemoveResource(layer, id);
            let model = layerToNodeAndLink(layer);
            Engine.reloadModel(model);
            // Engine.forceUpdate();
        },
        onLinkAdd: function (link) {
            let join = {
                "sourceResourceId": link.source,
                "targetResourceId": link.target
            };
            layer.schema.joins.push(join);
            let model = layerToNodeAndLink(layer);
            Engine.reloadModel(model);
            // Engine.forceUpdate();
        }
    });

    Engine.registerNodeFactory({
        type: 'action',
        generateModel: function (model) {
            return React.createElement(TableRelationNodeWidget, {
                removeAction: function (id) {
                    if (Engine.onNodeRemove) {
                        Engine.onNodeRemove(id);
                    }
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


    ReactDOM.render(React.createElement(Canvas,
        {
            engine: Engine,
            style: {
                width: '100%',
                height: 400,
                background: '#f2f2f2',
                display: 'flex'
            }
        }), document.getElementById('eid'));
};