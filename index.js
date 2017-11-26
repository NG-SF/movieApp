let $title = $('.title');
let $searchResults = $('.js-search-results');
let $btn = $('.js-btn');
let $youTube = $('.outputYouTube');
let $links = $('.js-links');
let $movieDB = $('.outputMovieDB');
let $stats = $('.movie-stats');

//holds entered search parameters to be accessed by:
// showYouTube and showMovieDB functions
let keyword;

// variables for youtube
// have to be in global scope for other functions to work:
// showYouTube, nextVideo, prevVideo
let nextPage;
let prevPage;
const youTubeUrl = 'https://www.googleapis.com/youtube/v3/search';
let query_string = {
  key: 'AIzaSyCO8RyYtOZdiagQfhfTzOC45IfbDQ0ovnc',
  part: 'snippet',
  maxResults: '3'
};

//variables for dataMovieDB to display prev next results
let dataMovieDB;
let index = 0;
let oneMovie;

//responsible for saving search parameters and showing first results
function submit() {
  $('.js-search-form').submit(event => {
    //stop default form submittion
    event.preventDefault();

    //store entered search parameters
    keyword = $('#search').val();

    $('#search').val(''); // clear out the input field

    //display YouTube results first
    showYouTube();
  });
}

//open close additional resourses
function showLinks() {
  $('.links-btn').bind('click keypress', function() {
    //hide other results
    $searchResults.empty();
    $title.text('Useful links');
    $movieDB.prop('hidden', true);
    $links.prop('hidden', false);

    //highlight the selected btn
    $btn.removeClass('selected');
    let btn = $(this);
    btn.addClass('selected');
  });
}

//generates YouTube data
function displayYouTubeData(json) {
  // console.log(json);
  nextPage = json.nextPageToken;
  prevPage = json.prevPageToken;
  const results = json.items.map((item, index) => {
    return `<div class='result'>
      <h3>${item.snippet.title}</h3>
      <a class="js-result-link" data-title='${item.snippet.title}' data-videoId="${item.id.videoId}">
      <img class='youTube-img' src='${item.snippet.thumbnails.medium.url}' alt='${item.snippet.title}'></a>
    </div>`;
  });

  //display results on page
  $youTube.prop('hidden', false);
  $searchResults
    .prop('hidden', false)
    .empty()
    .html(results);

  //function to display YouTube videos in a lightbox
  videoClick();
}

//displays YouTube data on page
function showYouTube() {
  //hide other results
  $links.prop('hidden', true);
  $movieDB.prop('hidden', true);
  $searchResults.empty();

  //highlight the selected btn
  $btn.removeClass('selected');
  $('.youTube-btn').addClass('selected');

  $title.text('YouTube search results: 3 per page');
  query_string.q = `${keyword} Official`;

  //make sure user entered search text
  if (keyword === '' || keyword === undefined) {
    $title.text('Please enter movie title');
  } else {
    $.getJSON(youTubeUrl, query_string, displayYouTubeData);
  }
}

//when btn clicked displays YouTube data on page
function btnYouTube() {
  $('.youTube-btn').bind('click keypress', function() {
    showYouTube();
  });
}

//responsible for showing next video results for youTube
function nextVideo() {
  $('.js-btn-next-YT').on('click', function() {
    query_string.pageToken = nextPage;
    $.getJSON(youTubeUrl, query_string, displayYouTubeData);
  });
}

//responsible for showing previous video results for youTube
function prevVideo() {
  $('.js-btn-prev-YT').on('click', function() {
    query_string.pageToken = prevPage;
    $.getJSON(youTubeUrl, query_string, displayYouTubeData);
  });
}

