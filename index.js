const youTubeUrl = 'https://www.googleapis.com/youtube/v3/search';
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
  $('.js-search-results')
    .prop('hidden', false)
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
      query_string.q = `What the Flick ${query} Official Movie Review`;
      $.getJSON(youTubeUrl, query_string, displaySearchData);
    }
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

  // $('.lightbox').bind('keypress', function(e) {
  //   if (e.which === 27 || e.which === 13) {
  //     hideLightbox();
  //   }
  // });

  $('.close-btn, .overlay').bind('click', function() {
    hideLightbox();
    activeElement.focus();
  });
}

//open close boxofficemojo
function boxOfficeMojo() {
  $('.mojo-btn').click(function() {
    $('.mojo').prop('hidden', false);
  });
}

function init() {
  submit();
  nextVideo();
  prevVideo();
  boxOfficeMojo();
}

$(init);
