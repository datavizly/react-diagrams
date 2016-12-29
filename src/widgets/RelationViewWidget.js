var React = require("react");
var _ = require("lodash");
var Node = require("./NodeWidget");
/**
 * @author Dylan Vorster
 */
module.exports = React.createClass({
    displayName: "RelationViewWidget",
    getInitialState: function () {
        return {};
    },
    getDefaultProps: function () {
        return {
            engine: null
        };
    },

    render: function () {
        console.log('RelationViewWidget');
        return (
            React.DOM.div({
                    className: 'node-view',
                    style: {
                        transform: 'scale(' + this.props.engine.state.zoom / 100.0 + ') translate(' + this.props.engine.state.offsetX + 'px,' + this.props.engine.state.offsetY + 'px)',
                        width: '100%',
                        height: '100%'
                    }
                },
                _.map(this.props.engine.state.links, function (link) {
                    if (link.points.length < 2 || !(link.source !== null && link.target !== null)) {
                        return;
                    } else {
                        if (link.source !== null && link.target !== null) {
                            link.points = this.props.engine.getLinkSourceAndTargetPointer(this.props.engine.getNode(link.source), this.props.engine.getNode(link.target));
                        } else {
                            if (link.source !== null) {
                                link.points[0] = this.props.engine.getPortCenter(this.props.engine.getNode(link.source), link.sourcePort);
                            }
                            if (link.target !== null) {
                                link.points[link.points.length - 1] = this.props.engine.getPortCenter(this.props.engine.getNode(link.target), link.targetPort);
                            }
                        }
                    }

                    return React.createElement('div', {
                        className: 'node',
                        key: link.id,
                        style: {
                            top: (link.points[0].y + link.points[1].y) / 2 - 16,
                            left: (link.points[0].x + link.points[1].x) / 2 - 16,
                            height: 32,
                            width: 32,
                            backgroundImage: `url(${link.image})`
                        }
                    });
                }.bind(this))
            )
        );
    }
});