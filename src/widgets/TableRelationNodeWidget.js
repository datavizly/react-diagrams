var React = require("react");
var Port = require("./PortWidget");
var TableRelationPortWidget = require("./TableRelationPortWidget");
var _ = require("lodash");
//var m = require("../merge");
/**
 * @author Dylan Vorster
 */
module.exports = React.createClass({
    displayName: "BasicNodeWidget",
    getInitialState: function () {
        return {};
    },
    getDefaultProps: function () {
        return {
            name: "Node",
            node: null,
            inPorts: [],
            outPorts: [],
            color: 'rgb(50,50,50)',
            removeAction: function () {
                console.log("remove node");
            }
        };
    },

    render: function () {

        var props = {};

        return (
            React.DOM.div({
                    className: 'basic-node',
                    style: {background: this.props.background, color: this.props.color}
                },
                React.DOM.div({className: 'ports'},
                    React.DOM.div({className: 'in'}, (Array.isArray(this.props.inPorts) ? this.props.inPorts : [this.props.inPorts]).map(function (port) {
                        var portName = "";
                        if (typeof port === 'object') {
                            portName = port.name;
                        } else {
                            portName = port;
                        }
                        return React.DOM.div({className: 'in-port', key: portName, style: {width: 170, height: 40,}},
                            React.createElement(TableRelationPortWidget, {
                                name: portName,
                                title: this.props.name,
                                node: this.props.node,
                                removeAction: this.props.removeAction
                            })
                        );
                    }.bind(this))),
                    React.DOM.div({
                        onClick: this.props.removeAction,
                        style: {
                            lineHeight: '40px', fontSize: '26px', height: 40, minWidth: 30,
                            // background: 'rgba(255, 255, 255, 0.1)'
                        },
                        dangerouslySetInnerHTML: {
                            __html: '×'
                        }
                    })
                )
            )
        );
    }
});