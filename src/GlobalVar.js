/**
 * infinite程序内部全局变量
 */

var GlobalVar = {
    displayArray : [],
    filterButton : [],
    SOUNDFILE : null,
    pp : null,
    alignState : false,
    attractPtL : null,
    attractPtR : null,
    countPerRow : 10,   //align模式时，每行的button数量
    cellSize : 70,    //align模式时，button与button之间的间距
    select : 0,
    translate : {
        x : 0,
        y : 0,
        currentPage : 0
    },
    transTarget : {
        x : 0,
        y : 0,
        totalPage : 0
    },
    scrollDis : 400,
    navigationBarHeight : 50,
    width : 0,
    height : 0
};

module.exports = GlobalVar;