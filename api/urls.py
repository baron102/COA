from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register('users', views.UserViewSet, basename='user')
router.register('id', views.IDViewSet, basename='id')
router.register('entities', views.EntityViewSet, basename='entity')
router.register('models', views.ModelViewSet, basename='model')
router.register('accounts', views.AccountViewSet, basename='account')
router.register('journals', views.JournalViewSet, basename='journal')
router.register('plans', views.PlanViewSet, basename='plan')
router.register('trans-ids', views.TransIDsViewSet, basename='trans')
router.register('trans-types', views.TransTypesViewSet, basename='type')
router.register('contact-info', views.ContactInfoViewSet, basename='info')
router.register('contact-address', views.ContactAddressViewSet, basename='address')
router.register('roles', views.RolesViewSet, basename='roles')
router.register('user_role_actions', views.UserRoleActionsViewSet, basename='user_role_actions')
router.register('menu_items', views.MenuItemsViewSet, basename='menu_items')
router.register('role_menu', views.RoleMenuViewSet, basename='role_menu')
router.register('items', views.ItemsViewSet, basename='items')
router.register('item_references', views.ItemReferencesViewSet, basename='item_references')
router.register('item_counts', views.ItemCountsViewSet, basename='item_counts')
router.register('item_trans', views.ItemTransViewSet, basename='item_trans')
# router.register('app_data_sets', views.AppDataSetsViewSet, basename='app_data_sets')

urlpatterns = [
    path('auth/register', views.UserSingUpView.as_view(), name='register'),
    path('auth/login', views.MyTokenObtainPairView.as_view(), name='login'),
    path('auth/token-refresh', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/user', views.UserInfoAPIView.as_view(), name='user_info'),
]

urlpatterns += router.urls

