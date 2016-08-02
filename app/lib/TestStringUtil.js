"use strict";
var StringUtil_1 = require('./StringUtil');
var sampleStr = [
    "ＡＢＣＤ０１２３４",
    "　",
    "あいうえお",
    "アイウエオ",
    "aa\n nnnnnnnbbbb\n fff",
    "aa<br> nnnnnnn<BR />bbbb<br/> fff"
];
sampleStr.forEach(function (element) {
    console.log("----------");
    console.log(element);
    console.log(StringUtil_1.StringUtil.kana2hira(element, true));
    console.log(StringUtil_1.StringUtil.nl2br(element));
    console.log(StringUtil_1.StringUtil.br2nl(element));
});
//# sourceMappingURL=TestStringUtil.js.map