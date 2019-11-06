from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('admin/', views.admin, name='admin'),
    path('logout/', views.exit, name='exit'),
    path('addCategory/', views.addCategory, name="addCategory"),
    path('removeCategory/', views.removeCategory, name="removeCategory"),
    path('addProduct/', views.addProduct, name="addProduct"),
    path('product_remove/', views.product_remove, name="product_remove"),
    path('sortProducts/', views.sortProducts, name="sortProducts"),
    path('loadMore/', views.loadMore, name="loadMore"),
    path('search/', views.search, name="search"),
    path('toBag/', views.toBag, name="toBag"),
    path('order/', views.order, name="order"),
    path('makeOrder/', views.makeOrder, name="makeOrder"),
    path('numberChange/', views.numberChange, name="numberChange"),
    path('sort/', views.sort, name="sort"),
    path('searchResult/<str:item>', views.searchResult, name="searchResult"),
    path('product/<str:productid>', views.product, name="product"),
    path('feed/<str:item>/<str:subitem>', views.feed, name="feed"),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)