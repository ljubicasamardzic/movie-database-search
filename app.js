// http://www.omdbapi.com/?i=tt3896198&apikey=81094c1f
// $(document).ready(() => {
//     $('input[type=hidden]').click(() => {
//         alert('clciked');
//         let filmName = $(this).dataset["title"];
//         console.log(filmName);

//     });
// });

$(document).on('submit', function(e) {
    e.preventDefault();
    let searchTitle = $(this).find('input:hidden').val();
    console.log($(this['activeElement']));

$.ajax({
    type: "GET",
    url: "http://www.omdbapi.com/?i=tt3896198&apikey=81094c1f" + "&t=" + searchTitle,
    success: (res) => {
        // console.log(res);
        
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
        ratings.forEach((rating) => {
            ratingSource += (`<p>${rating['Source']}</p>`);
            ratingValue += (`<p>${rating['Value']}</p>`);
        });

        let seasons = (seasonsNo !== undefined)? `<tr><td>Broj sezona:</td><td>${seasonsNo}</td></tr>` : '';

        $(this['activeElement']).replaceWith(` 
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
     `)
    }, 
    error: (error) => console.log(error)
});




});
function findMoreInfo() {
    // let searchTitle = titleName;
    // console.log(searchTitle);

    // $('input[type=hidden]').click(() => {
        //         alert('clciked');
        //         let filmName = $(this).dataset["title"];
        //         console.log(filmName);
    
    

}

function searchDB() {
    $('#movie-table-body').html('');
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

                $('#movie-table-body').append(
                    `
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
                    <tr>
                        <td>
                            <form>
                                <input type="hidden" value="${title}">
                                <button type="submit" value="${title}" class="btn btn-primary btn-block">Više informacija</button>
                            </form>
                        </td>
                    </tr>
                    `
                    );

            });

        }, 
    error: (error) => console.log(error)
    });

}