const youTubeUrl = 'https://www.googleapis.com/youtube/v3/search';
const nyTimesUrl = 'http://api.nytimes.com/svc/movies/v2/reviews/search.json';
let title = $('.title');
let $searchResults = $('.js-search-results');
let $mojo = $('.mojo');
let $btn = $('.js-btn');
let $youTube = $('.outputYouTube');
let nextPage;
let prevPage;
let keyword;

// for youtube
let query_string = {
  key: 'AIzaSyCO8RyYtOZdiagQfhfTzOC45IfbDQ0ovnc',
  part: 'snippet',
  maxResults: '3'
};

//responsible for saving search parameters and showing first results
function submit() {
  $('.js-search-form').submit(event => {
    //stop default form submittion
    event.preventDefault();
    //store entered search parameters
    keyword = $('#search').val();
    $('#search').val(''); // clear out the input field

    console.log(keyword);
    showYouTube();
  });
}

//open close boxofficemojo
function boxOfficeMojo() {
  $('.mojo-btn').click(function() {
    $searchResults.empty();
    $('.js-links, .output').prop('hidden', true);
    $mojo.prop('hidden', false);
    $btn.removeClass('selected');
    let btn = $(this);
    btn.addClass('selected');
  });
}

//open close additional resourses
function showLinks() {
  $('.links-btn').bind('click keypress', function() {
    $searchResults.empty();
    $mojo.prop('hidden', true);
    $btn.removeClass('selected');
    let btn = $(this);
    btn.addClass('selected');
    $('.js-links').prop('hidden', false);
  });
}

//first to appear when search is submitted
function displayYouTubeData(json) {
  console.log(json);
  nextPage = json.nextPageToken;
  prevPage = json.prevPageToken;
  const results = json.items.map((item, index) => {
    return `<div class='result'>
      <h3>${item.snippet.title}</h3>
      <a class="js-result-link" data-videoId="${item.id.videoId}">
      <img class='js-img' src='${item.snippet.thumbnails.medium.url}'></a>
    </div>`;
  });
  $youTube.prop('hidden', false);
  $searchResults
    .prop('hidden', false)
    .empty()
    .html(results);
  videoClick();
}

//shows trailers
function showYouTube() {
  $btn.removeClass('selected');
  $('.youTube-btn').addClass('selected');
  $mojo.prop('hidden', true);
  title.text('Movie trailers');
  query_string.q = `${keyword} Official`;
  $.getJSON(youTubeUrl, query_string, displayYouTubeData);
}

// when button clicked shows trailers
$('.youTube-btn').bind('click keypress', function() {
  youTubeAll();
});

//responsible for showing next video results for youTube
function nextVideo() {
  $('.js-btn-next').on('click', function() {
    query_string.pageToken = nextPage;
    $.getJSON(youTubeUrl, query_string, displayYouTubeData);
  });
}

//responsible for showing previous video results for youTube
function prevVideo() {
  $('.js-btn-prev').on('click', function() {
    query_string.pageToken = prevPage;
    $.getJSON(youTubeUrl, query_string, displayYouTubeData);
  });
}

function showLightbox() {
  $('.lightbox')
    .removeClass('hidden')
    .prop('hidden', false);
  $('.overlay')
    .removeClass('hidden')
    .prop('hidden', false);
}

function hideLightbox() {
  $('.lightbox')
    .addClass('hidden')
    .prop('hidden', true);
  $('.overlay')
    .addClass('hidden')
    .prop('hidden', true);
  $('iframe').attr('src', '');
}

// hides lightbox when esc key pressed
$(document).keyup(function(e) {
  if (e.keyCode == 27) {
    hideLightbox();
  }
});

//responsible for operating lightbox when image is selected
function videoClick() {
  let activeElement;
  $('.js-result-link').bind('click keypress', function() {
    activeElement = $(this);
    showLightbox();

    let videoId = $(this).attr('data-videoId');
    let title = $(this).attr('data-title');
    $('iframe')
      .attr('src', `https://www.youtube.com/embed/${videoId}?autoplay=1`)
      .attr('title', title);
  });

  $('.close-btn, .overlay').bind('click', function() {
    hideLightbox();
    activeElement.focus();
  });
}

// controls NYTimes btn and displaying results
function timesReview() {
  $('.times-btn').on('click', function() {
    $btn.removeClass('selected');
    $('.times-btn').addClass('selected');
    $('$mojo, $youTube').prop('hidden', true);
    title.text('New York Times Movie Review');
    let url =
      nyTimesUrl +
      '?' +
      $.param({
        'api-key': 'ac6d2fc1eccd48968269726ccb92d3c7'
      });

    $.ajax({
      url: url,
      method: 'GET',
      data: {
        query: `${keyword}`
      }
    })
      .done(displayNYTimesData)
      .fail(function(err) {
        throw err;
      });
  });
}

function displayNYTimesData(json) {
  console.log(json, json.results.length);

  const results = json.results.map((item, index) => {
    return `<div class='result'>
      <h3>${item.display_title}</h3>
      <p>${item.publication_date}</p>
      <p>${item.headline}</p>
      <p>${item.summary_short}</p>
      <a class="js-result-link" href="${item.link.url}" target="_blank">Read full article</a>
    </div>`;
  });
  // <img src="${item.multimedia.src}" alt="image for ${item.display_title}">
  if (json.results.length === 0) {
    $youTube.prop('hidden', false);
    $searchResults.prop('hidden', false).empty();
    title.text('Sorry, nothing was found');
  } else {
    $youTube.prop('hidden', false);
    $searchResults
      .prop('hidden', false)
      .empty()
      .html(results)
      .append(json.copyright);
  }
}

function init() {
  submit();
  nextVideo();
  prevVideo();
  boxOfficeMojo();
  showLinks();
  timesReview();
}

$(init);
