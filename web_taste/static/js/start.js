"use strict";

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var quest = void 0;

// import * as Plotly from "plotly.js";
// import $ from 'jquery';


$(function () {
    $(".status").hide();
    $(".done").hide();
    $(".download-report").hide();
    var button_yes = $("#button-yes");
    var button_no = $("#button-no");
    var button_download = $("#button-download-report");

    button_yes.prop("disabled", true);
    button_no.prop("disabled", true);
    button_download.prop("disabled", true);

    button_yes.click(function () {
        quest_update(quest.attributes._nextIntensity, 1);
    });

    button_no.click(function () {
        quest_update(quest.attributes._nextIntensity, 0);
    });

    $("#button-start").click(function () {
        var participant = $("#participant").val();
        var substance = $("#substance").val();
        var session = $("#session").val();

        button_yes.prop("disabled", false);
        button_no.prop("disabled", false);

        $.ajax({
            url: "/start/quest/participant=" + participant + "&substance=" + substance + "&session=" + session,
            data: "",
            type: "POST",
            success: function success(response) {
                quest = response;
                $("#trial").text(quest.attributes.thisTrialN);
                $("#session-name").text(quest.attributes.extraInfo.session);
                $(".start").hide();
                $(".status").show();
                plot("fig-staircase-procedure");
            },
            error: function error(_error) {
                console.log(_error);
            }
        });
    });
});

function quest_update(intensity, participant_response) {
    $.ajax({
        url: "/quest/update/intensity=" + intensity + "&response=" + participant_response,
        data: JSON.stringify(quest),
        type: "POST",
        contentType: "application/json; charset=utf-8",
        success: function success(response) {
            quest = response;
            $("#trial").text(quest.attributes.thisTrialN);
            $("#session-name").text(quest.attributes.extraInfo.session);

            plot("fig-staircase-procedure");

            if (quest.attributes.finished) {
                $("#button-yes").prop("disabled", true);
                $("#button-no").prop("disabled", true);
                $("#button-download-report").prop("disabled", false);
                $(".done").fadeIn();
                $(".download-report").fadeIn();
            }
        },
        error: function error(_error2) {
            console.log(_error2);
        }
    });
}

function plot(fig) {
    var responses = quest.attributes.data;
    var intensities = quest.attributes.intensities;

    Plotly.purge("fig-staircase-procedure");

    var response_trace = {
        x: [].concat(_toConsumableArray(new Array(responses.length + 1).keys())),
        y: intensities
    };

    var next_intensity_trace = void 0;

    if (!quest.attributes.finished) {
        next_intensity_trace = {
            x: [responses.length],
            y: [intensities[intensities.length - 1]]
        };
    } else {
        next_intensity_trace = {
            x: [],
            y: []
        };
    }

    var data = [response_trace, next_intensity_trace];

    var layout = {
        title: "Participant " + quest.attributes.extraInfo.participant + "<br>" + quest.attributes.extraInfo.substance + ", Session: " + quest.attributes.extraInfo.session,
        showlegend: false,
        // margin: { t: 0 },
        xaxis: {
            title: "Trial",
            titlefont: {
                size: 18
            },
            rangemode: "tozero"
        },
        yaxis: {
            title: "Concentration",
            titlefont: {
                size: 18
            }
        }
    };

    Plotly.plot(fig, data, layout);
}
