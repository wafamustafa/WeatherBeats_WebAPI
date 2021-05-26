/************
 * REFERENCE VIDEOS
 * https://www.youtube.com/watch?v=KqZGuzrY9D4&t=1s
 * https://www.youtube.com/watch?v=WZNG8UomjSI
 * https://www.youtube.com/watch?v=n4dtwWgRueI&t=1406s
 * 
 * NOTE::
 * TheAudioDB only supports 5 countries to produce trending music
 * US (United States)
 * GB (Great Britain)
 * DE (Germany)
 * FR (France)
 * IT (Italy)
 * 
*/

//add weather api key object
const api = {
    //personal key
    key: "3c9e6ca77af7a46d9347bbbd22d43620",
    //url call by city 
    url: "http://api.openweathermap.org/data/2.5/weather?q="
}

//second API TheAudioDb - Rapid API code snippet
//edit to get to use weathe api to search teanding music by country 
//array for parameters needed 
const music_api = {
    //main url
    mURL: "https://theaudiodb.p.rapidapi.com/trending.php?country=",
    //other url parameters
    mURLparam: "&type=itunes&format=singles",
    //api key
    mKey: "fa4e3847bemsha47e23ca9bd50e4p162f4cjsn09d7b3b3db98"
}

//to get values from the search box
const search = document.querySelector('.search');
const button = document.querySelector('.btn');
button.addEventListener('click', getCity);

//function to get the city user is searching for
function getCity (clickEvent){
    if (clickEvent.type == 'click'){
        getResult(search.value);
        
    }
}

//FUNCTIONS TO FETCH DATA AS JSON OBJECT 

//using API documentation - openWeatherMap & TheAudioDb
function getResult(results){
    //fetch data using api url -> add in search.value -> temp in metric units -> add personal api key. Then return a json object. Once we get return use in display result function to actually display the information and manipulate in html.
    fetch(api.url + results + '&units=metric&APPID=' + api.key).then(response => {
        return response.json();
    }).then(displayResult);
}

//using API endpoint testing on RAPID API and Audiobdb documentation 
function getMusicTrends(country){
    //fetch data using api url -> use country code we got from the open weather app api as a param-> other params (type and format) -> get method -> header parameters taken from rapid api (api key and host name). Then return response as json object. 
    fetch(music_api.mURL + country + music_api.mURLparam, {
        "method": "GET",
        "headers": {
            "x-rapidapi-key": music_api.mKey,
            "x-rapidapi-host": "theaudiodb.p.rapidapi.com"
        }
    }).then(response => {
        return response.json();
    }).then(displayTrends);
}

//function to display and manipulate the results from the weather API
function displayResult(response){
    //console.log(response);

    //Error handelling
    if(response.cod === 404){
        var errorMsg = document.querySelector('.error');
        errorMsg.style.display = "block";
        //keep search bar to empty
        search.value = "";
    } else {

        //Get city name and country
        var city = document.querySelector('.location .city');

        //declaring a "country" variable to use in Music API
        var country = `${response.sys.country}`;
        city.innerText = `${response.name}` + ', ' + country;

        //Get temp in metric
        var temp = document.querySelector(".temp");
        //REFERENCE:: W3C no decimals
        temp.innerHTML = `Temp: ${Math.round(response.main.temp)} <span>°C</span>`;

        //Get weather 
        var weather = document.querySelector(".weather");
        weather.innerText = `Weather: ${response.weather[0].main}`;

        //Get temp range
        var tempRange = document.querySelector(".temp-range");

        //math round idea in reference to W3C to get no decimals
        tempRange.innerText = `Temp Range: ${Math.round(response.main.temp_min)}°C / ${Math.round(response.main.temp_max)}°C`;

        //Reference:: Sean Doyle and reddit article
        var weatherIcon = document.querySelector(".weather-icon");
        var iconURL = "http://openweathermap.org/img/w/";
        weatherIcon.src = iconURL + response.weather[0].icon + ".png";

        search.value = "";

        //to figure out date first get today's date -> written in a certain way -> create a function
        var today = new Date();
        var date = document.querySelector(".location .date");

        //using the function below pass var "today"(which is todays date) as a parameter
        date.innerText = cityDate(today);

        getMusicTrends(country);
    }   
}

//date function -> using array for month and array for days use build in function and add into jQuery template
function cityDate(dNow){

    let months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    let day = days[dNow.getDay()];
    let date = dNow.getDate();
    let month = months[dNow.getMonth()];
    let year = dNow.getFullYear();

    return `${day}, ${date} ${month} ${year}`;
}

//function to display and manipulte data from Music Api 
function displayTrends(response){

    //Get music div 
    var music_trends = document.querySelector(".music-trend");
    //to loop through trending music results and display "song" by "artist"
    for (var i = 0 ; i < response.trending.length; i ++){

        //showing empty div if null results
        // if (`${response.trending}` === NULL){
        //     music_trends.innerHTML = ' ';
        // }

        music_trends.innerHTML += `${response.trending[i].strTrack} By ${response.trending[i].strArtist} <br>`;
    }
}







