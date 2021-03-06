var React = require("react");
/**
 * @author Dylan Vorster
 */
module.exports = React.createClass({
    displayName: "NodeWidget",
    getInitialState: function () {
        return {
            mouseDown: false
        };
    },
    getDefaultProps: function () {
        return {
            node: null,
            engine: null
        };
    },

    shouldComponentUpdate: function () {
        if (this.props.engine.state.updatingNodes !== null) {
            if (this.props.engine.state.updatingNodes[this.props.node.id] !== undefined) {
                return true;
            }
        }
        return true;
    },

    render: function () {
        return (
            React.DOM.div({
                    onMouseLeave: function () {
                        if (!this.props.engine.nodeMovable)
                            this.props.engine.setSelectedNode(null);
                    }.bind(this),
                    onMouseEnter: function () {
                        if (!this.props.engine.nodeMovable)
                            this.props.engine.setSelectedNode(this.props.node);
                    }.bind(this),
                    onMouseDown: function () {
                        if (this.props.engine.nodeMovable)
                            this.props.engine.setSelectedNode(this.props.node);
                    }.bind(this),
                    'data-nodeid': this.props.node.id,
                    className: 'node' + (this.props.engine.state.selectedNode
                    && this.props.engine.state.selectedNode.id == this.props.node.id ? ' selected' : ''),
                    style: {
                        top: this.props.node.y,
                        left: this.props.node.x,
                    }
                },
                React.cloneElement(this.props.children, {engine: this.props.engine, node: this.props.node})
            )
        );
    }
});