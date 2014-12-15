// ==UserScript==

// @name        alleturniere.de Umsortierung
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
// @version     0.2
// ==/UserScript==

(function ($) {
    "use strict";

    var page = window.location.href,
        tableBodyXPath,
        tableRowXPath,
        $tableBody,
        $tableRows;

    if (page.indexOf("teammatch") !== -1) {
        tableBodyXPath = 'table.matches > tbody';
        tableRowXPath = 'tr';
    } else if (page.indexOf("matchresult") !== -1) {
        tableBodyXPath = 'fieldset.matchresult > table > tbody';
        tableRowXPath = 'tr[id^="itemrow"]';
    }
    $tableBody = $(tableBodyXPath);
    $tableRows = $tableBody.children(tableRowXPath);

    // make page sortable
    $tableBody.sortable({
        items: tableRowXPath
    });

    // allow to load pre-saved settings from user's local machine
    function saveRowLayout() {
        var indexes = [];
        $tableBody.children(tableRowXPath).each(function (index, element) {
            indexes[index] = $tableRows.index(element);
        });

        GM_setValue("rowLayout", JSON.stringify(indexes));
        console.log("Saved order: %o", indexes);
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
        console.log("Table rows rearranged!");
    }

    function loadRowLayoutAndRearrange() {
        var val = GM_getValue("rowLayout");
        if (val) {
            rearrangeTableRows(JSON.parse(val));
        }
    }

    (function addButtonToSaveLayout() {
        var $button = $('<button id="saveRowLayout">Zeilenlayout speichern</button>');
        $tableBody.parent().before($button);
        $("#saveRowLayout").on("click", function (e) {
            e.preventDefault();
            saveRowLayout();
        });
    }());

    $(function init() {
        loadRowLayoutAndRearrange();
    });

    console.log("AlleTurniere.de Sortierung gestartet!");
})(jQuery);

