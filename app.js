// http://www.omdbapi.com/?i=tt3896198&apikey=81094c1f

function searchDB() {
    $('#movie-table-body').html('');
    let term = $('#search_term').val();
    if (term.length == 0) return;
    let type = $('#contentType').children('option:selected').val();
    let year = $('#yearReleased').val();

    let searchURL = "http://www.omdbapi.com/?i=tt3896198&apikey=81094c1f" + "&t=" + term + "&type=" + type + "&y=" + year;


    $.ajax({
        type: "GET",
        url: searchURL,
        success: (res) => {
            let title = res['Title'];
            let yearOfRelease = res['Year'];
            let dateReleased = res['Released'];
            let runtime = res['Runtime'];
            let director = res['Director'];
            let actors = res['Actors'];
            let plot = res['Plot'];
            let seasonsNo = res['totalSeasons'];
            let poster = res['Poster'];

            let ratings = res['Ratings'];
            let ratingSource = '';
            let ratingValue = '';
            for (i = 0; i < ratings.length; i++) {
                ratingSource += (`<p>${ratings[i]['Source']}</p>`);
                ratingValue += (`<p>${ratings[i]['Value']}</p>`);
            }

            let seasons = (seasonsNo !== undefined)? `<tr><td>Broj sezona:</td><td>${seasonsNo}</td></tr>` : '';
            

            $('#movie-table-body').append(
                `
                <tr>
                    <td rowspan="9">
                        <img src=${poster} alt="poster" class="float-left"></img>
                    </td>
                    <td>Naslov:</td>
                    <td>${title}</td>
                </tr>
                <tr>
                    <td>Godina:</td>
                    <td>${yearOfRelease}</td>    
                </tr>
                <tr>
                    <td>Datum objavljivanja:</td>
                    <td>${dateReleased}</td>    
                </tr>
                <tr>
                    <td>Trajanje:</td>
                     <td>${runtime}</td>    
                </tr>
                <tr>
                    <td>Režiser:</td>
                    <td>${director}</td>    
                </tr>
                <tr>
                    <td>Glumci:</td>
                    <td>${actors}</td>    
                </tr>
                <tr>
                    <td>Radnja:</td>
                    <td>${plot}</td>    
                </tr>
                ${seasons}
                <tr>
                    <td>Ocjene gledalaca:</td>
                    <td>
                    <table>
                    <tr><td>${ratingSource}</td><td>${ratingValue}</td></tr>
                    </table>
                    </td>
                </tr>
       
            `
            );

        },
        error: (error) => console.log(error)
    });
}