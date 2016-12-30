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
            removeAction: function (id) {
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
                React.DOM.div({className: 'ports', style: {paddingRight: 12}},
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
                                node: this.props.node
                            })
                        );
                    }.bind(this))),
                    React.DOM.div({
                        onClick: () => this.props.removeAction(this.props.node.id),
                        style: {
                            float: 'right',
                            paddingTop: 7,
                            fontSize: '26px'
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