let oldSearchTitle = "";
let oldSearchResults;
let movieYears = {};
let yearsForFiltering = {};
let moviesFilteredByYear;
let checkboxesVisible = false;

// Show movies on submit
$(document).ready(() => {
    $('#searchForm').on('submit', (e) => {
        const searchTitle = $('#searchTitle').val();
        
        if(oldSearchTitle == searchTitle){
            console.log(typeof oldSearchResults);
            console.log("searching for the same thing?");

            showMovies(oldSearchResults);
        }else{
            getMovies(searchTitle);
        }
  
        e.preventDefault();
    });
});

// Get movies from api using title
function getMovies(searchTitle){
    oldSearchTitle = searchTitle;
    
    axios.get('http://www.omdbapi.com/?apikey=ff0be5a3&s='+searchTitle)
        .then((response) => {
            console.log(response);
            const movies = response.data.Search;
            oldSearchResults = movies;
            // Add all available years to object
            $.each(movies, (index, movie) => {
                movieYears[movie.Year] = movie.Year;
            });
            showMovies(movies);          
        })
        .catch((err) => {
            console.log(err); 
        });
}

// Display movies on page
function showMovies(movies){
    $('.main').css("margin-top", "5%");
    $('hr').css("display", "block");
    let output = "";
    let img = "";
    $.each(movies, (index, movie) => {
        output += `
            <div class="poster col-md-3 mt-3" onclick="movieSelected('${movie.imdbID}')">
                <div class="card border-info mb-3" style="width: 13rem;">
                <img class="image img-thumbnail" src="${movie.Poster}">
                <div class="middle btn-info">
                    <h4 class="title">${movie.Title}<br>${movie.Year}</h4>
                </div>
                </div>
            </div>
        `;
    });

    $('#movies').html(output);
    if(!checkboxesVisible){
        showCheckbox();
    }
}

// Filter movies by year
function filterMoviesByYear(filterYear){
    
    if(yearsForFiltering[filterYear]){
        delete yearsForFiltering[filterYear];
    }else{
        yearsForFiltering[filterYear] = filterYear;
    }

    moviesFilteredByYear = oldSearchResults.filter((movie) => {
        return (movie.Year in yearsForFiltering);
    });

    if(Object.keys(yearsForFiltering).length <= 0){
        showMovies(oldSearchResults);
    }else{
        showMovies(moviesFilteredByYear);
    }

}

// Show checkboxes
function showCheckbox(){
    let chkbox = "";
    $.each(movieYears, (index, year) => {

        chkbox += `
        <div class="form-check col-md-4 col-sm-6 p-1">
            <input type="checkbox" class="form-check-input" id="year" onchange="filterMoviesByYear(${year})">
            <label class="form-check-label" for="year">${(year.length > 4 ? ("'" + year.substring(2, 4) + '-' + year.slice(-2)) : year)}</label>
        </div>
    `
    });
    $('#yearCheckboxes').html(chkbox);
    checkboxesVisible = true;
}

// Get id of selected movie and save it as a session
function movieSelected(id){
    sessionStorage.setItem('movieId', id);
    window.location = 'movie.html';
    return false;
}

// Get single movie details using id saved session
function getMovie(){
    const movieId =  sessionStorage.getItem('movieId');
    console.log(movieId);
    axios.get('http://www.omdbapi.com/?apikey=ff0be5a3&i='+movieId)
        .then((response) => {
            console.log(response);
            const movie = response.data;

            let output = "";

            if(movie.Poster == "N/A"){
                img = `<img class="image img-thumbnail" src="https://static.lyricsbogie.com/wp-content/uploads/2015/05/No-Poster97.jpg">`;
            }else{
                img = `<img class="image img-thumbnail" src="${movie.Poster}" alt="poster image">`;
            }

            output +=`
                <div class="row">
                    <div class="col-md-4">
                        <div class="card bg-light">
                        ${img}
                        </div>     
                    </div>

                    <div class="col-md-8 mt-2">
                        <h2>${movie.Title} 
                        <a type="button" class="btn btn-warning" href="http://imdb.com/title/${movie.imdbID}" target="_blank">
                            <strong class="text-dark">IMDb</strong> <span class="badge badge-light">${movie.imdbRating}</span>
                        </a>
                        </h2>
                        <hr>
                        <ul class="list-group">
                            <li class="list-group-item"><span class="text-dark">Genre:</span> ${movie.Genre}</li>
                            <li class="list-group-item"><span class="text-dark">Released:</span> ${movie.Released}</li>
                            <li class="list-group-item"><span class="text-dark">Rated:</span> ${movie.Rated}</li>
                            <li class="list-group-item"><span class="text-dark">Director:</span> ${movie.Director}</li>
                            <li class="list-group-item"><span class="text-dark">Writer:</span> ${movie.Writer}</li>
                            <li class="list-group-item"><span class="text-dark">Actors:</span> ${movie.Actors}</li>
                        </ul>
                        <div class="card card-body bg-light mt-2">
                            <h3 class="card-title text-dark">Plot</h3>
                            <div class="card-text">${movie.Plot}</div>
                        </div>
                    </div>
                        
                </div>
            `;

            $('#movie').html(output);
        })
        .catch((err) => {
            console.log(err); 
        });

}