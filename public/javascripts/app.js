/**
 * it initializes the database
 */
function initDB() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker
            .register('./service-worker.js')
            .then(function () {
                //alert("worker");
                console.log('Service Worker Registered');
            })
            .catch (function (error){
                console.log('Service Worker NOT Registered '+ error.message);
            });
    }

    //check for support
    if ('indexedDB' in window) {
        initDatabase();
    }
    else {
        alert("fail");
        console.log('This browser doesn\'t support IndexedDB');
    }
}
/**
 * it gets the event-information inputted by users
 * @return{*}
 */
function eventSubmit() {
   // alert("I am very handsome");
    var formArray= $("form").serializeArray();
    var data={};
    for (index in formArray){
        data[formArray[index].name]= formArray[index].value;
    }
    initDB();
    storeEvent(data);
    event.preventDefault();
}
/**
 * it gets the story-information inputted by users
 * @return{*}
 */
function storySubmit() {
    var formArray= $("form").serializeArray();
    var data={};
    for (var index in formArray){
        data[formArray[index].name]= formArray[index].value;
    }

    //upload picture
    var file = document.getElementById("exampleInputFile");
    var formData = new FormData();
    for(var i in file.files){
        formData.append('file',file.files[i]);
    }

    var path = savePictures('/uploadimg', formData);
    //alert(JSON.stringify(path));
    data['pictures_path']= JSON.stringify(path);
    initDB();
    storeStory(data);
    event.preventDefault();
}
/**
 * it uploads the pictures to the server and get its' path
 * @return{pictures-path}
 */
function savePictures(url, data) {
    var result;
    $.ajax({
        url: url ,
        data: data,
        type: 'POST',
        contentType: false,
        processData: false,
        async: false,
        success: function (dataR) {
            if(200 === dataR.code) {
                result = dataR.data;
                //alert("success!");

            } else {
                alert("error!");
                window.location.href="https://localhost:3000/createstory";
            }
        },
        error: function (xhr, status, error) {
            alert('Error: ' + error.message);
        }
    });
    return result;
}
/**
 * When the client gets off-line, it shows an off line warning to the user
 * so that it is clear that the data is stale
 */
window.addEventListener('offline', function(e) {
    // Queue up events for server.
    console.log("You are offline");
    alert("You are offline");
}, false);

/**
 * When the client gets online, it shows an online notification to the user
 */
window.addEventListener('online', function(e) {
    // Resync data with server.
    console.log("You are online");
    alert("You are online");
}, false);


// <script src="js/content.js?v=1.0.0"></script>
// $(".updatepanel").height($(".panel-info").height());
// document.getElementById('file').onchange = function() {
//     add();
//     var imgFile = this.files[0];
//     var fr = new FileReader();
//     fr.onload = function() {
//         var imgs = document.getElementsByClassName('updateimg');
//         imgs[imgs.length-1].src = fr.result;
//         /*document.getElementById('image').getElementsByTagName('img')[0].src = fr.result;*/
//     };
//     fr.readAsDataURL(imgFile);
// };
// function add(){
//     var html = "<div class='col-sm-4'><div class='panel panel-info'><div class='panel-heading'><i class='fa fa-times' xss=removed></i></div><div class='panel-body' xss=removed><div class='row'><div class='col-sm-12 col-md-12'><img class='updateimg img-responsive' src='img/p_big3.jpg' style=\"width: 210px;height: 210px;\" xss=removed></div></div></div></div></div>";
//     $("#updatebox").before(html);
// }
// $(".fa-times").click(function(){
//     alert("111");
//     /*alert($(this).parent().parent().parent().html());*/
//     $(this).parent().parent().parent().remove();
// });
// function removes(e)
// {
//     $(e).parent().parent().parent().remove();
// }
// /*$(".panel").on("click","i",function(){
//     alert("111");
//     alert($(this).parent().parent().parent().html());
//     $(this).parent().parent().parent().remove();
// });*/
// /*function delete(){
//
// }*/
