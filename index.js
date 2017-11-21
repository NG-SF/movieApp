const youTubeUrl = 'https://www.googleapis.com/youtube/v3/search';
let title = $('.title');
let nextPage;
let prevPage;
let query;

// channelId: 'UCwTcFaOYFjIbxHjrmP0ptxw',
let query_string = {
  part: 'snippet',
  key: 'AIzaSyCO8RyYtOZdiagQfhfTzOC45IfbDQ0ovnc',
  maxResults: '1'
};

function displaySearchData(json) {
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
  $('.output').prop('hidden', false);
  $('.js-search-results')
    .prop('hidden', false)
    .empty()
    .html(results);
  videoClick();
}

//responsible for saving search parameters and showing first results
function submit() {
  $('.js-search-form').submit(event => {
    event.preventDefault();

    query = $('#search').val();
    console.log(query);
    $('#search').val(''); // clear out the input field

    //check if user entered search parameters
    //if fiels is empty ask for input
    if (query === '' || query === undefined) {
      $('.js-search-results').html(`<p>Please enter what you want to search for</p>`);
    } else {
      youTubeAll();
    }
  });
}

function youTube() {
  $('.youTube-btn').bind('click keypress', function() {
    $('.btn').removeClass('selected');
    $('.youTube-btn').addClass('selected');
    $('.mojo').prop('hidden', true);
    title.text('Movie review from What the Flick YouTube channel');
    query_string.q = `What the Flick ${query} Official Movie Review`;
    $.getJSON(youTubeUrl, query_string, displaySearchData);
  });
}

//shows trailers
function youTubeAll() {
  $('.js-btn').removeClass('selected');
  $('.youTubeAll-btn').addClass('selected');
  $('.mojo').prop('hidden', true);
  title.text('Movie trailers');
  query_string.q = `${query} Official Movie trailer`;
  query_string.maxResults = '5';
  $.getJSON(youTubeUrl, query_string, displaySearchData);
}

// when button clicked shows trailers
$('.youTubeAll-btn').bind('click keypress', function() {
  youTubeAll();
});

//open close boxofficemojo
function boxOfficeMojo() {
  $('.mojo-btn').click(function() {
    $('.js-search-results').empty();
    $('.js-links').prop('hidden', true);
    $('.mojo').prop('hidden', false);
    title.text('This weekend top 5 movies:');
    $('.js-btn').removeClass('selected');
    let btn = $(this);
    btn.addClass('selected');
  });
}

function showLinks() {
  $('.links-btn').bind('click keypress', function() {
    $('.js-search-results').empty();
    $('.mojo').prop('hidden', true);
    $('.js-btn').removeClass('selected');
    let btn = $(this);
    btn.addClass('selected');
    $('.js-links').prop('hidden', false);
  });
}

//responsible for showing next video results
function nextVideo() {
  $('.js-btn-next').on('click', function() {
    query_string.pageToken = nextPage;
    $.getJSON(youTubeUrl, query_string, displaySearchData);
  });
}

//responsible for showing previous video results
function prevVideo() {
  $('.js-btn-prev').on('click', function() {
    query_string.pageToken = prevPage;
    $.getJSON(youTubeUrl, query_string, displaySearchData);
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

function init() {
  submit();
  nextVideo();
  prevVideo();
  boxOfficeMojo();
  showLinks();
}

$(init);
