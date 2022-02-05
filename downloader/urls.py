from django.urls import path
# Download view
from downloader import views
from .views import downloader

app_name = 'downloader'

urlpatterns = [
	# path('demo', demo_view, name='demo'),
	path('', views.index, name='index'),
	path('search', views.index, name='index'),
	path('how_download', views.how_download, name='how_download'),
	path('download_video_itag', views.downloader, name='download_video'),
]