from django.urls import path, include
from django.contrib import admin

from .views import index, save_data, save_connection_lost, get_channel_log_data

urlpatterns = [
    path('', index),
    path('save-data/', save_data, name='save_data'),
    path('save-lost-connection/', save_connection_lost, name='save_connection_lost'),
    path('get_channel_log_data/', get_channel_log_data, name='get_channel_log_data'),   

     # Other URL patterns
    
    path('grappelli/', include('grappelli.urls')),
    path('admin2/', admin.site.urls),
]