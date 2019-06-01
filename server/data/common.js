// 构建查询数据
let localLang = "zh_CN";
let dataString =
    localLang === "zh_CN"
        ? "上海品依信息科技有限公司"
        : "Shanghai PinYi Technology Co.,Ltd.";
let categoryTitle = localLang === "zh_CN" ? "订单类型" : "OrderType";
let dataStringLength = dataString.length;
let category = [];
let statusCount = 4;
while (statusCount > 0) {
    let dataCount = parseInt(4 + Math.random() * 15);
    let categoryItemID = "status-" + statusCount;
    let categoryItem = {
        id: categoryItemID,
        title: categoryTitle,
        data: [{id:'ALL',title:'全部'}]
    };
    while (dataCount > 0) {
        let dataItem = {
            id: categoryItemID + "-" + dataCount
        };
        let start = parseInt((dataStringLength - 4) * Math.random());
        let dataTitle = dataString.substr(
            start,
            1 + parseInt(dataStringLength * Math.random())
        );
        let dataSubTitle = parseInt(Math.random() * 300);
        dataItem.title = dataTitle;
        if (statusCount === 4) {
            dataItem.subTitle = dataSubTitle;
        }
        categoryItem.data.push(dataItem);
        dataCount--;
    }
    category.push(categoryItem);
    statusCount--;
}


module.exports={
    searchCategory:category,
    select:[
        {
            code:"001",
            name:'备选一'
        },
        {
            code:"002",
            name:'备选二'
        },
        {
            code:"003",
            name:'备选三'
        },
        {
            code:"004",
            name:'备选四'
        },
        {
            code:"005",
            name:'备选五'
        },
    ]
}


