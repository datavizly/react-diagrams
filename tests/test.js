var React = require("react");
var ReactDOM = require("react-dom");
var Canvas = require("../src/widgets/CanvasWidget");
var BasicNodeWidget = require("../src/widgets/BasicNodeWidget");
var TableRelationNodeWidget = require("../src/widgets/TableRelationNodeWidget");
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
        isTableRelation: true
    });

    var model = {links: [], nodes: []};

    function generateSet(model, offsetX, offsetY) {

        var node1 = Engine.UID();
        var node2 = Engine.UID();
        var node3 = Engine.UID();
        var node4 = Engine.UID();
        var node5 = Engine.UID();


        model.links = model.links.concat([
            {
                id: Engine.UID(),
                source: node1,
                sourcePort: 'in',
                target: node2,
                targetPort: 'in',
                image: '/src/images/sql-join-icon.png'
            },
            {
                id: Engine.UID(),
                source: node1,
                sourcePort: 'in',
                target: node3,
                targetPort: 'in',
                image: '/src/images/sql-join-outer-icon.png'
            },
            {
                id: Engine.UID(),
                source: node2,
                sourcePort: 'in',
                target: node3,
                targetPort: 'in',
                image: '/src/images/sql-join-left-icon.png'
            }
        ]);

        model.nodes = model.nodes.concat([
            {
                id: node1,
                type: 'action',
                data: {
                    color: 'rgb(85, 85, 85)',
                    background: '#E7E7E7',
                    name: "Create User",
                    inVariables: ['in']
                },
                x: 50 + offsetX,
                y: 50 + offsetY
            },
            {
                id: node2,
                type: 'action',
                data: {
                    color: 'rgb(85, 85, 85)',
                    background: '#E7E7E7',
                    name: "Add Card to User",
                    inVariables: ['in']
                },
                x: 350 + offsetX,
                y: 50 + offsetY
            },
            {
                id: node3,
                type: 'action',
                data: {
                    color: 'rgb(85, 85, 85)',
                    background: '#E7E7E7',
                    name: "Remove User 1",
                    inVariables: ['in']
                },
                x: 350 + offsetX,
                y: 150 + offsetY
            }
        ]);
    }

    generateSet(model, 0, 0);

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

    Engine.loadModel(model);


    ReactDOM.render(React.createElement(Canvas, {engine: Engine}), document.getElementById('eid'));
};
