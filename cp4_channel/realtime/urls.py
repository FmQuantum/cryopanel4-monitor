from django.urls import path, include
from django.contrib import admin

from .views import index, save_data

urlpatterns = [
    path('', index),
    path('save-data/', save_data, name='save_data'),

     # Other URL patterns
    
    path('grappelli/', include('grappelli.urls')),
    path('admin/', admin.site.urls),
]