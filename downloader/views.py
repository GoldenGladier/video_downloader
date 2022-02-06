from django.shortcuts import render
from downloader.tasks import download_video
from django.http import JsonResponse

# import pafy
import apafy as pafy
# Create your views here.

def index(request):
    if request.method == 'POST':
        url = request.POST.get('link')
        ydl_opts = {"--no-check-certificate": True}
        # video = pafy.new(url, ydl_opts)        
        video = pafy.new(url)  
        formatos = video.streams
        audios = video.audiostreams
        all_stream = video.allstreams
        
        context = {
            'video': video, 
            'streams': formatos, 
            'audios': audios, 
            'all_streams': all_stream
        }
        return render(request, 'index.html', context)
    return render(request,'index.html')

def downloader(request):
    if request.method == 'GET':
        itag = request.GET.get('itag')
        id_video = request.GET.get('id-video')
        url = 'https://www.youtube.com/watch?v=' + id_video
        download_task = download_video.delay(url, itag)
        data = {'task_id': download_task.task_id}
        return JsonResponse(data)
    return render(request, 'progress.html')

def how_download(request):
    return render(request, 'how_download.html')