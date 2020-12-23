$(document).ready(function() {
  const urls = [
    'https://www.kontests.net/api/v1/sites',
    'https://www.kontests.net/api/v1/all'
  ]

  Promise.all(urls.map(url =>
    fetch(url)
      .then(checkStatus)
      .then(parseJSON)
  ))
  .then(data => {
    sites = data[0];
    contests = data[1];

    for(var i = 0; i < sites.length; ++i) {
      site = sites[i];

      var site_contests = [];
      for(var j = 0; j < contests.length; ++j) {
        if(contests[j]['site'] == site[0]) {
          site_contests.push(contests[j]);
        }
      }

      if(site_contests.length == 0) {
        continue;
      }

      constructSiteView(site, site_contests, i);
    }
  })
  .then(function() {
    $("#circle").remove();
    $("#wait").css("display", "inline");
  })
  .then(function () {
      $('[data-toggle="tooltip"]').tooltip()
  })
});

function checkStatus(response) {
  if (response.ok) {
    return Promise.resolve(response);
  } else {
    return Promise.reject(new Error(response.statusText));
  }
}

function parseJSON(response) {
  return response.json();
}

function constructSiteView(site, site_contests, index) {
  addPill(site, site_contests.length, index);

  [future, future_tbody, running, running_tbody] = constructTablesBodies(site_contests);

  var future_table = constructTable(future, future_tbody, 'future');
  var running_table = constructTable(running, running_tbody, 'running');

  site_view = $("<div>", {
    "class": "tab-pane fade" + (index == 0 ? " show active" : ""),
    "id": "pills-" + site[1],
    "role": "tabpanel",
    "aria-labelledby": "pills-" + site[1] + "-tab",
    "html": future_table
  });
  $("<br />").appendTo(site_view);
  running_table.appendTo(site_view);
  site_view.appendTo(".tab-content");
}

function addPill(site, contests_num, index) {
  $("<li>", {
    "class": "nav-item",
    "html": $("<a>", {
      "class": "nav-link" + (index == 0 ? " active" : ""),
      "id": "pills-" + site[1] + "-tab",
      "data-toggle": "pill",
      "href": "#pills-" + site[1],
      "role": "tab",
      "aria-controls": "pills-" + site[1],
      "aria-selected": "true",
      "html": site[0] + " &nbsp;<span class=\"badge badge-pill badge-secondary\">" + contests_num + "</span>"
    })
  }).appendTo(".nav-pills");
}

function constructTablesBodies(site_contests) {
  var future = 0;
  var future_tbody = "<tbody>";
  var running = 0;
  var running_tbody = "<tbody>";

  for(var j = 0; j < site_contests.length; ++j) {
    contest = site_contests[j];

    temp_text = "";

    if(contest["in_24_hours"] == "Yes") {
      temp_text = "<tr class=\"in-24-hours\">";
    } else {
      temp_text = "<tr>";
    }

    temp_text += "<td>"

    if(contest["status"] == "BEFORE") {
      add_to_calendar = "https://calendar.google.com/event?action=TEMPLATE&dates=" + contest['start_time'] + "/" + contest['end_time'] + "&text=" + contest["name"] + "&location=" + contest['url'];
      add_to_calendar = formatCalendarUrl(add_to_calendar)
      add_to_calendar = "<a class=\"add-to-calendar\" data-toggle=\"tooltip\" data-placement=\"top\" title=\"Add to Calendar\" target=\"_blank\" href=\"" + add_to_calendar + "\"><i class=\"far fa-calendar-alt\"></i></a> &nbsp;";
      temp_text += add_to_calendar
    }

    temp_text += "<a href=" + contest["url"] + ">" + contest["name"] + "</a></td><td>" + localTimeFromUtc(contest["start_time"]) + "</td><td>" + durationToText(contest["duration"]) + "</td></tr>";

    if(contest["status"] === "BEFORE") {
      ++future;
      future_tbody += temp_text;
    } else {
      ++running;
      running_tbody += temp_text;
    }
  }

  return [future, future_tbody, running, running_tbody];
}

function constructTable(contests_num, table_tbody, table_type) {
  table_thead = "<thead class=\"border-top border-bottom\"><tr><th>Name</th><th>Start time</th><th>Duration</th></tr></thead>";

  var table = $("<div>", {
    "class": table_type + " bg-secondary",
    "html": $("<div>", {
      "class": "table-responsive",
      "html": $("<table>", {
        "class": "table table-borderless table-hover mb-0",
        "html": (contests_num > 0 ? table_thead : "") + table_tbody
      })
    })
  });

  if(contests_num == 0) {
    $("<p>", {
      "class": "lead text-center pt-3 pb-3 mb-0",
      "html": "There are no " + table_type + " contests :("
    }).prependTo(table);
  } else {
    $("<p>", {
      "class": "lead text-center pt-3 pb-3 mb-0",
      "html": contests_num + " " + capitalize(table_type) + " Contest" + (contests_num > 1 ? "s" : "")
    }).prependTo(table);
  }

  return table;
}

function formatCalendarUrl(url) {
  url = url.slice(0, 60) + url.slice(61, 63) + url.slice(64, 69) + url.slice(70, 72) + url.slice(73, 75) + url.slice(79);
  url = url.slice(0, 77) + url.slice(78, 80) + url.slice(81, 86) + url.slice(87, 89) + url.slice(90, 92) + url.slice(96);
  text_index = url.indexOf('&text=') + 6;
  location_index = url.indexOf('&location=');
  name = url.slice(text_index, location_index);
  name = name.replace('#', '%23');
  name = name.replace('&', '%26');
  name = name.replace('+', '%2B');
  name = name.replace('?', '%3F');
  url = url.slice(0, text_index) + name + url.slice(location_index);
  return url;
}

function localTimeFromUtc(utcTime) {
  if(utcTime === '-') return '-';

  var givenDate = new Date(utcTime);
  var localDateString = DateFormat.format.date(givenDate, 'dd MMM yyyy HH:mm');
  return localDateString;
}

function durationToText(duration) {
  if(duration === '-') return '-';

  seconds = parseInt(duration);

  days = Math.floor(seconds / (24 * 60 * 60));
  days_s = 'days';
  if(days == 1) days_s = 'day';
  seconds %= (24 * 60 * 60);

  hours = Math.floor(seconds / (60 * 60));
  hours = ('0' + hours).slice(-2);
  seconds %= (60 * 60);

  minutes = Math.floor(seconds / 60);
  minutes = ('0' + minutes).slice(-2);

  if(days > 0)
    return `${days} ${days_s} and ${hours}:${minutes}`;
  else
    return `${hours}:${minutes}`;
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}