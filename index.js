const youTubeUrl = 'https://www.googleapis.com/youtube/v3/search';

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
  // console.log(json);
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
function btnYouTube() {
  $('.youTube-btn').bind('click keypress', function() {
    showYouTube();
  });
}

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

//display Movie DB results
function showMovieDB() {
  const settings = {
    async: true,
    crossDomain: true,
    url: 'https://api.themoviedb.org/3/search/movie',
    method: 'GET',
    data: {
      api_key: '1c120a2d8083e4d23e0041d9c85797fe',
      language: 'en-US',
      query: 'Thor'
    }
  };
  $.ajax(settings)
    .done(displayMovieDBdata)
    .fail(function(xhr, status, errorThrown) {
      // alert('Sorry, there was a problem!');
      console.log('Error: ' + errorThrown);
      console.log('Status: ' + status);
      console.dir(xhr);
    });
}

function displayMovieDBdata(json) {
  // console.log(json);
  const output = json.results.map((item, index) => {
    return `<div class='result'>
      <h3>${item.original_title}</h3>
      <img src="https://image.tmdb.org/t/p/original/${item.poster_path}" width="300"  alt="image for ${item.original_title}">
      <p>Release date: ${item.release_date}</p>
      <p>Total votes: ${item.vote_count}  Average vote: ${item.vote_average}</p>
      <p>${item.overview}</p>
    </div>`;
  });

  $youTube.prop('hidden', false);
  $searchResults
    .prop('hidden', false)
    .empty()
    .html(output);
}

function init() {
  submit();
  btnYouTube();
  nextVideo();
  prevVideo();
  boxOfficeMojo();
  showLinks();
  showMovieDB();
}

$(init);
