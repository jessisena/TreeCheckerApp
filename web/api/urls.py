# api/urls.py

from django.conf.urls import url, include
from rest_framework.urlpatterns import format_suffix_patterns
from . import views

urlpatterns = {
    url(r'^gzs/$', views.getGZ),
    url(r'^gzs/(?P<gz>[0-9]+)/aois/$', views.aoiView),
    url(r'^aois/(?P<id>[0-9]+)/$', views.deleteAOI),
    url(r'^users/$', views.userView),
    url(r'^aois/(?P<id>[0-9]+)/observations/$', views.addObservation),
    url(r'^observations/(?P<id>[0-9]+)/$', views.observationView),
    url(r'^images/$', views.addImage),
    url(r'^species/$', views.getSpecies),
    url(r'^crowns/$', views.getCrowns),
    url(r'^canopies/$', views.getCanopies),
    url(r'^upload/$', views.fileUploadView)
}

urlpatterns = format_suffix_patterns(urlpatterns)