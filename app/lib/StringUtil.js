"use strict";
/**
 * 文字列を操作するユーティリティ
 * 参考：JavaScriptで正規表現（文字列置換え編） - Qiita(http://qiita.com/hrdaya/items/291276a5a20971592216)
 * 参考：JavaScript の文字系メソッド備忘録 - Qiita(http://qiita.com/hanagejet/items/5ab7f272a7c3031ddbb3#_reference-61b6f59a4566ce44f6a9)
 *
 * @param {String} str 変換したい文字列
 */
var StringUtil = (function () {
    function StringUtil() {
    }
    /**
     * 改行をBRタグに変換
     *
     * @param {String} str 変換したい文字列
     */
    StringUtil.nl2br = function (str) {
        var str = str.replace(/\r\n/g, '<br/>');
        str = str.replace(/[\r\n]/g, '<br/>');
        return str;
    };
    ;
    /**
     * BRタグを改行に変換（BRの大文字・小文字の区別なし）
     *
     * @param {String} str 変換したい文字列
     */
    StringUtil.br2nl = function (str) {
        return str.replace(/<br ?\/?>/gi, '\n');
    };
    ;
    /**
     * タブをnum文字のスペースに変換
     *
     * @param {String} str 変換したい文字列
     * @param {Number} num スペースの文字数（デフォルトは4）
     */
    StringUtil.tab2space = function (str, num) {
        //num = parseInt(num, 10);
        var space = new Array(isNaN(num) ? 5 : num + 1).join(' ');
        return str.replace(/\t/g, space);
    };
    ;
    /**
     * スネークケースからキャメルケースに変換
     *
     * アンダースコア、ハイフン、半角スペースを変換
     * 先頭の区切り文字は削除
     * 変換前にある文字列中の大文字は変換されないので注意
     *
     * 「abc-def」→「abcDef」
     * 「abc-dEF」→「abcDEF」（変換前の大文字はそのまま）
     *
     * @param {String} str 変換したい文字列
     * @param {Boolean} upper アッパーキャメルケースにするかどうか
     */
    StringUtil.snake2camel = function (str, upper) {
        str = str
            .replace(/^[\-_ ]/g, "")
            .replace(/[\-_ ]./g, function (match) {
            return match.charAt(1).toUpperCase();
        });
        return upper === true ?
            str.replace(/^[a-z]/g, function (match) {
                return match.toUpperCase();
            }) : str;
    };
    ;
    /**
     * キャメルケースからスネークケースに変換
     *
     * 先頭の連続した大文字は大文字の最後尾とそれ以外に分解される
     * 最後尾の連続した大文字はひとつのまとまりとして変換される
     *
     * ABCDEF → abcdef
     * abcDef → abc-def
     * AbcDef → abc-def
     * DEFClass → def-class（先頭の連続した大文字は分解）
     * classID → class-id（最後尾の連続した大文字はひとつのまとまりとして変換）
     *
     * @param {String} str 変換したい文字列
     * @param {String} separator 区切り文字（デフォルトはハイフン）
     */
    StringUtil.camel2snake = function (str, separator) {
        separator = separator === undefined ? "-" : separator;
        return str
            .replace(/^[A-Z]+$/, function (match) {
            return match.toLowerCase();
        })
            .replace(/^[A-Z]+/, function (match) {
            if (match.length > 1) {
                return match.replace(/[A-Z]$/, function (m) {
                    return separator + m.toLowerCase();
                }).toLowerCase();
            }
            else {
                return match.toLowerCase();
            }
        })
            .replace(/[A-Z]+$/g, function (match) {
            return separator + match.toLowerCase();
        })
            .replace(/[A-Z]/g, function (match) {
            return separator + match.toLowerCase();
        });
    };
    ;
    /**
     * ひらがなを全角カタカナに変換
     *
     * 濁音・半濁音のある場合一文字に変換するかは今後の課題
     *
     * 以下の文字は結合してカタカナに変換
     * 「う゛」→「ヴ」
     * 「わ゛」→「ヷ」
     * 「ゐ゛」→「ヸ」
     * 「ゑ゛」→「ヹ」
     * 「を゛」→「ヺ」
     * 「ゝ゛」→「ヾ」
     *
     * @param {String} str 変換したい文字列
     * @param {Boolean} opt 小文字の「ゕ」「ゖ」を変換するかどうか falseを指定した場合は変換なし
     */
    StringUtil.hira2kana = function (str, opt) {
        str = str
            .replace(/[ぁ-ゔ]/g, function (s) {
            return String.fromCharCode(s.charCodeAt(0) + 0x60);
        })
            .replace(/ﾞ/g, '゛')
            .replace(/ﾟ/g, '゜')
            .replace(/(ウ゛)/g, 'ヴ')
            .replace(/(ワ゛)/g, 'ヷ')
            .replace(/(ヰ゛)/g, 'ヸ')
            .replace(/(ヱ゛)/g, 'ヹ')
            .replace(/(ヲ゛)/g, 'ヺ')
            .replace(/(ゝ゛)/g, 'ヾ')
            .replace(/ゝ/g, 'ヽ')
            .replace(/ゞ/g, 'ヾ');
        if (opt !== false) {
            str = str.replace(/ゕ/g, 'ヵ').replace(/ゖ/g, 'ヶ');
        }
        return str;
    };
    ;
    /**
     * 全角カタカナをひらがなに変換
     *
     * 濁音・半濁音のある場合一文字に変換するかは今後の課題
     *
     * 以下の文字を結合・展開
     * 「ウ゛」→「ゔ」
     * 「ヷ」→「わ゛」
     * 「ヸ」→「ゐ゛」
     * 「ヹ」→「ゑ゛」
     * 「ヺ」→「を゛」
     * 「ヽ゛」→「ゞ」
     *
     * ひらがなに無いカタカナは変換しない
     * 「ㇰ」「ㇱ」「ㇲ」「ㇳ」「ㇴ」「ㇵ」「ㇶ」「ㇷ」
     * 「ㇸ」「ㇹ」「ㇺ」「ㇻ」「ㇼ」「ㇽ」「ㇾ」「ㇿ」
     *
     * @param {String} str 変換したい文字列
     * @param {Boolean} opt 小文字の「ヵ」「ヶ」を変換するかどうか falseを指定した場合は変換なし
     */
    StringUtil.kana2hira = function (str, opt) {
        str = str
            .replace(/[ァ-ヴ]/g, function (s) {
            return String.fromCharCode(s.charCodeAt(0) - 0x60);
        })
            .replace(/ﾞ/g, '゛')
            .replace(/ﾟ/g, '゜')
            .replace(/(う゛)/g, 'ゔ')
            .replace(/ヷ/g, 'わ゛')
            .replace(/ヸ/g, 'ゐ゛')
            .replace(/ヹ/g, 'ゑ゛')
            .replace(/ヺ/g, 'を゛')
            .replace(/(ヽ゛)/g, 'ゞ')
            .replace(/ヽ/g, 'ゝ')
            .replace(/ヾ/g, 'ゞ');
        if (opt !== false) {
            str = str.replace(/ヵ/g, 'ゕ').replace(/ヶ/g, 'ゖ');
        }
        return str;
    };
    ;
    /**
     * 半角カタカナを全角カタカナに変換
     *
     * @param {String} str 変換したい文字列
     */
    StringUtil.hankana2zenkana = function (str) {
        var kanaMap = {
            'ｶﾞ': 'ガ', 'ｷﾞ': 'ギ', 'ｸﾞ': 'グ', 'ｹﾞ': 'ゲ', 'ｺﾞ': 'ゴ',
            'ｻﾞ': 'ザ', 'ｼﾞ': 'ジ', 'ｽﾞ': 'ズ', 'ｾﾞ': 'ゼ', 'ｿﾞ': 'ゾ',
            'ﾀﾞ': 'ダ', 'ﾁﾞ': 'ヂ', 'ﾂﾞ': 'ヅ', 'ﾃﾞ': 'デ', 'ﾄﾞ': 'ド',
            'ﾊﾞ': 'バ', 'ﾋﾞ': 'ビ', 'ﾌﾞ': 'ブ', 'ﾍﾞ': 'ベ', 'ﾎﾞ': 'ボ',
            'ﾊﾟ': 'パ', 'ﾋﾟ': 'ピ', 'ﾌﾟ': 'プ', 'ﾍﾟ': 'ペ', 'ﾎﾟ': 'ポ',
            'ｳﾞ': 'ヴ', 'ﾜﾞ': 'ヷ', 'ｦﾞ': 'ヺ',
            'ｱ': 'ア', 'ｲ': 'イ', 'ｳ': 'ウ', 'ｴ': 'エ', 'ｵ': 'オ',
            'ｶ': 'カ', 'ｷ': 'キ', 'ｸ': 'ク', 'ｹ': 'ケ', 'ｺ': 'コ',
            'ｻ': 'サ', 'ｼ': 'シ', 'ｽ': 'ス', 'ｾ': 'セ', 'ｿ': 'ソ',
            'ﾀ': 'タ', 'ﾁ': 'チ', 'ﾂ': 'ツ', 'ﾃ': 'テ', 'ﾄ': 'ト',
            'ﾅ': 'ナ', 'ﾆ': 'ニ', 'ﾇ': 'ヌ', 'ﾈ': 'ネ', 'ﾉ': 'ノ',
            'ﾊ': 'ハ', 'ﾋ': 'ヒ', 'ﾌ': 'フ', 'ﾍ': 'ヘ', 'ﾎ': 'ホ',
            'ﾏ': 'マ', 'ﾐ': 'ミ', 'ﾑ': 'ム', 'ﾒ': 'メ', 'ﾓ': 'モ',
            'ﾔ': 'ヤ', 'ﾕ': 'ユ', 'ﾖ': 'ヨ',
            'ﾗ': 'ラ', 'ﾘ': 'リ', 'ﾙ': 'ル', 'ﾚ': 'レ', 'ﾛ': 'ロ',
            'ﾜ': 'ワ', 'ｦ': 'ヲ', 'ﾝ': 'ン',
            'ｧ': 'ァ', 'ｨ': 'ィ', 'ｩ': 'ゥ', 'ｪ': 'ェ', 'ｫ': 'ォ',
            'ｯ': 'ッ', 'ｬ': 'ャ', 'ｭ': 'ュ', 'ｮ': 'ョ',
            '｡': '。', '､': '、', 'ｰ': 'ー', '｢': '「', '｣': '」', '･': '・'
        };
        var reg = new RegExp('(' + Object.keys(kanaMap).join('|') + ')', 'g');
        return str
            .replace(reg, function (match) {
            return kanaMap[match];
        })
            .replace(/ﾞ/g, '゛')
            .replace(/ﾟ/g, '゜');
    };
    ;
    /**
     * 全角から半角に置き換え
     *
     * 全角チルダ、全角波ダッシュ共に半角チルダに変換
     * 全角ハイフン、全角ダッシュ、全角マイナス記号は半角ハイフンに変換
     * 長音符は半角ハイフンに含めない（住所の地名等に使用される為）
     *
     * 今は良いがUnicode 8.0で波ダッシュの形が変わるみたいなので、波ダッシュを変換に
     * 含めるべきかどうかは検討が必要
     *
     * @param {String} str 変換したい文字列
     * @param {Boolean} tilde チルダ falseを指定した場合は変換なし
     * @param {Boolean} mark 記号 falseを指定した場合は変換なし
     * @param {Boolean} hankana 半角カナ記号 trueを指定した場合のみ変換
     * @param {Boolean} space スペース falseを指定した場合は変換なし
     * @param {Boolean} alpha 英字 falseを指定した場合は変換なし
     * @param {Boolean} num 数字 falseを指定した場合は変換なし
     */
    StringUtil.zen2han = function (str, tilde, mark, hankana, space, alpha, num) {
        if (alpha !== false) {
            str = str.replace(/[Ａ-Ｚａ-ｚ]/g, function (s) {
                return String.fromCharCode(s.charCodeAt(0) - 65248);
            });
        }
        if (num !== false) {
            str = str.replace(/[０-９]/g, function (s) {
                return String.fromCharCode(s.charCodeAt(0) - 65248);
            });
        }
        if (mark !== false) {
            var reg = /[！＂＃＄％＆＇（）＊＋，－．／：；＜＝＞？＠［＼］＾＿｀｛｜｝]/g;
            str = str.replace(reg, function (s) {
                return String.fromCharCode(s.charCodeAt(0) - 65248);
            }).replace(/[‐－―]/g, '-');
        }
        if (tilde !== false) {
            str = str.replace(/[～〜]/g, '~');
        }
        if (space !== false) {
            str = str.replace(/　/g, ' ');
        }
        if (hankana === true) {
            var map = { '。': '｡', '、': '､', '「': '｢', '」': '｣', '・': '･' };
            var reg = new RegExp('(' + Object.keys(map).join('|') + ')', 'g');
            str = str.replace(reg, function (match) {
                return map[match];
            });
        }
        return str;
    };
    ;
    /**
     * 半角から全角に置き換え
     *
     * チルダは全角チルダに変換
     *
     * @param {String} str 変換したい文字列
     * @param {Boolean} tilde チルダ falseを指定した場合は変換なし
     * @param {Boolean} mark 記号 falseを指定した場合は変換なし
     * @param {Boolean} hankana 半角カナ記号 falseを指定した場合は変換なし
     * @param {Boolean} space スペース falseを指定した場合は変換なし
     * @param {Boolean} alpha 英字 falseを指定した場合は変換なし
     * @param {Boolean} num 数字 falseを指定した場合は変換なし
     */
    StringUtil.han2zen = function (str, tilde, mark, hankana, space, alpha, num) {
        if (alpha !== false) {
            str = str.replace(/[A-Za-z]/g, function (s) {
                return String.fromCharCode(s.charCodeAt(0) + 65248);
            });
        }
        if (num !== false) {
            str = str.replace(/\d/g, function (s) {
                return String.fromCharCode(s.charCodeAt(0) + 65248);
            });
        }
        if (mark !== false) {
            var reg = /[!"#\$%&'\(\)\*\+,\-\.\/:;<=>\?@\[\\\]\^_`\{\|\}]/g;
            str = str.replace(reg, function (s) {
                return String.fromCharCode(s.charCodeAt(0) + 65248);
            });
        }
        if (tilde !== false) {
            str = str.replace(/~/g, '～');
        }
        if (space !== false) {
            str = str.replace(/ /g, '　');
        }
        if (hankana !== false) {
            var map = { '｡': '。', '､': '、', '｢': '「', '｣': '」', '･': '・' };
            var reg = new RegExp('(' + Object.keys(map).join('|') + ')', 'g');
            str = str.replace(reg, function (match) {
                return map[match];
            });
        }
        return str;
    };
    ;
    /**
     * 一文字で表記される文字を複数文字に展開する
     * 会社名等を入力する欄でこれは入れないでほしいな～と思う文字
     *
     * @param {String} str 変換する文字列
     */
    StringUtil.one2multi = function (str) {
        var map = {
            '㈱': '(株)', '㈲': '(有)', '㈳': '(社)', '㈵': '(特)',
            '㈶': '(財)', '㈻': '(学)', '㈼': '(監)', '㍿': '株式会社'
        };
        var reg = new RegExp('(' + Object.keys(map).join('|') + ')', 'g');
        return str.replace(reg, function (match) {
            return map[match];
        });
    };
    /**
     * 改行の削除
     *
     * @param {String} str 変換したい文字列
     */
    StringUtil.removeNl = function (str) {
        var str = str.replace(/\r\n/g, '');
        str = str.replace(/[\r\n]/g, '');
        return str;
    };
    ;
    /**
     * 全角スペースを含めたトリム
     * 「m」フラグを使用すると連続した改行が削除されることへの対策版
     *
     * @param {String} str 変換する文字列
     * @param {Boolean} multipleLines 各行ごとにトリムするかどうか（trueの時のみ各行トリム）
     * @param {Boolean} useBlankLine 空行を使用するかどうか（falseの時は空行削除）
     */
    StringUtil.trim = function (str, multipleLines, useBlankLine) {
        var retString;
        var reg = /^[\s　]+|[　\s]+$/g;
        if (multipleLines === true) {
            if (useBlankLine === false) {
                retString = str.replace(/^[\s　]+|[　\s]+$/gm, '');
            }
            else {
                retString = str
                    .split('\n')
                    .map(function (line) {
                    return line.replace(reg, '');
                })
                    .join('\n')
                    .replace(reg, '');
            }
        }
        else {
            retString = str.replace(reg, '');
        }
        return retString;
    };
    ;
    /**
     * 全角スペースを含めた右トリム
     * 「m」フラグを使用すると連続した改行が削除されることへの対策版
     *
     * @param {String} str 変換する文字列
     * @param {Boolean} multipleLines 各行ごとにトリムするかどうか（trueの時のみ各行トリム）
     * @param {Boolean} useBlankLine 空行を使用するかどうか（falseの時は空行削除）
     */
    StringUtil.rtrim = function (str, multipleLines, useBlankLine) {
        var reg = /[　\s]+$/g;
        if (multipleLines === true) {
            if (useBlankLine === false) {
                str = str
                    .replace(/[　\s]+$/gm, '')
                    .replace(/^\n+/g, '');
            }
            else {
                str = str
                    .split('\n')
                    .map(function (line) {
                    return line.replace(reg, '');
                })
                    .join('\n')
                    .replace(reg, '');
            }
        }
        else {
            str = str.replace(reg, '');
        }
        return str;
    };
    ;
    /**
     * 全角スペースを含めた左トリム
     * 「m」フラグを使用すると連続した改行が削除されることへの対策版
     *
     * @param {String} str 変換する文字列
     * @param {Boolean} multipleLines 各行ごとにトリムするかどうか（trueの時のみ各行トリム）
     * @param {Boolean} useBlankLine 空行を使用するかどうか（falseの時は空行削除）
     */
    StringUtil.ltrim = function (str, multipleLines, useBlankLine) {
        var reg = /^[\s　]+/g;
        if (multipleLines === true) {
            if (useBlankLine === false) {
                str = str
                    .split('\n')
                    .map(function (line) {
                    return line.replace(reg, '');
                })
                    .join('\n')
                    .replace(reg, '')
                    .replace(/[\n\n]+/g, '\n')
                    .replace(/\n+$/g, '');
            }
            else {
                var split = str.split('\n');
                str = split.map(function (line) {
                    return line.replace(reg, '');
                }).join('\n').replace(reg, '');
            }
        }
        else {
            str = str.replace(reg, '');
        }
        return str;
    };
    ;
    return StringUtil;
}());
exports.StringUtil = StringUtil;
//# sourceMappingURL=StringUtil.js.map