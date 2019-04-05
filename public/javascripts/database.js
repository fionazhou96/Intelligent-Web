////////////////// DATABASE //////////////////
// the database receives from the server the following structure

var dbPromise;

const EVENT_DB_NAME= 'event';
const EVENT_STORE_NAME= 'store_event';
const STORY_STORE_NAME= 'store_story';

/**
 * it initializes the database
 */
function initDatabase(){
    dbPromise = idb.openDb(EVENT_DB_NAME, 1, function (upgradeDb) {
        if (!upgradeDb.objectStoreNames.contains(EVENT_STORE_NAME)) {
            var eventDB = upgradeDb.createObjectStore(EVENT_STORE_NAME, {keyPath: 'id', autoIncrement: true});
            eventDB.createIndex('eventname', 'eventname', {unique: true});
            eventDB.createIndex('eventdate', 'eventdate', {unique: false});
            eventDB.createIndex('eventlocation', 'eventlocation', {unique: false});
            eventDB.createIndex('eventdescription', 'eventdescription', {unique: false});
        }
        if (!upgradeDb.objectStoreNames.contains(STORY_STORE_NAME)) {
            var storyDB = upgradeDb.createObjectStore(STORY_STORE_NAME, {keyPath: 'id', autoIncrement: true});
            storyDB.createIndex('storyname', 'storyname', {unique: true});
            storyDB.createIndex('storydate', 'storydate', {unique: false});
            storyDB.createIndex('storyauthor', 'storyauthor', {unique: false});
            storyDB.createIndex('storydescription', 'storydescription', {unique: false});
            storyDB.createIndex('pictures', 'pictures', {unique: false});

        }

    });
}
/**
 * it stores the event submitted by users
 * @param eventObject
 */
function storeEvent(eventObject) {
    console.log('inserting: '+JSON.stringify(eventObject));
    if (dbPromise) {
        dbPromise.then(async db => {
            var tx = db.transaction(EVENT_STORE_NAME, 'readwrite');
            var store = tx.objectStore(EVENT_STORE_NAME);
            await store.add({
                eventname: eventObject["event_name"],
                eventdate: eventObject["event_date"],
                eventlocation: eventObject["event_location"],
                eventdescription: eventObject["event_description"]
            });
            return tx.complete;
        }).then(function () {
            //console.log('added ');
            alert("Event is created sucessfully!");
            window.location.href="https://localhost:3000/event";
        }).catch(function (error) {
            //localStorage.setItem(city, JSON.stringify(EVENTObject));
            alert("error!");
            window.location.href="https://localhost:3000/createevent";
        });
    }
    //else localStorage.setItem(city, JSON.stringify(EVENTObject));
}

/**
 * it loads all the events stored on database
 * @returns {*}
 */
function loadAllEvent() {
    //console.log('inserting: '+JSON.stringify(eventObject));
    if (dbPromise) {
        dbPromise.then(function (db){
            var tx = db.transaction(EVENT_STORE_NAME, 'readwrite');
            var store = tx.objectStore(EVENT_STORE_NAME);
            //await store.getAll();
            return store.getAll();
        }).then(function (allEvents) {
            for (var oneEvent of allEvents){
                const row = document.createElement('div');
                document.getElementById('container').appendChild(row);
                row.innerHTML="<div class=\"row\" style=\"border: 1px solid #e0e0e0;width: 80%;margin-left: 10%;margin-top:2%; \">\n" +
                    "            <div class=\"content-page\">\n" +
                    "                <div class=\"event-information\">\n" +
                    "                    <div class=\"event-name\" style=\"width: 50%;\"><p style=\"float: left\">"+oneEvent.eventname+"</p ></div>\n" +
                    "                    <div class=\"event-name\" style=\"width: 25%;\"><p style=\"float: left;font-size: 1.5rem;\">"+oneEvent.eventdate+"</p ></div>\n" +
                    "                    <div class=\"event-name\" style=\"width: 25%;\"><p style=\"float: left;font-size: 1.5rem;\">"+oneEvent.eventlocation+"</p ></div>\n" +
                    "    \n" +
                    "                </div>\n" +
                    "                <div class=\"event-content\">\n" +
                    "                    <p style=\"float: left\">"+oneEvent.eventdescription+"</p >\n" +
                    "                </div>\n" +
                    "                <div class=\"event-story\">\n" +
                    "                        <a href=\""+"https://localhost:3000/story"+"\">Clink into event</a>\n" +
                    "                </div>\n" +
                    "            </div>\n" +
                    "        </div>";
            }

            //alert("get All events!");
            //window.location.href="https://localhost:3000/event";
        }).catch(function (error) {
            //console.log("error!!!");
            alert("error!");
           // window.location.href="https://localhost:3000/createevent";
        });
    }
    else
        alert("error");
}

