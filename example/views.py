import re
from django.shortcuts import render

# Create your views here.

from time import sleep
from .tasks import ProcessDownload

def demo_view(request):
    if request.method == 'POST':
        download_task = ProcessDownload.delay()
        task_id = download_task.task_id
        print(f'Celery Task ID: {task_id}')
        return render(request, 'progress.html', {'task_id' : task_id})
    else:
        return render(request, 'progress.html', {})