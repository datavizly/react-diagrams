var React = require("react");
function GenerateNodeAndLinkByLayer(layer) {

    layer = layer || _layer;
    let resourceTargetJoins = {};
    layer.schema.resources.map((resource) => {
        resourceTargetJoins[resource.id] = 0;
    });
    layer.schema.joins.map((join) => {
        let targetCount = resourceTargetJoins[join.targetResourceId] || 0;
        resourceTargetJoins[join.targetResourceId] = targetCount + 1;
    });

    let rootIds = [];
    Object.keys(resourceTargetJoins).map((key) => {
        if (!resourceTargetJoins[key]) {
            rootIds.push(key);
        }
    });

    if (rootIds.length == 0) {
        console.log('layer data has circle, please check and fix first');
        throw new Error('layer data has circle, please check and fix first');
    }

    let resourcesHolder = {};
    layer.schema.resources.map((resource) => {
        resource.found = false;
        resourcesHolder[resource.id] = resource;
    });

    let nodes = generateNodes(resourcesHolder, rootIds, layer.schema.joins, 1);
    let links = layer.schema.joins.map((join) => {
        return {
            id: UID(),
            source: join.sourceResourceId,
            sourcePort: 'in',
            target: join.targetResourceId,
            targetPort: 'in',
            relationComp: React.createClass({
                render: function () {
                    return React.createElement('div', {
                        style: {
                            fontSize: '12px',
                            paddingTop: 10,
                            paddingLeft: 4
                        },
                        dangerouslySetInnerHTML: {
                            __html: 'Left'
                        }
                    })
                }
            })
        }
    });

    return {nodes: nodes, links: links};
};

function UID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}


function generateNodes(resourcesHolder, ids, joins, column) {
    let nodes = [];

    let nextIds = [];
    ids.map((id) => {
        if (resourcesHolder[id].found) {
            return;
        }
        let resource = resourcesHolder[id];
        let node = {
            id: resource.id,
            type: 'action',
            data: {
                color: 'rgb(85, 85, 85)',
                background: '#E7E7E7',
                name: resource.name,
                inVariables: ['in'],
                column: column,
                resource: resource
            }
        };

        resourcesHolder[id].found = true;
        nodes.push(node);

        joins.map((join) => {
            if (join.sourceResourceId == id) {
                if (nextIds.indexOf(join.targetResourceId) < 0) {
                    nextIds.push(join.targetResourceId);
                }
            }
        })
    });

    if (nextIds.length > 0) {
        nodes = nodes.concat(generateNodes(resourcesHolder, nextIds, joins, column + 1));
    }

    let lastCol = 0;
    let colIndex = 0;
    let _nodes = [];
    nodes.map((node) => {
        if (node.data.column !== lastCol) {
            colIndex = 0;
            lastCol = node.data.column;
        }
        colIndex++;
        node.x = (50 + (node.data.column - 1) * 300);
        node.y = (50 + (colIndex - 1) * 70);

        _nodes.push(node);
    });


    return _nodes;
}

