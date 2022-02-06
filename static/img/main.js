$(document).ready(function(){
    var data = {value: 22};
    var args = {type: 'POST', url: '/create/', data: data}
    $.ajax(args);

});

// $(document).ready(function(){
//     $.ajax({
//         method: 'POST',
//         url: '/videodownloader/funcionPruebas',
//         data: {'value': 22},
//         success: funcionPruebas(data){
//             console.log("It worked!");
//             console.log(data.result);
//         },
//         error: funcionPruebas(){
//             console.log("It not work...");
//         }
//     });
// });