/**
 * it stores the story submitted by users
 * @param storyObject
 * @returns {*}
 */
function storeStory(storyObject) {
    //console.log('inserting: '+JSON.stringify(eventObject));
    if (dbPromise) {
        dbPromise.then(async db => {
            var tx = db.transaction(STORY_STORE_NAME, 'readwrite');
            var store = tx.objectStore(STORY_STORE_NAME);
            var now = new Date();
            var year = now.getFullYear();
            var month = now.getMonth() + 1; 
            var day = now.getDate();
            if(month<10)
                month = "0"+month;
            if(day<10)
                day = "0"+day;
            await store.add({
                storyname: storyObject["story_title"],
                storydate: year+"-"+month+"-"+day,
                storyauthor: storyObject["story_author"],
                storydescription: storyObject["story_description"],
                pictures: storyObject["pictures_path"]
            });
            return tx.complete;
        }).then(function () {
            alert("Story is created sucessfully!");
            window.location.href="https://localhost:3000/story";
        }).catch(function (error) {
            //localStorage.setItem(city, JSON.stringify(EVENTObject));
            alert("error!");
            window.location.href="https://localhost:3000/createstory";
        });
    }
    //else localStorage.setItem(city, JSON.stringify(EVENTObject));
}

/**
 * it retrieves all the stories in the database
 * @returns {*}
 */
function loadAllStories() {
    if (dbPromise) {
        dbPromise.then(function (db){
            var tx = db.transaction(STORY_STORE_NAME, 'readwrite');
            var store = tx.objectStore(STORY_STORE_NAME);
            return store.getAll();
        }).then(function (allStories) {
            var numC=0;
            for (var oneStory of allStories){
                // var newDate = new Date();
                // newDate.setTime(oneStory.storydate);
                var allPic = JSON.parse(oneStory.pictures);
                var picNum = allPic.length;
                var firstPic = allPic[0].replace(/\\/g,"/").slice(7);
                var picIndex ="";
                var picHtml="";
                numC++;
                for(var i=1;i<picNum;i++){
                    picIndex = picIndex+"<li data-target=\"#myCarousel"+numC+"\" data-slide-to=\""+i+"\"></li>";
                }
                for(var j=1;j<picNum;j++){
                    var temp = allPic[j].replace(/\\/g,"/");
                    var picPath=temp.slice(7);
                    picHtml = picHtml+"<div class=\"item\">\n" +
                        "    <img class=\"img-broad\" src=\""+picPath+"\">\n" +
                        "    </div>";
                }
                const row = document.createElement('div');
                document.getElementById('container').appendChild(row);
                row.innerHTML="<div id=\"container\" class=\"main-page\"style=\"margin-bottom: 5%; border: 1px solid #ccc; margin-top: 20px; width: 80% ;margin-left: 10%;\" ><div class=\"row\" >\n" +
                    "    <div class=\"col-lg-4\" style=\"float: left\">\n" +
                    "    <p class=\"story-information\">"+"Title : "+oneStory.storyname+"</p>\n" +
                    "</div>\n" +
                    "</div>\n" +
                    "<div class=\"row\" >\n" +
                    "    <div class=\"col-lg-5\" style=\"float: left\">\n" +
                    "    <p class=\"story-information\">"+"Author : "+oneStory.storyauthor+"</p>\n" +
                    "</div>\n" +
                    "<div class=\"col-lg-4\" style=\"float: left\">\n" +
                    "    <p class=\"story-information\">"+"Date : "+oneStory.storydate+"</p>\n" +
                    "</div>\n" +
                    "</div>\n" +
                    "<div class=\"row\" style=\"height: 100px\">\n" +
                    "    <div class=\"col-lg-4\" style=\"float: left;\">\n" +
                    "    <p class=\"story-information\" style=\"font-size: 1.5rem\">"+"Description : "+oneStory.storydescription+"</p>\n" +
                    "</div>\n" +
                    "</div>\n" +
                    "<div class=\"row\" style=\"width: 80%; margin-left: 10%;\">\n" +
                    "    <div id=\"myCarousel"+numC+"\" class=\"carousel slide\" data-ride=\"carousel\" data-interval=\"2000\" style=\"margin-top: 0;margin-bottom: 2%;\">\n" +

                    "<ol class=\"carousel-indicators\">\n" +
                    "    <li data-target=\"#myCarousel"+numC+"\" data-slide-to=\"0\" class=\"active\"></li>\n" +picIndex+
                    "    </ol>\n" +

                    "    <div class=\"carousel-inner\">\n" +
                    "    <div class=\"item active\">\n" +
                    "    <img class=\"img-broad\" src=\""+firstPic+"\" alt=\"First slide\">\n" +
                    "    </div>\n" +picHtml+
                    "    </div>\n" +

                    "    <a class=\"carousel-control left\" href=\"#myCarousel"+numC+"\"\n" +
                    "data-slide=\"prev\"> <span _ngcontent-c3=\"\" aria-hidden=\"true\" class=\"glyphicon glyphicon-chevron-right\"></span></a>\n" +
                    "<a class=\"carousel-control right\" href=\"#myCarousel"+numC+"\"\n" +
                    "data-slide=\"next\">&rsaquo;</a>\n" +
                    "</div>\n" +
                    "</div></div>";
            }

            //alert("get All stories!");
            //window.location.href="https://localhost:3000/event";
        }).catch(function (error) {
            //console.log("error!!!");
            alert("error!");
            // window.location.href="https://localhost:3000/createevent";
        });
    }
    else
        alert("error");
}

