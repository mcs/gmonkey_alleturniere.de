// ==UserScript==
// @name        alleturniere.de Umsortierung
// @namespace   http://alleturniere.de/*
// @description Sortiert Ergebniszeilen um
// @include     http://alleturniere.de/sport/teammatch.aspx?id=*
// @grant       none
// @version     0.1
// ==/UserScript==

var tbody = document.querySelector("table.matches > tbody"),
    rows = document.querySelectorAll("table.matches > tbody > tr");

// Umsortierung der 8 Spiele passend zum Victor-Spielbogen
if (rows.length === 8) {
    tbody.appendChild(rows[2]);
    tbody.appendChild(rows[0]);
    tbody.appendChild(rows[1]);
    tbody.appendChild(rows[7]);
    tbody.appendChild(rows[6]);
    tbody.appendChild(rows[5]);
    tbody.appendChild(rows[3]);
    tbody.appendChild(rows[4]);
}
