# Second Year Client-Side-Scripting Assignment

### Requirements

* **20-25 jQuery anonymous functions bound to events**
	* 23 anonymous functions on separate elements
	* 3 of which have a chained function attached
	* Total of 26 anonymous functions

* **5-10 named functions**
	* Added 10 named functions

* **50 Lines of own CSS**
	* Added ~200 lines of CSS

* **jQuery Methods**
	* Multiple jQuery Methods
	* At least 4 not done in class
		* `data()`
		* `insertAfter()` / `insertBefore()`
		* `slideUp()` / `slideDown()`
		* `is()`
		* `scrollTop()`
		* `scroll()`

* **Advanced selectors**
	* Element
	* Attribute
	* Descendant / Child
	* At least 2 adjacent sibling selectors

* **Original Animation**
	* Flying Rocket Animation

* **jQuery AJAX and JSON (API)**
	* [My own PHP API](https://github.com/CharlesPeterMcCarthy/college-js-year2-indigo-api)
	* [Spotify API](https://developer.spotify.com/documentation/web-api/)

* **3 Plugins**
	* Face Detection
	* Context Menu
	* Element Loading


### Extras

**Included jQueryUI**

jQueryUI is used in one of my jQuery events. I used a function called `effect()` to cause text to shake vertically several times.

**MomentJS**

MomentJS is used with the Spotify API to get the time since an album's release in plain English, eg. `Released: 3 years ago`

**My Own PHP API**

Since we are not hosting this website on any server and it is expected to work on a local machine, the Spotify API will not work as intended. In order to make any API call to Spotify, you must supply an access token in the header of the request.

To get an access token, you must request one from Spotify by supplying your developer application Client ID and Client Secret ID. This call cannot be made from a local machine, it must be made from the server. For this reason, I built a small PHP API.

I call up this API and supply the Client ID. This ID is checked and the supplied to Spotify along with the Client Secret ID. An access token is returned from Spotify to the PHP API.

The API then returns this access token back to my jQuery AJAX call.
This access token can then be used to make a Spotify API request.

## Spotify API (Using AJAX / JSON)
When you search for an artist, a list of artists are returned by the API matching the text entered.

![Spotify Artist Search](images/documentation/spotify/spotify-artist-search.png?raw=true "Spotify Artist Search")

#
When you click the "View Albums" button, the API returns a list of albums from the respective artist.

![Spotify Artist Albums](images/documentation/spotify/spotify-artist-albums.png?raw=true "Spotify Artist Albums")

Clicking on the "View On Spotify" button brings you to the respective album or artist on the spotify player webpage.

## Plugins
* Face Detection
* Context Menu
* Element Loading

When the user uploads an image to be scanned, the element loading plugin adds a cover to the image and displays the words "Uploading Image..." as the image is being uploaded.

![Image Upload](images/documentation/face-detect/upload.png?raw=true "Image Upload")

---

When the image has finished uploading, the user can click "Get Faces" which will initiate the plugin to scan the image.

![Image Uploaded](images/documentation/face-detect/face-detect0.png?raw=true "Image Uploaded")

---

The face detection plugin scans an image and returns an array of faces found, including a "confidence" rating which indicated how likely the resulting match is a face.
My original plan was to ignore any results that had a low confidence rating, but with the including the Content Menu plugin, the user will have the option to delete matching results.

CSS is used to design a "facebox" which is a visual indicator of a face found in an image.

The following image shows 7 people will their faces detected by the plugin. There are also 4 other incorrect "faces" detected which can be seen on the right and left of the image.

![Faces Detected](images/documentation/face-detect/face-detect1.png?raw=true "Faces Detected")

---

The context menu plugin allows the user to click on any of the detected faces and supplys a number of options. The user can "Add", "Delete" or "Cancel".

The user can delete any incorrect matches.

![Context Menu](images/documentation/face-detect/face-detect2.png?raw=true "Context Menu")

---

The "Add" option allows the user to tag the selected face in the image. When submitted, the facebox turns green and their name is attached to the top.

![Tag Face](images/documentation/face-detect/face-detect5.png?raw=true "Tag Face")

---

Some faces have been tagged.

![Some Faces Tagged](images/documentation/face-detect/face-detect3.png?raw=true "Some Faces Tagged")

---

All faces has been tagged.

![All Faces Tagged](images/documentation/face-detect/face-detect4.png?raw=true "All Faces Tagged")
