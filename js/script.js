$(document).ready(() => {
    $('#searchForm').on('submit', (e) => {
        const searchTitle = $('#searchTitle').val();
        const searchYear = $('#searchYear').val();

        let isValidYear = true;


        if(searchYear !== ""){
            isValidYear = /^[12](?<=1)[89]|(?<=2)[0]\d{2}$/.test(searchYear);
        }
        

        if(isValidYear){
            if(searchTitle !== "")
                getMovies(searchTitle, searchYear);
        }
        else{
            
            $('#alert').html(`
            <div class="alert alert-dismissible fade show alert-danger my-2">
                <strong>Oops!</strong> Please check you search parameters and try submitting again.
            </div>
            `);

            setTimeout(() => {
                $(".alert").alert('close');
            }, 3000);
        }

        
        e.preventDefault();
    });
});


function getMovies(searchTitle, searchYear = ""){
    
    axios.get('http://www.omdbapi.com/?apikey=ff0be5a3&s='+searchTitle+"&y="+searchYear)
        .then((response) => {
            console.log(response);
            const movies = response.data.Search;
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
        })
        .catch((err) => {
            console.log(err); 
        });
}


function movieSelected(id){
    sessionStorage.setItem('movieId', id);
    window.location = 'movie.html';
    return false;
}

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