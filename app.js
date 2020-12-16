// http://www.omdbapi.com/?i=tt3896198&apikey=81094c1f

function searchDB() {
    $('#movie-table').html('');
    let term = $('#search_term').val();
    if (term.length == 0) return;
    let type = $('#contentType').children('option:selected').val();
    let year = $('#yearReleased').val();

    let searchURL = "http://www.omdbapi.com/?i=tt3896198&apikey=81094c1f" + "&s=" + term + "&type=" + type + "&y=" + year;


    $.ajax({
        type: "GET",
        url: searchURL,
        success: (res) => {

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
                // console.log('row class: ' + rowClass); 
                // let titleWithoutSpecialChar = title.replace(/[^\w\s]/gi, '');
                // console.log('id 1: ' + titleWithoutSpecialChar);
                //  let titleClass = titleWithoutSpecialChar.replace(/ /g, "-");
                //  console.log("title 1 woth char: " + titleClass);
                

                $('#movie-table').append(
                    `
                    <table cellpadding="22">
                    <tr>
                        <td rowspan="3">
                            <img src=${poster} width="150" height="180" alt="poster"></img>
                        </td>
                        <td>Naslov:</td>
                        <td>${title}</td>
                    </tr>
                    <tr>
                        <td>Godina:</td>
                        <td>${year}</td>
                    </tr>
                    <tr class="${rowClass}">
                        <td>
                            <button id="${idTitle}" data-attribute="${dataTitle}" class="btn btn-primary" onclick="findData(id)">Više informacija</button>
                        </td>
                        <td>
                            <button class="btn btn-primary d-none" id="1${idTitle}" onclick="hideInfo(id)">Prikaži manje</button>
                        </td>
                    </tr>
                    </table>
                    `
                    );

            });

        }, 
    error: (error) => console.log(error)
    });

}


function findData(receivedId) {
    // $('form').on('submit', (e) => {
    //     e.preventDefault();
    // });
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
          let seasons = (seasonsNo !== undefined)? `<tr class="2${btnId}"><td></td><td>Broj sezona:</td><td>${seasonsNo}</td></tr>` : '';

          tableRow.before('<tr class="2'+`${btnId}`+'"><td>Datum objavljivanja:</td><td>' + `${dateReleased}` + '</td></tr><tr class="2'+`${btnId}`+'"><td></td><td>Trajanje:</td><td>' + `${runtime}` + '</td></tr><tr class="2'+`${btnId}`+'"><td></td><td>Režiser:</td><td>' + `${director}` + '</td></tr><tr class="2'+`${btnId}`+'"><td></td><td>Glumci:</td><td>' + `${actors}` + '</td></tr><tr class="2'+`${btnId}`+'"><td></td><td>Radnja:</td><td>' + `${plot}` + '</td></tr>' + `${seasons}` + '<tr class="2'+`${btnId}`+'"><td></td><td>Ocjene gledalaca:</td><td><table><tr><td>' + `${ratingSource}` + '</td><td>' + `${ratingValue}` + '</td></tr>');
        //   tableRow.append(`<button class="btn btn-primary" id="1${btnId}" onclick="hideInfo(id)">Sakrij informacije</button>`)
        $('button#' + `${btnId}`).css("visibility", "hidden");
        let button2 = $('button#' + `${btnId}`).parent().siblings().children().first();
        button2.removeClass('d-none');

        },
          error: (error) => console.log(error)
  });


};
    
function hideInfo(btnId2) {
    let plainId = btnId2.replace(1, '');
    let trId = '2' + `${plainId}`;
    $('button#' + `${btnId2}`).parent().siblings().children().first().css('visibility', 'visible');
    $('tr.' + `${trId}`).hide();
    $('button#' + `${btnId2}`).addClass('d-none');

}