/**
 * it searches the events by keywords inputted by users
 * @returns {*}
 */
function searchEvents() {
    var content = document.getElementById("searchbox2").value;
    var searchType = document.getElementById("selectbutton").value;
    if (dbPromise) {
        //alert("searchevent!");
        dbPromise.then(function (db) {
            var tx = db.transaction(EVENT_STORE_NAME, 'readonly');
            var store = tx.objectStore(EVENT_STORE_NAME);
            var index = store.index(searchType);
            return index.getAll(IDBKeyRange.only(content));
        }).then(function (result) {
            //alert(result.length);
            if(result.length > 0){
                document.getElementById('container').innerHTML="";
                for (var oneEvent of result){
                    const row = document.createElement('div');
                    document.getElementById('container').appendChild(row);
                    row.innerHTML="<div class=\"row\" style=\"border: 1px solid #e0e0e0;width: 80%;margin-left: 10%;margin-top:2%; \">\n" +
                        "            <div class=\"content-page\">\n" +
                        "                <div class=\"event-information\">\n" +
                        "                    <div class=\"event-name\" style=\"width: 50%;\"><p style=\"float: left\">"+oneEvent.eventname+"</p ></div>\n" +
                        "                    <div class=\"event-name\" style=\"width: 25%;\"><p style=\"float: left;font-size: 1.5rem;\">"+oneEvent.eventdate+"</p ></div>\n" +
                        "                    <div class=\"event-name\" style=\"width: 25%;\"><p style=\"float: left;font-size: 1.5rem;\">"+oneEvent.eventlocation+"</p ></div>\n" +
                        "    \n" +
                        "                </div>\n" +
                        "                <div class=\"event-content\">\n" +
                        "                    <p style=\"float: left\">"+oneEvent.eventdescription+"</p >\n" +
                        "                </div>\n" +
                        "                <div class=\"event-story\">\n" +
                        "                        <a href=\""+"https://localhost:3000/story"+"\">Clink into event</a>\n" +
                        "                </div>\n" +
                        "            </div>\n" +
                        "        </div>";
                }
            }else{
                document.getElementById('container').innerHTML="No result available";
            }

        });
    }else{
        alert("error!");
    }
}

