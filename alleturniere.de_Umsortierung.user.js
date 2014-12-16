// ==UserScript==

// @name        AlleTurniere.de Umsortierung
// @namespace   https://github.com/mcs/*
// @description Sortiert Ergebniszeilen um
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js
// @require     http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.24/jquery-ui.min.js
// @include     */sport/teammatch.*
// @include     */sport/matchresult.*
// @grant       unsafeWindow
// @grant       GM_deleteValue
// @grant       GM_getValue
// @grant       GM_setValue
// @author      Marcus Krassmann
// @version     0.3
// ==/UserScript==

(function ($) {
    "use strict";

    var page = window.location.href,
        tableBodyXPath,
        tableRowXPath,
        $tableBody,
        $tableRows,
        grayBackground = false;

    function puck($rows) {
        if (grayBackground) {
            $rows.each(function (index) {
                $(this).toggleClass('gray', index % 2 === 1);
            });
        }
    }

    // allows to load pre-saved settings from user's local browser
    function saveRowLayout() {
        var indexes = [];
        $tableBody.children(tableRowXPath).each(function (index, element) {
            indexes[index] = $tableRows.index(element);
        });

        GM_setValue("rowLayout", JSON.stringify(indexes));
        console.log("Saved order: %o", indexes);
        alert("Neues Layout gespeichert.");
    }

    function rearrangeTableRows(arrangeArray) {
        var $barrier = $('<tr id="barrierRow"/>'),
            $initialFirstRow = $($tableRows.get(0));
        $barrier.insertBefore($initialFirstRow);
        $barrier = $("#barrierRow");
        for (var i = 0; i < arrangeArray.length; i += 1) {
            $barrier.before($tableRows.get(arrangeArray[i]));
        }
        $barrier.remove();
        puck($tableBody.children(tableRowXPath));
        console.log("Table rows rearranged!");
    }

    function loadRowLayoutAndRearrange() {
        var val = GM_getValue("rowLayout");
        if (val) {
            rearrangeTableRows(JSON.parse(val));
        }
    }

    function addButtonToSaveLayout() {
        var $button = $('<input id="saveRowLayout" type="button" class="button" value="Zeilenlayout speichern"/>');
        var $btnResetSubMatches = $("#btnResetSubMatches");
        var $tableTeammatch = $(".ruler.matches");
        if ($btnResetSubMatches.size() > 0) {
            $btnResetSubMatches.before($button);
        } else if ($tableTeammatch) {
            $tableTeammatch.append($button);
        } else {
            $tableBody.parent().before($button);
        }
        $("#saveRowLayout").on("click", function (e) {
            e.preventDefault();
            saveRowLayout();
        });
    }

    // do initialization after DOM is loaded
    $(function () {
        if (page.indexOf("teammatch") > -1) {
            tableBodyXPath = 'table.matches > tbody';
            tableRowXPath = 'tr';
        } else if (page.indexOf("matchresult") > -1) {
            tableBodyXPath = 'fieldset.matchresult > table > tbody';
            tableRowXPath = 'tr[id^="itemrow"]';
            grayBackground = true;
        } else {
            console.warn("href neither contains 'teammatch' nor 'matchresult'. No sorting applied.");
            return;
        }
        $tableBody = $(tableBodyXPath);
        $tableRows = $tableBody.children(tableRowXPath);

        // make page sortable
        $tableBody.sortable({
            items: tableRowXPath,
            update: function (event, ui) {
                puck(ui.item.parent().children(tableRowXPath));
            }
        });

        loadRowLayoutAndRearrange();
        addButtonToSaveLayout();
    });

    console.log("AlleTurniere.de Sortierung gestartet!");
})(jQuery);


(function enforceCorrectGenderForMixed($) {
    "use strict";

    function disableByInnerText(elem, stringPattern) {
        $(elem).prop("disabled", this.innerText.indexOf(stringPattern) > -1);
    }

    if (window.location.href.indexOf("matchresult") > -1) {
        var $trows = $('fieldset.matchresult > table > tbody > tr[id^="itemrow"]');
        $trows.find("th").each(function () {
            var $th = $(this);
            // Suche Zeile mit dem gemischten Doppel
            if ($th.text() === 'GD') {
                // Erst einen Herren auswaehlen (oben Damen deaktivieren)
                $th.parent().find('select[name$="p1"] > option').each(function () {
                    $(this).prop("disabled", this.innerText.indexOf("(F, ") > -1);
                });
                // Danach die Dame auswaehlen (unten Herren deaktivieren)
                $th.parent().find('select[name$="p2"] > option').each(function () {
                    $(this).prop("disabled", this.innerText.indexOf("(M, ") > -1);
                });
            }
        });
    }

    console.log("AlleTurniere.de Mixed-Reihenfolge gestartet!");
})(jQuery);


