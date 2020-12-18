let apikey = '81094c1f';
let url = 'https://www.omdbapi.com/?apikey=' + apikey;

function searchDB() {
    // Empty the table and results info each time the function is called
    $('#movie-table').html('');
    $('.results').html('');
    
    // Grab the information that the user typed in 
    let term = $('#search_term').val();
    if (term.length == 0) return;
    let type = $('#contentType').children('option:selected').val();
    let year = $('#yearReleased').val();

    let searchURL = url + "&s=" + term + "&type=" + type + "&y=" + year;

    $.ajax({
        type: "GET",
        url: searchURL,
        success: (res) => {
            if (res['Response'] === 'False') {
                $('#movie-table').append('<div class="col-12"><h3>Nema rezultata za tražene kriterijume</h3><div><img src="./img/try-again.webp"></img>');
                return;
            } else {
                let resultsNo = res['Search'].length;
                // Write the number of results found
                $('.results').append(`<div class="col-12 mb-3"><p class="font-weight-bold">Ukupno rezultata: ${resultsNo}</p></div>`);

                // Iterate the array and get info for each element
                res['Search'].forEach(element => {
                    let title = element['Title'];
                    let year = element['Year'];
                    let imdbID = element['imdbID'];

                    // If no poster is available, show this image
                    let poster = element['Poster'] !== 'N/A' ? element['Poster'] : "./img/no-img.jpg";

                    $('#movie-table').append(
                    `
                    <div class="col-12 col-sm-4 col-md-3 col-xl-2 single-table mt-4">
                        <img src=${poster} width="150" height="180" alt="poster"></img>
                    </div>
                    <div class="col-12 col-sm-8 col-md-9 col-xl-10 single-table pl-2 px-md-5 single-table--padding">
                        <table>
                            <tr>
                                <td>Naslov:</td>
                                <td>${title}</td>
                            </tr>
                            <tr>
                                <td>Godina:</td>
                                <td>${year}</td>
                            </tr>
                            <tr>
                                <td colspan="2">
                                    <button id="${imdbID}" class="btn btn-primary btn-lg" onclick="findData(id)">Više informacija</button>
                                    <button class="btn btn-primary btn-lg d-none" id="1${imdbID}" onclick="hideInfo(id)">Prikaži manje</button>
                                </td>
                            </tr>
                        </table>
                    </div>
                    `
                    );
                });
            }
        },
        error: (error) => console.log(error)
    });

}

function findData(receivedId) {
    // Check if the button had already been clicked
    // If so, show the right info and button
    // If not, look for info and display it 
    let searchId = receivedId;

    if ($('button#' + `${searchId}`).hasClass('visited')) {

        let rowId = '2' + searchId;
        $('tr.' + `${rowId}`).show();
        
        $('button#' + `${searchId}`).addClass('d-none');
        $('button#' + `${searchId}`).siblings().removeClass('d-none');

    } else {
        // Add class visited to button so that next time, the gathered info is only shown
        $('button#' + `${searchId}`).addClass('visited');

        // Grab the table row over which the info is to be displayed
        let tableRow = $('button#' + `${searchId}`).parent().parent();

        // Search using Id
        let searchUrl1 = url + "&i=" + searchId;

        $.ajax({
            type: "GET",
            url: searchUrl1,
            success: (res) => {
                console.log(res);
                let dateReleased = res['Released'];
                let runtime = res['Runtime'];
                let director = res['Director'];
                let actors = res['Actors'];
                let plot = res['Plot'];
                let seasonsNo = res['totalSeasons']

                let ratings = res['Ratings'];
                let ratingSource = '';
                let ratingValue = '';

                if (ratings !== undefined) {
                    ratings.forEach((rating) => {
                        ratingSource += (`<p>${rating['Source']}</p>`);
                        ratingValue += (`<p>${rating['Value']}</p>`);
                    });
                }
                // In case of series, show the number of seasons, else show nothing
                let seasons = (seasonsNo !== undefined) ? `<tr class="2${searchId}"><td>Broj sezona:</td><td>${seasonsNo}</td></tr>` : '';

                tableRow.before(`<tr class="2${searchId}"><td>Datum objavljivanja:</td><td>${dateReleased}</td></tr><tr class="2${searchId}"><td>Trajanje:</td><td>${runtime}</td></tr><tr class="2${searchId}"><td>Režiser:</td><td>${director}</td></tr><tr class="2${searchId}"><td>Glumci:</td><td>${actors}</td></tr><tr class="2${searchId}"><td>Radnja:</td><td>${plot}</td></tr>${seasons}<tr class="2${searchId}"><td>Ocjene gledalaca:</td><td><table><tr><td class="pl-0">${ratingSource}</td><td>${ratingValue}</td></tr>`);
                // Hide the first button ('vise informacija')
                $('button#' + `${searchId}`).addClass('d-none');
                // Show the second button ('prikazi manje')
                $('button#' + `${searchId}`).siblings().removeClass('d-none');
            },
            error: (error) => console.log(error)
        });
    }
};

function hideInfo(btnId2) {
    // Row id starts with 2, whereas button2 id starts with 1, just switch to grab the row
    let trId = btnId2.replace(1, 2);
    
    // Hide second button and added rows
    $('button#' + `${btnId2}`).siblings().removeClass('d-none');
    $('tr.' + `${trId}`).hide();

    // Show first button
    $('button#' + `${btnId2}`).addClass('d-none');
}