// functions that controls a lightbox for youTube videos
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
  $('.movieDB-btn').bind('click keypress', function() {
    const settings = {
      async: true,
      crossDomain: true,
      url: 'https://api.themoviedb.org/3/search/movie',
      method: 'GET',
      data: {
        api_key: '1c120a2d8083e4d23e0041d9c85797fe',
        language: 'en-US',
        query: keyword
      }
    };
    //hide other results
    $links.prop('hidden', true);
    $youTube.prop('hidden', true);
    $movieDB.prop('hidden', true);
    $searchResults.prop('hidden', true);
    $title.empty();

    //highlight the selected btn
    $btn.removeClass('selected');
    let btn = $(this);
    btn.addClass('selected');

    //make sure user entered search text
    if (keyword === '' || keyword === undefined) {
      $title.text('Please enter movie title');
    } else {
      $movieDB.prop('hidden', false);
      $title.text('Movie DB results');
      $.ajax(settings)
        .done(displayMovieDBdata)
        .fail(function(xhr, status, errorThrown) {
          // alert('Sorry, there was a problem!');
          console.log('Error: ' + errorThrown);
          console.log('Status: ' + status);
          console.dir(xhr);
        });
    }
  });
}

function displayMovieDBdata(json) {
  let output = json.results.map(item => {
    return `<div class='result'>
      <h2>${item.original_title}</h2>
      <img class='movieDB-img' src="https://image.tmdb.org/t/p/original/${item.poster_path}" width="300"  alt="image for ${item.original_title}">
      <p><span class='bold'>Release date:</span> ${item.release_date}</p>
      <p><span class='bold'>Total votes:</span> ${item.vote_count}</p>
      <p><span class='bold'>Average vote:</span> ${item.vote_average}</p>
      <p><span class='bold'>Description:</span>  ${item.overview}</p>
      <a href="https://www.themoviedb.org/" target='_blank'>Go to The Movie Database site</a>
      </div>`;
  }); // end of output

  index = 0;
  dataMovieDB = output;
  oneMovie = dataMovieDB[index];
  $searchResults
    .prop('hidden', false)
    .empty()
    .html(oneMovie);
  stats();
  if (output.length === 0) {
    $title.text('Sorry nothing was found :(');
    $movieDB.prop('hidden', true);
  }
}

//displays statistics about results for movieDB
function stats() {
  $stats.text(`Page: ${index + 1} out of ${dataMovieDB.length}`);
}

//responsible for showing next results for movieDB
function nextMovie() {
  $('.btn-next').on('click', function() {
    if (index < dataMovieDB.length - 1) {
      index += 1;
      oneMovie = dataMovieDB[index];
      $searchResults.empty().html(oneMovie);
      stats();
    }
  });
}

//responsible for showing previous results for movieDB
function prevMovie() {
  $('.btn-prev').on('click', function() {
    if (index > 0) {
      index -= 1;
      oneMovie = dataMovieDB[index];
      $searchResults.empty().html(oneMovie);
      stats();
    }
  });
}

//display Movie DB results by popularity
function discoverMovieDB() {
  $('.discoverDB-btn').bind('click keypress', function() {
    const param = {
      async: true,
      crossDomain: true,
      url: 'https://api.themoviedb.org/3/discover/movie',
      method: 'GET',
      data: {
        api_key: '1c120a2d8083e4d23e0041d9c85797fe',
        language: 'en-US'
      }
    };
    //hide other results
    $links.prop('hidden', true);
    $youTube.prop('hidden', true);
    $title.text('Popular movies on Movie DB');

    //highlight the selected btn
    $btn.removeClass('selected');
    let btn = $(this);
    btn.addClass('selected');

    $movieDB.prop('hidden', false);
    $.ajax(param)
      .done(displayMovieDBdata)
      .fail(function(xhr, status, errorThrown) {
        // alert('Sorry, there was a problem!');
        console.log('Error: ' + errorThrown);
        console.log('Status: ' + status);
        console.dir(xhr);
      });
  });
}

//responsible for resetting search and clearing output field
function startOver() {
  $('.startOver-btn').bind('click keypress', function() {
    keyword = '';
    $btn.removeClass('selected');
    $links.prop('hidden', true);
    $youTube.prop('hidden', true);
    $searchResults.prop('hidden', true).empty();
    $movieDB.prop('hidden', true);
    $title.text('Search results will be displayed below');
  });
}

function init() {
  submit();
  btnYouTube();
  nextVideo();
  prevVideo();
  showLinks();
  showMovieDB();
  discoverMovieDB();
  nextMovie();
  prevMovie();
  startOver();
}

$(init);
