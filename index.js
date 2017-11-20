const youTubeUrl = 'https://www.googleapis.com/youtube/v3/search';
let nextPage;
let prevPage;

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

    let query = $('#search').val();
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
//shows and closes lightbox when clicked on image
function videoClick() {
  $('.js-result-link').click(function() {
    $('.lightbox').removeClass('hidden');
    $('.overlay').removeClass('hidden');

    let videoId = $(this).attr('data-videoId');

    $('iframe').attr('src', `https://www.youtube.com/embed/${videoId}`);
  });

  $('.close-btn, .overlay').click(function() {
    $('.lightbox').addClass('hidden');
    $('.overlay').addClass('hidden');
    $('iframe').attr('src', '');
  });
}

function init() {
  submit();
  nextVideo();
  prevVideo();
}

$(init);
