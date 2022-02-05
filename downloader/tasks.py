from video_downloader.celery import app
from celery import shared_task
from celery_progress.backend import ProgressRecorder
import pafy, os.path

# Default callback function
def mycb(total, recvd, ratio, rate, eta, progress_recorder):
    print(recvd, ratio, eta)

# Modified callback function to update progress
class Callback_Progress:
    def __init__(self, pr):
        self.progress_recorder = pr

    def __call__(self, total, recvd, ratio, rate, eta):
        self.progress_recorder.set_progress(int(round(ratio*100)), 100, description = eta)
        print("Downloader: {:>7.3f} MB {:>6.1f} % {:>10.1f} kBps    ETA: {:>5.1f} s".format(recvd/(1024*1024), ratio*100, rate, eta))

@shared_task(bind = True)
def download_video(self, url, itag):
    video = pafy.new(url)
    formats = video.allstreams

    home_dir = os.path.expanduser('~')
    dir_final = home_dir + '/Downloads/VideoDownloader/'
    if not os.path.exists(dir_final):
        os.makedirs(dir_final)
    # looking the format selected by the user
    for s in formats:
        if(s.itag == itag):
            dir_final = dir_final + video.title + "-" + s.quality + '.' + s.extension 
            print("Descargando: " + video.title + '.' + s.extension)
            progress_recorder = ProgressRecorder(self)
            s.download(filepath = dir_final, quiet=True, callback = Callback_Progress(progress_recorder))
            break
    return("Success")