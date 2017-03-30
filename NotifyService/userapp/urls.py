from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'get_users$', views.get_users, name='get_users'),
    url(r'check_users/$', views.check_users, name='check_users'),
    url(r'register_user/$', views.register_user, name='register_user'),
    url(r'send_message/$', views.send_message, name='send_message'),
]