var express = require('express');
var request = require('request-promise') //makes sending GET requests in node easier - this is the promisified version (JW)
var Path = require('path');
var routes = express.Router();


//HOW TO DEAL WITH API KEYS: set them equal to environment variables in the terminal.
//when working with heroku: use herokuConfig (command line interface) to manually set env variables

exports.bookSearcher = function(bookName){
	//Queries the Google Books API and returns an array of JSON objects - the top 10 closest matching books.
	//NOTE: we have an API key, but this query does not require it

	var formattedName = bookName.split(' ').join('+');
	var baseUrl = 'https://www.googleapis.com/books/v1/volumes';
	var bookSearchUrl = baseUrl + '?q=' + formattedName + '&format=json';
	var requestBody = {
		uri: bookSearchUrl,
		json: true
	}

	return request
		.get(requestBody)
		.then(function(books) {

			//nicely pack all the book objects into an array, instead of the mess that comes back.
			var bookList = books.items.map(function(x){
				return x.volumeInfo;
			})

			// for each book in booklist, get a url for a larger image, as the ones that come back are too small
			//howTo: change the 'zoom' parameter to 0 in the original thumbnail url

			bookList.forEach(function(x){
				var bookObject = x;
				if (bookObject.imageLinks){
					var imageURL = bookObject.imageLinks.thumbnail;
					var splitURL = imageURL.split('zoom=1');
					splitURL[0] = splitURL[0]+'zoom=0';
					var largeImageURL = splitURL[0]+splitURL[1];
					// pack the new url into bookObject
					// bookObject.largeImage = largeImageURL;

					// NOTE: not currently using the larger image - doesn't work for a significant number of books!
					// substituting the original imageURL instead until a better fix is devised. The front end still looks
					// for the 'largeImage' property to grab image links, so we're hooking up imageURL to that.
					bookObject.largeImage = imageURL;

				}
				else { // if no image came back for a given book, substitute a default one. (JW)
					bookObject.largeImage = "https://pbs.twimg.com/profile_images/2601029982/profile.jpg"
				}
				bookObject.type = 'Books';
			})

			return bookList;
		})
		.catch(function(err){
			console.error('The books API failed to GET: ', err);
		})

}
