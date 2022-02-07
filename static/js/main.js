function tabChange(id_table, id_tab_control){
  $('#table-1').css('display', 'none');
  $('#table-2').css('display', 'none');
  $('#table-3').css('display', 'none');
  $('.tab-control').removeClass("md-col-active");
  // $('#table-1').css('display', 'none');
  $(id_table).css('display', 'inline-table');
  $(id_tab_control).addClass("md-col-active");
}

function formatSizeUnits(bytes){
  if(bytes >= 1073741824){ 
    bytes = (bytes / 1073741824).toFixed(2) + " GB"; 
  }
  else if(bytes >= 1048576){
    bytes = (bytes / 1048576).toFixed(2) + " MB"; 
  }
  else if(bytes >= 1024){
    bytes = (bytes / 1024).toFixed(2) + " KB"; 
  }
  else if(bytes > 1){
    bytes = bytes + " bytes"; 
  }
  else if(bytes == 1){
    bytes = bytes + " byte"; 
  }
  else{
    bytes = "0 bytes"; 
  }
  return bytes;
}

$('.td-size').each(function(){
  var size = $(this).text();
  var newSize = formatSizeUnits(size);
  $(this).text(newSize);
});

function DownloadVideoByItag(itag, id_vid){
    event.preventDefault();
    $('#btn-download-' + itag).css('display', 'none');

    $.ajax({
        type: "GET",
        url: 'download_video_itag',
        data: {
          'itag' : itag,
          'id-video' : id_vid,
        },
        dataType: 'json',
        success: function (data) {
            var progressUrl = "http://127.0.0.1:8000/celery-progress/" + data.task_id;
            // $('#btn-info-' + itag).onclick = "see_progress(" + progressUrl +"," + itag + ")";
            // $('#btn-info-' + itag).css('display', 'inline-block');
            // window.open(progressUrl, '_blank');

            // see_progress(progressUrl, itag);
            var animateBar = setInterval(function(){
              check_progress(progressUrl, itag, animateBar);
            }, 500);
        }
    });
}

function see_progress(progressUrl, itag){
  var animateBar = setInterval(function(){
    check_progress(progressUrl, itag, animateBar);
  }, 500);

  $("#ModalCenter").on('hidden.bs.modal', function () {
    clearInterval(animateBar); 
  });
}
// window.open(progressUrl, '_blank');

check_progress = function (progressUrl, itag, animateBar) {
  $.ajax({
     url : progressUrl,
     type : 'GET',
     success : function(data){
            // $(".progress-bar-message").text(data.progress.percent + "% Percent.");

            $("#progress-itag-" + itag).css('display', 'block');   
            $("#progress-message-" + itag).css('display', 'block'); 

            $("#progress-bar-itag-" + itag).css('width', data.progress.percent + '%');
            
            if(data.progress.description){
              // $("#progress-message-" + itag).text(data.progress.percent + "% - " + data.progress.description.time_remaining + 'seg remaining - ' + data.progress.description.speed_download + ' kBps');  
              $("#progress-message-" + itag).text(data.progress.percent + "% - " + data.progress.description.time_remaining + 'seg remaining');  
            }  
            else{
              $("#progress-message-" + itag).text(data.progress.percent + "% ");  
            }
            // console.log(`${i} = ${data.progress[i]}\n`);
            // PARA SABER QUE DATOS RECIBIMOS DEL BACK 
            // for (var i in data.progress) {
            //   if (data.progress.hasOwnProperty(i)) {
            //     console.log(`${i} = ${data.progress[i]}\n`);
            //   }
            // }       

            if(data.complete == true){              
              clearInterval(animateBar); 
              setTimeout(function(){
                // $("#ModalCenter").modal('hide');
                // $("#ModalCenter .close").click();
                // $(".progress-bar-message").text(data.progress.percent + "Waiting for the download to start...");
                // $(".progress-bar").css('width', '0%');
                // $('#btn-download-' + itag).css('display', 'inline-block');
                // $('#btn-info-' + itag).css('display', 'none');

                $("#progress-itag-" + itag).css('display', 'none');   
                $("#progress-bar-itag-" + itag).css('width','0%');   
                $("#progress-message-" + itag).text("Video downloaded successfully");             
              }, 1500);
            }
            $("#ModalCenter").on('hidden.bs.modal', function () {
              clearInterval(animateBar); 
            });
     }
  });
};
