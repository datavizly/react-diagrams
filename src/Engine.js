var _ = require("lodash");
var React = require("react");
/**
 * @author Dylan Vorster
 */
module.exports = function (config) {
    config = config || {};
    var engine = {
        state: {
            links: {},
            nodes: {},
            factories: {},
            canvas: null,
            offsetX: 0,
            offsetY: 0,
            zoom: 100,
            listeners: {},
            selectedLink: null,
            selectedNode: null,

            updatingNodes: null,
            updatingLinks: null
        },

        repaintLinks: function (links) {
            this.state.updatingNodes = {};
            this.state.updatingLinks = {};
            links.forEach(function (link) {
                this.state.updatingLinks[link.id] = link;
            }.bind(this));
            this.update();
        },

        repaintNodes: function (nodes) {
            this.state.updatingNodes = {};
            this.state.updatingLinks = {};

            //store the updating node is's
            nodes.forEach(function (node) {
                this.state.updatingNodes[node.id] = node;
                this.getNodeLinks(node).forEach(function (link) {
                    this.state.updatingLinks[link.id] = link;
                }.bind(this));
            }.bind(this));

            this.update();
        },

        update: function () {
            this.fireEvent({type: 'repaint'});
        },

        getRelativeMousePoint: function (event) {
            var point = this.getRelativePoint(event.pageX, event.pageY);
            return {
                x: (point.x / (this.state.zoom / 100.0)) - this.state.offsetX,
                y: (point.y / (this.state.zoom / 100.0)) - this.state.offsetY
            };
        },

        getRelativePoint: function (x, y) {
            var canvasRect = this.state.canvas.getBoundingClientRect();
            return {x: x - canvasRect.left, y: y - canvasRect.top};
        },

        fireEvent: function (event) {
            _.forEach(this.state.listeners, function (listener) {
                listener(event);
            });
        },

        removeListener: function (id) {
            delete this.state.listeners[id];
        },

        registerListener: function (cb) {
            var id = this.UID();
            this.state.listeners[id] = cb;
            return id;
        },

        setZoom: function (zoom) {
            this.state.zoom = zoom;
            this.update();
        },

        setOffset: function (x, y) {
            this.state.offsetX = x;
            this.state.offsetY = y;
            this.update();
        },

        loadModel: function (model) {
            this.state.links = {};
            this.state.nodes = {};

            model.nodes.forEach(function (node) {
                this.addNode(node);
            }.bind(this));

            model.links.forEach(function (link) {
                this.addLink(link);
            }.bind(this));
        },

        reloadModel: function (model) {
            let preNodes = this.state.nodes;
            let preLinks = this.state.links;
            this.state.links = {};
            this.state.nodes = {};

            this.state.updatingNodes = {};
            this.state.updatingLinks = {};

            model.links.forEach(function (link) {
                this.addLink(link);
            }.bind(this));

            model.nodes.forEach(function (node) {
                this.addNode(node);
                if (!preNodes[node.id] || preNodes[node.id].x != node.x || preNodes[node.id].y != node.y) {
                    //store the updating node is's
                    this.state.updatingNodes[node.id] = node;
                    this.getNodeLinks(node).forEach(function (link) {
                        this.state.updatingLinks[link.id] = link;
                    }.bind(this));
                }
            }.bind(this));

            _.forEach(this.state.links, function (link) {
                if (link.points.length === 0) {
                    if (link.source !== null && link.target !== null) {
                        link.points = this.getLinkSourceAndTargetPointer(this.getNode(link.source), this.getNode(link.target));
                    } else {
                        if (link.source !== null) {
                            link.points[0] = this.getPortCenter(this.getNode(link.source), link.sourcePort);
                        }
                        if (link.target !== null) {
                            link.points[link.points.length - 1] = this.getPortCenter(this.getNode(link.target), link.targetPort);
                        }
                    }

                }
            }.bind(this));

            this.update();

        },

        resetModel: function (model) {
            this.state.links = {};
            this.state.nodes = {};

            model.nodes.forEach(function (node) {
                this.addNode(node);
            }.bind(this));

            model.links.forEach(function (link) {
                this.addLink(link);
            }.bind(this));
        },

        updateNode: function (node) {

            //find the links and move those as well
            this.getNodeLinks(node);
            this.fireEvent({type: 'repaint'});
        },

        UID: function () {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        },

        getNodeElement: function (node, port) {
            return this.state.canvas.querySelector('.node[data-nodeid="' + node.id + '"]');
        },

        getNodePortElement: function (node, port) {
            return this.state.canvas.querySelector('.port[data-name="' + port + '"][data-nodeid="' + node.id + '"]');
        },

        getNodePortLinks: function (node, port) {
            var nodeID = this.getNodeID(node);
            var links = this.getNodeLinks(nodeID);
            return links.filter(function (link) {
                if (link.target === nodeID && link.targetPort === port) {
                    return true;
                }
                else if (link.source === nodeID && link.sourcePort === port) {
                    return true;
                }
                return false;
            });
        },

        getNodeID: function (node) {
            if (typeof node === 'object') {
                node = node.id;
            }
            return node;
        },

        getNodeLinks: function (node) {
            var nodeID = this.getNodeID(node);
            return _.values(_.filter(this.state.links, function (link, index) {
                return link.source == nodeID || link.target == nodeID;
            }));
        },

        removeLink: function (link) {
            delete this.state.links[link.id];
            this.update();
        },

        removeNode: function (node) {
            //remove the links
            var links = this.getNodeLinks(node);
            links.forEach(function (link) {
                this.removeLink(link);
            }.bind(this));

            //remove the node
            delete this.state.nodes[node.id];
            this.update();
        },

        getLinkSourceAndTargetPointer: function (sourceNode, targetNode) {
            // var sourceElement = this.getNodeElement(sourceNode);
            // var sourceRect = sourceElement.getBoundingClientRect();
            // var targetElement = this.getNodeElement(targetNode);
            // var targetRect = targetElement.getBoundingClientRect();

            var sourceElement = {offsetWidth: 197, offsetHeight: 29};
            var targetElement = {offsetWidth: 197, offsetHeight: 29};


            // var sourceRel = this.getRelativePoint(sourceRect.left, sourceRect.top);
            // var targetRel = this.getRelativePoint(targetRect.left, targetRect.top);
            var sourceRel = {x: sourceNode.x, y: sourceNode.y};
            var targetRel = {x: targetNode.x, y: targetNode.y};

            var sourceLeftCenter = {
                x: (sourceRel.x / (this.state.zoom / 100.0)) - (this.state.offsetX),
                y: (sourceElement.offsetHeight / 2 + sourceRel.y / (this.state.zoom / 100.0)) - (this.state.offsetY)
            };
            var sourceRightCenter = {
                x: (sourceElement.offsetWidth + sourceRel.x / (this.state.zoom / 100.0)) - (this.state.offsetX),
                y: (sourceElement.offsetHeight / 2 + sourceRel.y / (this.state.zoom / 100.0)) - (this.state.offsetY)
            };
            var sourceTopCenter = {
                x: (sourceElement.offsetWidth / 2 + sourceRel.x / (this.state.zoom / 100.0)) - (this.state.offsetX),
                y: (sourceRel.y / (this.state.zoom / 100.0)) - (this.state.offsetY)
            };
            var sourceBottomCenter = {
                x: (sourceElement.offsetWidth / 2 + sourceRel.x / (this.state.zoom / 100.0)) - (this.state.offsetX),
                y: (sourceElement.offsetHeight + sourceRel.y / (this.state.zoom / 100.0)) - (this.state.offsetY)
            };

            var targetLeftCenter = {
                x: (targetRel.x / (this.state.zoom / 100.0)) - (this.state.offsetX),
                y: (targetElement.offsetHeight / 2 + targetRel.y / (this.state.zoom / 100.0)) - (this.state.offsetY)
            };
            var targetRightCenter = {
                x: (targetElement.offsetWidth + targetRel.x / (this.state.zoom / 100.0)) - (this.state.offsetX),
                y: (targetElement.offsetHeight / 2 + targetRel.y / (this.state.zoom / 100.0)) - (this.state.offsetY)
            };
            var targetTopCenter = {
                x: (targetElement.offsetWidth / 2 + targetRel.x / (this.state.zoom / 100.0)) - (this.state.offsetX),
                y: (targetRel.y / (this.state.zoom / 100.0)) - (this.state.offsetY)
            };
            var targetBottomCenter = {
                x: (targetElement.offsetWidth / 2 + targetRel.x / (this.state.zoom / 100.0)) - (this.state.offsetX),
                y: (targetElement.offsetHeight + targetRel.y / (this.state.zoom / 100.0)) - (this.state.offsetY)
            };

            if (sourceRightCenter.x <= targetLeftCenter.x) {
                return [sourceRightCenter, targetLeftCenter]
            }

            if (sourceLeftCenter.x >= targetRightCenter.x) {
                return [sourceLeftCenter, targetRightCenter];
            }

            if (sourceBottomCenter.y <= targetTopCenter.y) {
                return [sourceBottomCenter, targetTopCenter];
            }

            if (sourceTopCenter.y >= targetBottomCenter.y) {
                return [sourceTopCenter, targetBottomCenter]
            }
        },

        getPortCenter: function (node, port) {
            var sourceElement = this.getNodePortElement(node, port);
            var sourceRect = sourceElement.getBoundingClientRect();

            var rel = this.getRelativePoint(sourceRect.left, sourceRect.top);

            return {
                x: ((sourceElement.offsetWidth / 2) + rel.x / (this.state.zoom / 100.0)) - (this.state.offsetX),
                y: ((sourceElement.offsetHeight / 2) + rel.y / (this.state.zoom / 100.0)) - (this.state.offsetY)
            };
        },

        setSelectedNode: function (node) {
            this.state.selectedLink = null;
            this.state.selectedNode = node;
            this.state.updatingNodes = null;
            this.state.updatingLinks = null;
            this.update();
        },

        setSelectedLink: function (link) {
            this.state.selectedNode = null;
            this.state.selectedLink = link;
            this.state.updatingNodes = null;
            this.state.updatingLinks = null;
            this.update();
        },

        addLink: function (link) {
            var FinalLink = _.defaults(link, {
                id: this.UID(),
                source: null,
                sourcePort: null,
                target: null,
                targetPort: null,
                points: []
            });

            this.state.links[FinalLink.id] = FinalLink;
            return FinalLink;
        },

        addNode: function (node, event) {
            var point = {x: 0, y: 0};
            if (event !== undefined) {
                point = this.getRelativeMousePoint(event);
            }

            var FinalNode = _.defaults(node, {
                id: this.UID(),
                type: 'default',
                data: {},
                x: point.x,
                y: point.y
            });
            this.state.nodes[FinalNode.id] = FinalNode;
        },

        getLink: function (id) {
            return this.state.links[id];
        },

        getExistLinkBySourceAndTarget: function (id, source, target) {
            let link = null;
            Object.keys(this.state.links).map((key) => {
                let _link = this.state.links[key];
                if ((id != _link.id) && ((_link.source === source && _link.target == target) || (_link.source === target && _link.target == source))) {
                    link = _link;
                }
            });
            return link;
        },

        getNode: function (id) {
            return this.state.nodes[id];
        },

        getNodeFactory: function (type) {
            if (this.state.factories[type] === undefined) {
                throw "Cannot find node factory for: " + type;
            }
            return this.state.factories[type];
        },

        registerNodeFactory: function (factory) {
            var FinalModel = _.defaults(factory, {
                type: "factory",
                isPortAllowed: function (sourceNode, sourceport, targetNode, targetPort) {
                    return true;
                },
                generateModel: function (model, engine) {
                    return null;
                }
            });
            this.state.factories[FinalModel.type] = FinalModel;
        }
    };

    engine = Object.assign(engine, config);
    return engine;
};