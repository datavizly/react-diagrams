var React = require("react");
/**
 * @author Dylan Vorster
 */
module.exports = React.createClass({
    displayName: "displayName",
    getInitialState: function () {
        return {
            selected: false,
        };
    },
    getDefaultProps: function () {
        return {
            name: "unknown"
        };
    },
    render: function () {
        return (
            React.DOM.div({
                style: {
                    lineHeight: '40px', fontSize: '14px', paddingLeft: 15, height: 40, minWidth: 170
                },
                onMouseEnter: function () {
                    this.setState({selected: true});
                }.bind(this),
                onMouseLeave: function () {
                    this.setState({selected: false});
                }.bind(this),
                className: 'port',
                // className:'port'+(this.state.selected?' selected':''),
                'data-name': this.props.name,
                'data-nodeid': this.props.node.id,
                dangerouslySetInnerHTML: {
                    __html: this.props.title
                }
            })
        );
    }
});