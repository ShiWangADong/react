import React from "react";
import { injectIntl } from "react-intl";
import { Table, Alert } from "antd";

import PySearch from "../../components/PySearch";
import ControlBar from "../../components/ControlBar";
import { postJsonData, spinPostData } from "../../core/api";

class CanvasTable extends React.Component {
    constructor(props) {
        super(props);
        // 状态
        this.state = {
            dataSource: props.dataSource || [],
            searchParams: {}, // PySearch组件的查找参数
            tableState: {
                current: 1,
                pageSize: 10
            }, // Table组件的filter、sort、pagination数据
            pagination: {
                total: 0,
                showTotal: (total, range) => {
                    return this.props.intl.formatMessage(
                        { id: "page.common.pagination.total" },
                        {
                            start: range[0],
                            end: range[1],
                            total
                        }
                    );
                },
                showSizeChanger: true,
                showQuickJumper: true
            },
            showTableLoading: false
        };
    }

    componentWillReceiveProps(nextProps) {
        const { dataSource } = nextProps;
        if (dataSource && dataSource.length > 0) {
            this.setState({
                dataSource: nextProps.dataSource
            });
        }
    }

    componentDidMount() {
        const { serverUrl } = this.props;
        if (serverUrl && serverUrl.list) {
            this.getServerData();
        }
    }

    // 导出数据
    exportTableData = ( 
        url = this.props.serverUrl.export,
        fileName = "EXPORT_" + new Date().getTime() + ".xlsx",
        params = {},
        config = {}
    ) => {
        let { searchParams } = this.state;
        let postParams = Object.assign({}, searchParams, params);
        spinPostData(url, { ...postParams }, config)
            .then(response => {
                return response.blob();
            })
            .then(fileBlob => {
                if (window.navigator.msSaveOrOpenBlob) {
                    window.navigator.msSaveOrOpenBlob(fileBlob, fileName);
                } else {
                    var blobUrl = URL.createObjectURL(fileBlob);
                    var save_link = document.createElementNS(
                        "http://www.w3.org/1999/xhtml",
                        "a"
                    );
                    save_link.href = blobUrl;
                    save_link.download = fileName;
                    save_link.style.display = "none";
                    document.body.appendChild(save_link);
                    save_link.click();
                    document.body.removeChild(save_link);
                }
            })
            .catch(error => {
                console.log(error);
            });
    };

    // 从服务器获取数据
    getServerData = () => {
        this.setState({ showTableLoading: true });
        let params = Object.assign(
            {},
            this.state.tableState,
            this.state.searchParams
        );
        postJsonData(this.props.serverUrl.list, params).then(
            resp => {
                this.setState({ showTableLoading: false });
                let pagination = Object.assign({}, this.state.pagination);
                pagination.total = resp.totalCount;
                this.setState({
                    dataSource: resp.records
                });
                this.setState({
                    pagination
                });
            },
            () => {
                this.setState({ showTableLoading: false });
            }
        );
    };

    // 表格排序、翻页等功能时的回调
    onTableStateChange = (pagination, filters, sorter) => {
        let { pageSize, current } = pagination;
        let tableState = {
            pageSize,
            current,
            sortOrder: sorter.order,
            sortField: sorter.field,
            ...filters
        };
        this.setState(
            {
                tableState,
                pagination: { ...this.state.pagination, current }
            },
            this.getServerData
        );
    };

    // 查询数据变化的回调
    onTableSearchChange = searchParams => {
        let { tableState, pagination } = this.state;
        tableState.current = 1;
        pagination.current = 1;
        // 修改查找模型数据
        this.setState(
            {
                searchParams,
                tableState,
                pagination
            },
            this.getServerData
        );
    };

    // 更新row的数据，如果key找到，则修改，否则则添加
    updateTableRowData = (newRow, manageType, rowKey) => {
        let that = this;
        let { tableRowKey } = this.props;
        let key = rowKey || newRow[tableRowKey];
        const newData = [...that.state.dataSource];
        const { pagination } = this.state;
        const pageSize = pagination.pageSize;
        let total = pagination.total;
        const index = newData.findIndex(item => key === item[tableRowKey]);
        if (index > -1) {
            const item = newData[index];
            if (manageType === "delete") {
                newData.splice(index, 1);
                total--;
            } else {
                newData.splice(index, 1, {
                    ...item,
                    ...newRow
                });
            }
        } else {
            // 添加前先删除最后一条
            if (pageSize <= newData.length) {
                newData.pop();
            }
            newData.splice(0, 0, newRow);
            total++;
        }
        pagination.total = total;
        that.setState({
            dataSource: newData,
            editingKey: "",
            pagination,
            showTableLoading: false
        });
    };

    render() {
        const {
            searchConfig,
            tableTooltip,
            controlBarConfig,
            expandedRowRender,
            tableColumns,
            tableRowKey,
            rowSelection,
            pagination = this.state.pagination
        } = this.props;
        return (
            <div className="wrapper-main-body">
                {searchConfig ? (
                    <PySearch
                        searchTableAction={this.onTableSearchChange}
                        configData={searchConfig}
                    />
                ) : null}
                <div className="container wrapper-table-container">
                    {controlBarConfig ? (
                        <ControlBar configData={controlBarConfig} />
                    ) : null}
                    {tableTooltip ? (
                        <Alert
                            className="table-select-info"
                            message={tableTooltip}
                            type="info"
                            showIcon
                        />
                    ) : null}
                    <Table
                        rowClassName="cus-table-row"
                        rowSelection={rowSelection}
                        loading={this.state.showTableLoading}
                        expandedRowRender={expandedRowRender}
                        pagination={pagination}
                        rowKey={tableRowKey}
                        columns={tableColumns}
                        dataSource={this.state.dataSource}
                        onChange={this.onTableStateChange}
                    />
                    {this.props.children}
                </div>
            </div>
        );
    }
}

export default injectIntl(TablePage, { withRef: true });
