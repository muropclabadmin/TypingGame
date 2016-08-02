import {StringUtil} from './StringUtil';

var sampleStr: string[] = [
  "ＡＢＣＤ０１２３４",
  "　",
  "あいうえお",
  "アイウエオ",
  "aa\n nnnnnnnbbbb\n fff",
  "aa<br> nnnnnnn<BR />bbbb<br/> fff"
];

sampleStr.forEach(element => {
  console.log("----------");
  console.log(element);
  console.log(StringUtil.kana2hira(element, true));
  console.log(StringUtil.nl2br(element));
  console.log(StringUtil.br2nl(element));
});