/**
 * it searches the stories by keywords inputted by users
 * @returns {*}
 */
function searchStories() {
    var content = document.getElementById("searchbox2").value;
    var searchType = document.getElementById("selectbutton").value;
   // alert(content);
    if (dbPromise) {
        dbPromise.then(function (db) {
            var tx = db.transaction(STORY_STORE_NAME, 'readonly');
            var store = tx.objectStore(STORY_STORE_NAME);
            var index = store.index(searchType);
            return index.getAll(IDBKeyRange.only(content));
        }).then(function (result) {
            if(result.length > 0){
                document.getElementById('container').innerHTML="";
                for (var oneStory of result){
                    var allPic = JSON.parse(oneStory.pictures);
                    var picNum = allPic.length;
                    var firstPic = allPic[0].replace(/\\/g,"/").slice(7);
                    var picIndex ="";
                    var picHtml="";
                    for(var i=1;i<picNum;i++){
                        picIndex = picIndex+"<li data-target=\"#myCarousel\" data-slide-to=\""+i+"\"></li>";
                    }
                    for(var j=1;j<picNum;j++){
                        var temp = allPic[j].replace(/\\/g,"/");
                        var picPath=temp.slice(7);
                        picHtml = picHtml+"<div class=\"item\">\n" +
                            "    <img class=\"img-broad\" src=\""+picPath+"\">\n" +
                            "    </div>";
                    }
                    const row = document.createElement('div');
                    document.getElementById('container').appendChild(row);
                    row.innerHTML="<div id=\"container\" class=\"main-page\"style=\"margin-bottom: 5%; border: 1px solid #ccc; margin-top: 20px; width: 80% ;margin-left: 10%;\" ><div class=\"row\" >\n" +
                        "    <div class=\"col-lg-4\" style=\"float: left\">\n" +
                        "    <p class=\"story-information\">"+"Title : "+oneStory.storyname+"</p>\n" +
                        "</div>\n" +
                        "</div>\n" +
                        "<div class=\"row\" >\n" +
                        "    <div class=\"col-lg-5\" style=\"float: left\">\n" +
                        "    <p class=\"story-information\">"+"Author : "+oneStory.storyauthor+"</p>\n" +
                        "</div>\n" +
                        "<div class=\"col-lg-4\" style=\"float: left\">\n" +
                        "    <p class=\"story-information\">"+"Date : "+oneStory.storydate+"</p>\n" +
                        "</div>\n" +
                        "</div>\n" +
                        "<div class=\"row\" style=\"height: 100px\">\n" +
                        "    <div class=\"col-lg-4\" style=\"float: left;\">\n" +
                        "    <p class=\"story-information\" style=\"font-size: 1.5rem\">"+"Description : "+oneStory.storydescription+"</p>\n" +
                        "</div>\n" +
                        "</div>\n" +
                        "<div class=\"row\" style=\"width: 80%; margin-left: 10%;\">\n" +
                        "    <div id=\"myCarousel1\" class=\"carousel slide\" style=\"margin-top: 0;\">\n" +

                        "<ol class=\"carousel-indicators\">\n" +
                        "    <li data-target=\"#myCarousel\" data-slide-to=\"0\" class=\"active\"></li>\n" +picIndex+
                        "    </ol>\n" +

                        "    <div class=\"carousel-inner\">\n" +
                        "    <div class=\"item active\">\n" +
                        "    <img class=\"img-broad\" src=\""+firstPic+"\" alt=\"First slide\">\n" +
                        "    </div>\n" +picHtml+
                        "    </div>\n" +

                        "    <a class=\"carousel-control left\" href=\"#myCarousel1\"\n" +
                        "data-slide=\"prev\"> <span _ngcontent-c3=\"\" aria-hidden=\"true\" class=\"glyphicon glyphicon-chevron-right\"></span></a>\n" +
                        "<a class=\"carousel-control right\" href=\"#myCarousel1\"\n" +
                        "data-slide=\"next\">&rsaquo;</a>\n" +
                        "</div>\n" +
                        "</div></div>";
                }
            }else{
                document.getElementById('container').innerHTML="No result available";
            }

        });
    }else{
        alert("error!");
    }
}




