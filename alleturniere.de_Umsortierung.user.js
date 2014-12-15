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
    "use strict";

    console.log("AlleTurniere.de Ergebniseingabe gestartet!");
})(jQuery);

