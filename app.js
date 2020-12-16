// http://www.omdbapi.com/?i=tt3896198&apikey=81094c1f

function searchDB() {
    $('#movie-table').html('');
    $('.results').html('');
    let term = $('#search_term').val();
    if (term.length == 0) return;
    let type = $('#contentType').children('option:selected').val();
    let year = $('#yearReleased').val();

    let searchURL = "http://www.omdbapi.com/?i=tt3896198&apikey=81094c1f" + "&s=" + term + "&type=" + type + "&y=" + year;

    $.ajax({
        type: "GET",
        url: searchURL,
        success: (res) => {
            console.log(res);
            if (res['Response'] === 'False') {
                $('#movie-table').append('<div class="col-12"><h3>Nema rezultata za tražene kriterijume</h3><div><img src="try-again.webp"></img>');
                return;
            } else {
                let resultsNo = res['Search'].length;
                $('.results').append(`<div class="col-12 mb-3"><p class="font-weight-bold">Ukupno rezultata: ${resultsNo}</p></div>`);

            res['Search'].forEach(element => {
                let title = element['Title'];
                let year = element['Year'];
                let poster = element['Poster'] !== 'N/A' ? element['Poster'] : "./no-img.jpg";
                // Send title over with hyphens 
                let dataTitle = title.replace(/ /g, "-");
                // Remove special characters and spaces - for class name
                let rowClass = title.replace(/[^\w\s]/gi, '').replace(/ /g, '');
                // Remove special characters and replace spaces with hyphens - to make it distinct from class 
                let idTitle = title.replace(/[^\w\s]/gi, '').replace(/ /g, "-");
                
                $('#movie-table').append(
                    `<div class="col-12 col-sm-4 col-md-3 col-xl-2 single-table mt-4">
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
                    <tr class="${rowClass}">
                        <td colspan="2">
                            <button id="${idTitle}" data-attribute="${dataTitle}" class="btn btn-primary btn-lg" onclick="findData(id)">Više informacija</button>
                            <button class="btn btn-primary btn-lg d-none" id="1${idTitle}" onclick="hideInfo(id)">Prikaži manje</button>
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

    // Title with hyphens as received from the function
    let btnId = receivedId;

    let titleHyphen = $('button#' + `${btnId}`).attr('data-attribute');

    // Title without hyphens for searching the DB
    let searchTitle = titleHyphen.replace(/-/g, ' ');

    // Title with no special chars and no spaces for row id
    let rowId = receivedId.replace(/[^\w\s]/gi, '').replace(/ /g, '');

    let tableRow = $('#movie-table tr.' + `${rowId}`);
    let searchUrl1 = "http://www.omdbapi.com/?i=tt3896198&apikey=81094c1f" + "&t=" + searchTitle;

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
            let seasonsNo = res['totalSeasons'];

            let ratings = res['Ratings'];
            let ratingSource = '';
            let ratingValue = '';
            ratings.forEach((rating) => {
                ratingSource += (`<p>${rating['Source']}</p>`);
                ratingValue += (`<p>${rating['Value']}</p>`);
            });
            let seasons = (seasonsNo !== undefined) ? `<tr class="2${btnId}"><td>Broj sezona:</td><td>${seasonsNo}</td></tr>` : '';

            tableRow.before('<tr class="2' + `${btnId}` + '"><td>Datum objavljivanja:</td><td>' + `${dateReleased}` + '</td></tr><tr class="2' + `${btnId}` + '"><td>Trajanje:</td><td>' + `${runtime}` + '</td></tr><tr class="2' + `${btnId}` + '"><td>Režiser:</td><td>' + `${director}` + '</td></tr><tr class="2' + `${btnId}` + '"><td>Glumci:</td><td>' + `${actors}` + '</td></tr><tr class="2' + `${btnId}` + '"><td>Radnja:</td><td>' + `${plot}` + '</td></tr>' + `${seasons}` + '<tr class="2' + `${btnId}` + '"><td>Ocjene gledalaca:</td><td><table><tr><td class="pl-0">' + `${ratingSource}` + '</td><td>' + `${ratingValue}` + '</td></tr>');
            $('button#' + `${btnId}`).addClass('d-none');
            $('button#' + `${btnId}`).siblings().removeClass('d-none');

        },
        error: (error) => console.log(error)
    });
};

function hideInfo(btnId2) {
    let plainId = btnId2.replace(1, '');
    let trId = '2' + `${plainId}`;
    $('button#' + `${btnId2}`).siblings().removeClass('d-none');
    $('tr.' + `${trId}`).hide();
    $('button#' + `${btnId2}`).addClass('d-none');
}