var _layer = {
    "id": "581da8800cf9ffb5d450784c",
    "name": "团队月度计划完成情况",
    "status": "active",
    "fields": [
        {
            "name": "account",
            "label": "日期",
            "type": "String",
            "lookup": {
                "type": "model",
                "model": "Account",
                "source": "id",
                "target": "fullname"
            },
            "resourceId": "58039303992ed55d24675d90",
            "columnName": "account"
        },
        {
            "name": "date",
            "label": "日期",
            "type": "date",
            "resourceId": "58039303992ed55d24675d90",
            "columnName": "date"
        },
        {
            "name": "contracts",
            "label": "签单数",
            "type": "number",
            "resourceId": "58039303992ed55d24675d90",
            "columnName": "contracts"
        },
        {
            "name": "renewals",
            "label": "续费",
            "type": "number",
            "resourceId": "584685babe58b80ed0e37ac6",
            "columnName": "renewals"
        },
        {
            "name": "renewalDate",
            "label": "续费日期",
            "type": "date",
            "resourceId": "584685babe58b80ed0e37ac6",
            "columnName": "date"
        },
        {
            "name": "amount",
            "label": "签单金额",
            "type": "number",
            "expression": "feeservice + feerecharge",
            "resourceId": "58039303992ed55d24675d90"
        },
        {
            "name": "plan_monthly",
            "label": "月度",
            "type": "date",
            "resourceId": "582914d7b442da043b0819f1",
            "columnName": "monthly"
        },
        {
            "name": "plan_contracts",
            "label": "签单数",
            "type": "number",
            "resourceId": "582914d7b442da043b0819f1",
            "columnName": "contracts"
        },
        {
            "name": "plan_amount",
            "label": "签单额",
            "type": "number",
            "resourceId": "582914d7b442da043b0819f1",
            "columnName": "amount"
        },
        {
            "name": "team",
            "label": "团队",
            "lookup": {
                "type": "model",
                "model": "Team",
                "source": "id",
                "target": "name"
            },
            "resourceId": "582914d7b442da043b0819f1",
            "columnName": "team"
        },
        {
            "name": "team_SalesPerformance",
            "label": "团队",
            "lookup": {
                "type": "model",
                "model": "Team",
                "source": "id",
                "target": "name"
            },
            "resourceId": "58039303992ed55d24675d90",
            "columnName": "team"
        },
        {
            "name": "org",
            "label": "部门",
            "lookup": {
                "type": "model",
                "model": "Org",
                "source": "id",
                "target": "name"
            },
            "resourceId": "582914d7b442da043b0819f1",
            "columnName": "org"
        },
        {
            "name": "org_SalesPerformance",
            "label": "部门",
            "lookup": {
                "type": "model",
                "model": "Org",
                "source": "id",
                "target": "name"
            },
            "resourceId": "58039303992ed55d24675d90",
            "columnName": "org"
        },
        {
            "name": "team1",
            "label": "团队",
            "lookup": {
                "type": "model",
                "model": "Team",
                "source": "id",
                "target": "name"
            },
            "resourceId": "584685babe58b80ed0e37ac6",
            "columnName": "team"
        },
        {
            "name": "org1",
            "label": "部门",
            "lookup": {
                "type": "model",
                "model": "Org",
                "source": "id",
                "target": "name"
            },
            "resourceId": "584685babe58b80ed0e37ac6",
            "columnName": "org"
        }
    ],
    "schema": {
        "resources": [
            {
                "id": "58039303992ed55d24675d90",
                "name": "SalesPerformance",
                "columns": [
                    {
                        "name": "org",
                        "type": "String",
                        "label": "org"
                    },
                    {
                        "name": "team",
                        "type": "String",
                        "label": "team"
                    },
                    {
                        "name": "account",
                        "type": "String",
                        "label": "account"
                    },
                    {
                        "name": "date",
                        "type": "Date",
                        "label": "日期（Date）"
                    },
                    {
                        "name": "contracts",
                        "type": "Number",
                        "label": "签单数（Contracts）"
                    },
                    {
                        "name": "feeservice",
                        "type": "Number",
                        "label": "服务费总金额（FeeService）"
                    },
                    {
                        "name": "feerecharge",
                        "type": "Number",
                        "label": "充值费总金额（FeeRecharge)"
                    }
                ],
                "connectionId": "be5220d0-9922-11e6-b58f-fb26be8d31a3"
            },
            {
                "id": "582914d7b442da043b0819f1",
                "name": "SalesTeamMonthlyPlan",
                "columns": [
                    {
                        "name": "org",
                        "type": "String",
                        "label": "org"
                    },
                    {
                        "name": "team",
                        "type": "String",
                        "label": "team"
                    },
                    {
                        "name": "account",
                        "type": "String",
                        "label": "account"
                    },
                    {
                        "name": "monthly",
                        "type": "Date",
                        "label": "月度"
                    },
                    {
                        "name": "contracts",
                        "type": "Number",
                        "label": "签单量"
                    },
                    {
                        "name": "amount",
                        "type": "Number",
                        "label": "签单金额"
                    }
                ],
                "connectionId": "be5220d0-9922-11e6-b58f-fb26be8d31a3"
            },
            {
                "id": "584685babe58b80ed0e37ac6",
                "name": "Renewals",
                "columns": [
                    {
                        "name": "org",
                        "type": "String",
                        "label": "org"
                    },
                    {
                        "name": "team",
                        "type": "String",
                        "label": "team"
                    },
                    {
                        "name": "account",
                        "type": "String",
                        "label": "account"
                    },
                    {
                        "name": "date",
                        "type": "Date",
                        "label": "续费日期"
                    },
                    {
                        "name": "renewals",
                        "type": "Number",
                        "label": "续费金额"
                    },
                    {
                        "name": "rebate",
                        "type": "Number",
                        "label": "续费返点"
                    }
                ],
                "connectionId": "be5220d0-9922-11e6-b58f-fb26be8d31a3"
            }, {
                "id": "584685babe58b80ed0e37ac61",
                "name": "Renewals1",
                "columns": [
                    {
                        "name": "org",
                        "type": "String",
                        "label": "org"
                    },
                    {
                        "name": "team",
                        "type": "String",
                        "label": "team"
                    },
                    {
                        "name": "account",
                        "type": "String",
                        "label": "account"
                    },
                    {
                        "name": "date",
                        "type": "Date",
                        "label": "续费日期"
                    },
                    {
                        "name": "renewals",
                        "type": "Number",
                        "label": "续费金额"
                    },
                    {
                        "name": "rebate",
                        "type": "Number",
                        "label": "续费返点"
                    }
                ],
                "connectionId": "be5220d0-9922-11e6-b58f-fb26be8d31a3"
            }, {
                "id": "584685babe58b80ed0e37ac62",
                "name": "Renewals2",
                "columns": [
                    {
                        "name": "org",
                        "type": "String",
                        "label": "org"
                    },
                    {
                        "name": "team",
                        "type": "String",
                        "label": "team"
                    },
                    {
                        "name": "account",
                        "type": "String",
                        "label": "account"
                    },
                    {
                        "name": "date",
                        "type": "Date",
                        "label": "续费日期"
                    },
                    {
                        "name": "renewals",
                        "type": "Number",
                        "label": "续费金额"
                    },
                    {
                        "name": "rebate",
                        "type": "Number",
                        "label": "续费返点"
                    }
                ],
                "connectionId": "be5220d0-9922-11e6-b58f-fb26be8d31a3"
            }, {
                "id": "584685babe58b80ed0e37ac63",
                "name": "Renewals3",
                "columns": [
                    {
                        "name": "org",
                        "type": "String",
                        "label": "org"
                    },
                    {
                        "name": "team",
                        "type": "String",
                        "label": "team"
                    },
                    {
                        "name": "account",
                        "type": "String",
                        "label": "account"
                    },
                    {
                        "name": "date",
                        "type": "Date",
                        "label": "续费日期"
                    },
                    {
                        "name": "renewals",
                        "type": "Number",
                        "label": "续费金额"
                    },
                    {
                        "name": "rebate",
                        "type": "Number",
                        "label": "续费返点"
                    }
                ],
                "connectionId": "be5220d0-9922-11e6-b58f-fb26be8d31a3"
            }, {
                "id": "584685babe58b80ed0e37ac64",
                "name": "Renewals4",
                "columns": [
                    {
                        "name": "org",
                        "type": "String",
                        "label": "org"
                    },
                    {
                        "name": "team",
                        "type": "String",
                        "label": "team"
                    },
                    {
                        "name": "account",
                        "type": "String",
                        "label": "account"
                    },
                    {
                        "name": "date",
                        "type": "Date",
                        "label": "续费日期"
                    },
                    {
                        "name": "renewals",
                        "type": "Number",
                        "label": "续费金额"
                    },
                    {
                        "name": "rebate",
                        "type": "Number",
                        "label": "续费返点"
                    }
                ],
                "connectionId": "be5220d0-9922-11e6-b58f-fb26be8d31a3"
            }
        ],
        "joins": [
            {
                "sourceResourceId": "58039303992ed55d24675d90",
                "targetResourceId": "582914d7b442da043b0819f1",
                "on": [
                    {
                        "sourceColumnName": "team",
                        "targetColumnName": "team"
                    },
                    {
                        "sourceColumnName": "org",
                        "targetColumnName": "org"
                    }
                ]
            },
            {
                "sourceResourceId": "58039303992ed55d24675d90",
                "targetResourceId": "584685babe58b80ed0e37ac6",
                "on": [
                    {
                        "sourceColumnName": "team",
                        "targetColumnName": "team"
                    },
                    {
                        "sourceColumnName": "org",
                        "targetColumnName": "org"
                    }
                ]
            }, {
                "sourceResourceId": "584685babe58b80ed0e37ac6",
                "targetResourceId": "584685babe58b80ed0e37ac61",
                "on": [
                    {
                        "sourceColumnName": "team",
                        "targetColumnName": "team"
                    },
                    {
                        "sourceColumnName": "org",
                        "targetColumnName": "org"
                    }
                ]
            }, {
                "sourceResourceId": "584685babe58b80ed0e37ac61",
                "targetResourceId": "584685babe58b80ed0e37ac62",
                "on": [
                    {
                        "sourceColumnName": "team",
                        "targetColumnName": "team"
                    },
                    {
                        "sourceColumnName": "org",
                        "targetColumnName": "org"
                    }
                ]
            }, {
                "sourceResourceId": "584685babe58b80ed0e37ac62",
                "targetResourceId": "584685babe58b80ed0e37ac63",
                "on": [
                    {
                        "sourceColumnName": "team",
                        "targetColumnName": "team"
                    },
                    {
                        "sourceColumnName": "org",
                        "targetColumnName": "org"
                    }
                ]
            }, {
                "sourceResourceId": "584685babe58b80ed0e37ac63",
                "targetResourceId": "584685babe58b80ed0e37ac64",
                "on": [
                    {
                        "sourceColumnName": "team",
                        "targetColumnName": "team"
                    },
                    {
                        "sourceColumnName": "org",
                        "targetColumnName": "org"
                    }
                ]
            }
        ]
    },
    "ownerId": "161d1da0-935c-11e6-928f-6d453320d6ef",
    "ownerType": "Org",
    "created": "2016-11-14T02:18:06.255Z",
    "modified": "2016-12-13T12:24:41.613Z",
    "title": "团队月度计划完成情况"
};

module.exports.GenerateNodeAndLink = GenerateNodeAndLinkByLayer;
module.exports.layer = _layer;
module.exports.removeResource = function (layer, id) {
    let resources = layer.schema.resources;
    resources.map((resource, index) => {
        if (resource.id == id) {
            resources.splice(index, 1);
        }
    });
    layer.schema.resources = resources;

    let joins = layer.schema.joins;
    for (var i = 0; i < joins.length; i++) {
        let value = joins[i];
        if (value.sourceResourceId == id || value.targetResourceId == id) {
            joins.splice(i, 1);
            i--;
        }
    }

    layer.schema.joins = joins;

    return layer;
};