(function resultsWithMouse($) {
    // Taken and adapted from http://userscripts-mirror.org/scripts/review/75852
    "use strict";

    var objBody,
        objScorebox,
        field,
        click_behavier;

    /* show box to select score */
    function show_score_select() {
        var objScorebox = document.getElementById('scorebox');
        objScorebox.style.display = '';

        objScorebox.style.top = (self.pageYOffset + (window.innerHeight / 2) - 200) + 'px'; // (self.pageYOffset + 100) + 'px';
        objScorebox.style.left = (self.pageXOffset + (window.innerWidth / 2) - 200) + 'px'; // (self.pageXOffset + 150) + 'px';
    }

    function addGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }

    objBody = document.getElementsByTagName("body").item(0);
    objScorebox = document.createElement("div");
    objScorebox.setAttribute('id', 'scorebox');
    objScorebox.setAttribute('style', 'padding: 0 15px; width:420px; height:530px; display:none; font-size: 101%; line-height:200%; background-color:#FCF7EF; border:2px solid #FF9900; position:absolute; z-Index:102; -moz-border-radius: 10px;');
    objScorebox.innerHTML =
        '<div style="text-align: right; height: 22px; margin: 4px 4px -4px 0;"><a style="color: #FF9900;" href="" onclick="' + "document.getElementById('scorebox').style.display='none'; return false;" + '">X</a></div>'
            + '<table id="score_select_table" style="font-weight: bold; width: 100%; margin: 20px 0 5px 0;">'
            + '<tr><td>21-9</td><td>21-19</td><td>30-29</td><td>29-30</td><td>19-21</td><td>9-21</td></tr>'
            + '<tr><td>21-8</td><td>21-18</td><td>30-28</td><td>28-30</td><td>18-21</td><td>8-21</td></tr>'
            + '<tr><td>21-7</td><td>21-17</td><td>29-27</td><td>27-29</td><td>17-21</td><td>7-21</td></tr>'
            + '<tr><td>21-6</td><td>21-16</td><td>28-26</td><td>26-28</td><td>16-21</td><td>6-21</td></tr>'
            + '<tr><td>21-5</td><td>21-15</td><td>27-25</td><td>25-27</td><td>15-21</td><td>5-21</td></tr>'
            + '<tr><td>21-4</td><td>21-14</td><td>26-24</td><td>24-26</td><td>14-21</td><td>4-21</td></tr>'
            + '<tr><td>21-3</td><td>21-13</td><td>25-23</td><td>23-25</td><td>13-21</td><td>3-21</td></tr>'
            + '<tr><td>21-2</td><td>21-12</td><td>24-22</td><td>22-24</td><td>12-21</td><td>2-21</td></tr>'
            + '<tr><td>21-1</td><td>21-11</td><td>23-21</td><td>21-23</td><td>11-21</td><td>1-21</td></tr>'
            + '<tr><td>21-0</td><td>21-10</td><td>22-20</td><td>20-22</td><td>10-21</td><td>0-21</td></tr>'
            + '<tr><td>-</td></tr>'
            + '</table>'
            + '</div>';
    objBody.appendChild(objScorebox);

    addGlobalStyle('#score_select_table td { font-size: 16px !important; line-height:200%; text-align:center; padding: 5px 5px; background-color: #F3F0E5; border:2px solid #FCF7EF;');
    addGlobalStyle('#score_select_table td:hover { cursor: pointer; background-color: #FFFFEF; }');

    $('input[type="text"]').on("dblclick", function (e) {
        field = e.target;
        show_score_select();
    });

    $('#score_select_table').find('td').on("click", function (e) {
        var str = this.innerText;
        field.value = str !== '-' ? str : '';
        $("#scorebox").toggle();
//        document.getElementById('scorebox').style.display = 'none';
    });

    console.log("AlleTurniere.de Ergebniseingabe gestartet!");
})(jQuery);

