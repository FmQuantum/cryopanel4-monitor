from django.urls import path, include
from django.contrib import admin

from .views import index, save_data, save_connection_lost, get_channel_log_data, save_custom_names, get_custom_name

urlpatterns = [
    path('', index),
    path('save-data/', save_data, name='save_data'),
    path('save-lost-connection/', save_connection_lost, name='save_connection_lost'),
    path('save-custom-names/', save_custom_names, name='save_custom_names'),
    path('get_channel_log_data/', get_channel_log_data, name='get_channel_log_data'),
    path('get_custom_names/', get_custom_name, name='get_custom_name'),   

     # Other URL patterns
    
    path('grappelli/', include('grappelli.urls')),
    path('admin2/', admin.site.urls),
]