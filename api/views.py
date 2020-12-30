from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from rest_framework import generics, permissions, status, viewsets
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import User, ID, Entities, COAModel
from django.db import IntegrityError
from django.template.loader import render_to_string
from django.core.mail import EmailMessage
from django.utils.encoding import force_bytes, force_text
from api.serializers import *
from api.utils import TokenGenerator
# from mysite import settings
from random import randint


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


class LoginAPIView(APIView):
    permission_classes = (permissions.AllowAny,)

    @staticmethod
    def post(request, *args, **kwargs):
        email = request.data['email']
        user = User.objects.get(email=email)

        if not user:
            return Response(dict(detail="Please register"), status=404)
        else:
            phone_verification = user.is_phone_verified
            # if user.is_active is False:
            #     return Response(dict(detail="Please verify your email address"), status=401)
            if phone_verification is False:
                return Response(dict(detail="Please verify your phone number"), status=201)
            if user.is_active:
                MyTokenObtainPairView()


class UserInfoAPIView(generics.RetrieveAPIView, generics.UpdateAPIView):
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user

    def put(self, request, *args, **kwargs):
        user = request.user
        user.first_name = request.data['first_name']
        user.last_name = request.data['last_name']
        user.email = request.data['email']
        user.save()
        user.phone_number = request.data['phone_number']
        phone_verification_url = '%s/login/phone_verification?uid=%s&token=%s' % (request.build_absolute_uri('/')[:-1],
                                                                                  urlsafe_base64_encode(force_bytes(user.pk)),
                                                                                  TokenGenerator().make_token(user))
        user.save()
        try:
            name = user.first_name + ' ' + user.last_name
            message = render_to_string('emails/phone_verification.html', {
                'name': name,
                'phone_verification_url': phone_verification_url,
            })
            email = EmailMessage(
                'Phone verification', message, to=[user.email]
            )
            email.send()
        except Exception:
            pass
        return Response(data=self.get_serializer(user).data)

    def patch(self, request, *args, **kwargs):
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)


class UserSingUpView(APIView):
    permission_classes = (permissions.AllowAny,)

    @staticmethod
    def post(request, *args, **kwargs):
        serializer = CreateUserSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({
                'message': 'Some fields are missing',
                'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        data = serializer.validated_data
        try:
            num = randint(100000, 999999)
            user = User.objects.create(email=data['email'], first_name=data['first_name'], username=data['email'],
                                       last_name=data['last_name'], is_active=True, email_verification_code=num)
            user.set_password(data['password'])
            user.save()
        except IntegrityError as e:
            return Response({
                'message': 'Email already exists.',
                'errors': {'email': 'Email already exists.'}
                 }, status=status.HTTP_400_BAD_REQUEST)

        # email_verification_url = '%s/login/email_verification?uid=%s&token=%s' % (request.build_absolute_uri('/')[:-1],
        #                                                                           urlsafe_base64_encode(force_bytes(user.pk)),
        #                                                                           TokenGenerator().make_token(user))

        try:
            name = user.first_name + ' ' + user.last_name
            message = render_to_string('emails/email_verification.html', {
                'name': name,
                'email_verification_code': num,
            })
            email = EmailMessage(
                'Email verification', message, to=[user.email]
            )
            email.send()
        except Exception:
            pass

        return Response(data=UserSerializer(user).data, status=status.HTTP_201_CREATED)


class VerifyEmailView(APIView):
    permission_classes = (permissions.AllowAny,)

    @staticmethod
    def post(request):
        email = request.data['email']
        code = request.data['code']
        user = User.objects.get(email=email)

        if user.email_verification_code == code:
            user.is_active = True
            user.save()
            return Response(dict(detail="Email address verified successfully"), status=201)
        return Response(dict(detail='The provided email did not match'), status=200)


class ResendEmailView(APIView):
    permission_classes = (permissions.AllowAny,)

    @staticmethod
    def post(request):
        email = request.data['email']
        user = User.objects.get(email=email)

        if user:
            num = randint(100000, 999999)
            user.email_verification_code = num
            user.save()

            try:
                name = user.first_name + ' ' + user.last_name
                message = render_to_string('emails/email_verification.html', {
                    'name': name,
                    'email_verification_code': num,
                })
                email = EmailMessage(
                    'Email Verification', message, to=[user.email]
                )
                email.send()
            except Exception:
                pass
            return Response(dict(detail="Resend email verification code done successfully."), status=201)
        return Response(dict(detail='The provided email did not match'), status=200)


class ResendPhoneView(APIView):
    permission_classes = (permissions.AllowAny,)

    @staticmethod
    def post(request):
        phone_number = request.data['phone_number']
        user = User.objects.get(phone_number=phone_number)

        if user:
            num = randint(100000, 999999)
            user.email_verification_code = num
            user.save()

            try:
                name = user.first_name + ' ' + user.last_name
                message = render_to_string('emails/email_verification.html', {
                    'name': name,
                    'email_verification_code': num,
                })
                email = EmailMessage(
                    'Email Verification', message, to=[user.email]
                )
                email.send()
            except Exception:
                pass
            return Response(dict(detail="Resend email verification code done successfully."), status=201)
        return Response(dict(detail='The provided email did not match'), status=200)


class ResetPasswordAPIView(APIView):
    permission_classes = (permissions.AllowAny,)

    @staticmethod
    def post(request, *args, **kwargs):
        email = request.data['email']
        user = User.objects.get(username=email)
        if user:
            password_reset_url = '%s/login/reset_password?uid=%s&token=%s' % (request.build_absolute_uri('/')[:-1],
                                                                             urlsafe_base64_encode(force_bytes(user.pk)),
                                                                             TokenGenerator().make_token(user))

            try:
                name = user.first_name + ' ' + user.last_name
                message = render_to_string('emails/reset_password.html', {
                    'name': name,
                    'password_set_url': password_reset_url,
                })
                email = EmailMessage(
                    'Please reset your password.', message, to=[user.email]
                )
                email.send()
            except Exception:
                pass
            return Response(status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_404_NOT_FOUND)


class CreatePasswordAPIView(APIView):
    permission_classes = (permissions.AllowAny,)

    @staticmethod
    def post(request, *args, **kwargs):
        try:
            uid = force_text(urlsafe_base64_decode(request.data['uid']))
            user = User.objects.get(pk=uid)
            if user is None or not TokenGenerator().check_token(user, request.data['token']):
                return Response(status=status.HTTP_400_BAD_REQUEST)
            try:
                user.set_password(request.data['password'])
                user.is_active = True
                user.save()
            except IntegrityError:
                return Response({
                    'password': 'Password already exists.',
                    'errors': {'password': 'Password already exists.'}
                }, status=status.HTTP_400_BAD_REQUEST)
        except Exception:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_204_NO_CONTENT)


class UserViewSet(viewsets.ViewSet):

    @staticmethod
    def list(request):
        # admin_id = request.user.profile.admin_id
        # select_users = User.objects.filter(profile__admin_id=admin_id)
        users = User.objects.order_by('-date_joined')
        serializer = UserSerializer(users, many=True)
        return Response(data=serializer.data, status=status.HTTP_200_OK)

    @staticmethod
    def create(request):
        serializer = CreateUserSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({
                'message': 'Some fields are missing',
                'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        data = serializer.validated_data
        try:
            user = User.objects.create(username=data['email'], email=data['email'], first_name=data['first_name'],
                                       last_name=data['last_name'], is_active=False, phone_number=data['phone_number'],)
        except IntegrityError:
            return Response({
                'message': 'Email already exists.',
                'errors': {'email': 'Email already exists.'}
                 }, status=status.HTTP_400_BAD_REQUEST)

        password_set_url = '%s/login/create_password?uid=%s&token=%s' % (request.build_absolute_uri('/')[:-1],
                                                                         urlsafe_base64_encode(force_bytes(user.pk)),
                                                                         TokenGenerator().make_token(user))

        return Response(data=UserSerializer(user).data, status=status.HTTP_201_CREATED)

    @staticmethod
    def update(request, pk=None):
        user = User.objects.get(pk=pk)
        try:
            user.first_name = request.data['first_name']
            user.last_name = request.data['last_name']
            user.email = request.data['email']
            user.username = request.data['email']
            user.save()
        except IntegrityError:
            return Response({
                'message': 'Email already exists.',
                'errors': {'email': 'Email already exists.'}
            }, status=status.HTTP_400_BAD_REQUEST)

        # user.profile.phone_number = request.data['phone_number']
        # user.profile.user_role = int(request.data['user_role'])
        # user.profile.save()
        return Response(data=UserSerializer(user).data, status=status.HTTP_200_OK)

    @staticmethod
    def destroy(request, pk=None):
        user = User.objects.get(pk=pk)
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class IDViewSet(viewsets.ViewSet):
    @staticmethod
    def list(request):
        ids = ID.objects.order_by('-updated_at')
        serializer = IDSerializer(ids, many=True)
        return Response(data=serializer.data, status=status.HTTP_200_OK)

    @staticmethod
    def create(request):
        serializer = CreateIDSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({
                'message': 'Some fields are missing',
                'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        data = serializer.validated_data
        roles = []
        for index in data['id_role']:
            id_role = index['label']
            roles.append(id_role)
        ids = ID.objects.create(id_name=data['id_name'], id_type=data['id_type'], id_role=roles,
                                info=data['id_info'], status=data['status'])

        return Response(data=IDSerializer(ids).data, status=status.HTTP_201_CREATED)

    @staticmethod
    def update(request, pk=None):
        sel_id = ID.objects.get(pk=pk)

        sel_id.id_name = request.data['id_name']
        sel_id.id_type = request.data['id_type']
        sel_id.id_info = request.data['id_info']
        sel_id.status = request.data['status']

        roles = []
        for index in request.data['id_role']:
            id_role = index['label']
            roles.append(id_role)
        sel_id.id_role = roles
        sel_id.save()

        return Response(data=IDSerializer(sel_id).data, status=status.HTTP_200_OK)

    @staticmethod
    def destroy(request, pk=None):
        ids = ID.objects.get(pk=pk)
        ids.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class EntityViewSet(viewsets.ViewSet):
    @staticmethod
    def list(request):
        entities = Entities.objects.order_by('-start_date')
        serializer = EntitySerializer(entities, many=True)
        return Response(data=serializer.data, status=status.HTTP_200_OK)

    @staticmethod
    def create(request):
        serializer = CreateEntitySerializer(data=request.data)
        if not serializer.is_valid():
            return Response({
                'message': 'Some fields are missing',
                'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        data = serializer.validated_data
        entities = Entities.objects.create(entity_id=data['entity_id'], entity_type=data['entity_type'],
                                           entity_name=data['entity_name'])

        return Response(data=EntitySerializer(entities).data, status=status.HTTP_201_CREATED)

    @staticmethod
    def update(request, pk=None):
        sel_entity = Entities.objects.get(pk=pk)

        sel_entity.entity_id = request.data['entity_id']
        sel_entity.entity_name = request.data['entity_name']
        sel_entity.entity_type = request.data['entity_type']

        sel_entity.save()

        return Response(data=EntitySerializer(sel_entity).data, status=status.HTTP_200_OK)

    @staticmethod
    def destroy(request, pk=None):
        entity = Entities.objects.get(pk=pk)
        entity.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ModelViewSet(viewsets.ViewSet):
    @staticmethod
    def list(request):
        model = COAModel.objects.order_by('-model_name')
        serializer = ModelSerializer(model, many=True)
        return Response(data=serializer.data, status=status.HTTP_200_OK)

    @staticmethod
    def create(request):
        serializer = CreateModelSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({
                'message': 'Some fields are missing',
                'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        data = serializer.validated_data
        model = COAModel.objects.create(model_name=data['model_name'], status=data['status'])

        return Response(data=ModelSerializer(model).data, status=status.HTTP_201_CREATED)

    @staticmethod
    def update(request, pk=None):
        sel_model = COAModel.objects.get(pk=pk)

        sel_model.model_name = request.data['model_name']
        sel_model.status = request.data['status']

        sel_model.save()

        return Response(data=ModelSerializer(sel_model).data, status=status.HTTP_200_OK)

    @staticmethod
    def destroy(request, pk=None):
        model = COAModel.objects.get(pk=pk)
        model.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class AccountViewSet(viewsets.ViewSet):
    @staticmethod
    def list(request):
        accounts = COAModel.objects.order_by('-account_id')
        serializer = AccountSerializer(accounts, many=True)
        return Response(data=serializer.data, status=status.HTTP_200_OK)

    @staticmethod
    def create(request):
        serializer = CreateAccountSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({
                'message': 'Some fields are missing',
                'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        data = serializer.validated_data
        account = Accounts.objects.create(
            account_id=data['account_id'], description=data['description'], info=data['info'],
            account_type=data['account_type'], sub_type=data['sub_type'], activity=data['activity'])

        return Response(data=AccountSerializer(account).data, status=status.HTTP_201_CREATED)

    @staticmethod
    def update(request, pk=None):
        sel_account = Accounts.objects.get(pk=pk)

        sel_account.account_id = request.data['account_id']
        sel_account.description = request.data['description']
        sel_account.info = request.data['info']
        sel_account.account_type = request.data['account_type']
        sel_account.sub_type = request.data['sub_type']
        sel_account.activity = request.data['activity']

        sel_account.save()

        return Response(data=AccountSerializer(sel_account).data, status=status.HTTP_200_OK)

    @staticmethod
    def destroy(request, pk=None):
        account = Accounts.objects.get(pk=pk)
        account.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class JournalViewSet(viewsets.ViewSet):
    @staticmethod
    def list(request):
        journals = Journals.objects.order_by('-created_at')
        serializer = JournalSerializer(journals, many=True)
        return Response(data=serializer.data, status=status.HTTP_200_OK)

    @staticmethod
    def create(request):
        serializer = CreateJournalSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({
                'message': 'Some fields are missing',
                'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        data = serializer.validated_data
        journal = Journals.objects.create(journal_id=data['journal_id'], journal_name=data['journal_name'],
                                          info=data['info'], avail_entities=data['avail_entities'])

        return Response(data=JournalSerializer(journal).data, status=status.HTTP_201_CREATED)

    @staticmethod
    def update(request, pk=None):
        sel_journal = Journals.objects.get(pk=pk)

        sel_journal.journal_id = request.data['journal_id']
        sel_journal.journal_name = request.data['journal_name']
        sel_journal.info = request.data['info']
        sel_journal.avail_entities = request.data['avail_entities']

        sel_journal.save()

        return Response(data=JournalSerializer(sel_journal).data, status=status.HTTP_200_OK)

    @staticmethod
    def destroy(request, pk=None):
        journal = Journals.objects.get(pk=pk)
        journal.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class PlanViewSet(viewsets.ViewSet):
    @staticmethod
    def list(request):
        plans = Plans.objects.order_by('-created_at')
        serializer = PlanSerializer(plans, many=True)
        return Response(data=serializer.data, status=status.HTTP_200_OK)

    @staticmethod
    def create(request):
        serializer = CreatePlanSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({
                'message': 'Some fields are missing',
                'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        data = serializer.validated_data
        plan = Plans.objects.create(plan_id=data['plan_id'], type=data['type'], total=data['total'],
                                    info=data['info'], rows=data['rows'], year=data['year'])

        return Response(data=PlanSerializer(plan).data, status=status.HTTP_201_CREATED)

    @staticmethod
    def update(request, pk=None):
        sel_plan = Plans.objects.get(pk=pk)

        sel_plan.plan_id = request.data['plan_id']
        sel_plan.type = request.data['type']
        sel_plan.info = request.data['info']
        sel_plan.rows = request.data['rows']
        sel_plan.total = request.data['total']
        sel_plan.year = request.data['year']

        sel_plan.save()

        return Response(data=PlanSerializer(sel_plan).data, status=status.HTTP_200_OK)

    @staticmethod
    def destroy(request, pk=None):
        plan = Plans.objects.get(pk=pk)
        plan.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class TransIDsViewSet(viewsets.ViewSet):
    @staticmethod
    def list(request):
        trans_ids = TransIDs.objects.order_by('-updated_at')
        serializer = TransIDSerializer(trans_ids, many=True)
        return Response(data=serializer.data, status=status.HTTP_200_OK)

    @staticmethod
    def create(request):
        serializer = CreateTransIDSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({
                'message': 'Some fields are missing',
                'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        data = serializer.validated_data
        trans_id = TransIDs.objects.create(
            trans_num=data['trans_num'], trans_user=data['trans_user'], type=data['type'], amount=data['amount'],
            info=data['info'], credit=data['credit'], debit=data['debit'], reference=data['reference'],
            version=data['version'], entity=data['entity'], status=data['status']
        )

        return Response(data=TransIDSerializer(trans_id).data, status=status.HTTP_201_CREATED)

    @staticmethod
    def update(request, pk=None):
        sel_trans_id = TransIDs.objects.get(pk=pk)

        sel_trans_id.trans_num = request.data['trans_num']
        sel_trans_id.trans_user = request.data['trans_user']
        sel_trans_id.info = request.data['info']
        sel_trans_id.type = request.data['type']
        sel_trans_id.amount = request.data['amount']
        sel_trans_id.credit = request.data['credit']
        sel_trans_id.debit = request.data['debit']
        sel_trans_id.reference = request.data['reference']
        sel_trans_id.version = request.data['version']
        sel_trans_id.entity = request.data['entity']
        sel_trans_id.status = request.data['status']

        sel_trans_id.save()

        return Response(data=TransIDSerializer(sel_trans_id).data, status=status.HTTP_200_OK)

    @staticmethod
    def destroy(request, pk=None):
        trans_id = TransIDs.objects.get(pk=pk)
        trans_id.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class TransTypesViewSet(viewsets.ViewSet):
    @staticmethod
    def list(request):
        trans_types = TransTypes.objects.order_by('-updated_at')
        serializer = TransTypeSerializer(trans_types, many=True)
        return Response(data=serializer.data, status=status.HTTP_200_OK)

    @staticmethod
    def create(request):
        serializer = CreateTransTypeSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({
                'message': 'Some fields are missing',
                'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        data = serializer.validated_data
        trans_type = TransTypes.objects.create(
            type=data['type'], financial=data['financial'], info=data['info'], journals=data['journals']
        )

        return Response(data=TransTypeSerializer(trans_type).data, status=status.HTTP_201_CREATED)

    @staticmethod
    def update(request, pk=None):
        sel_trans_type = TransTypes.objects.get(pk=pk)

        sel_trans_type.type = request.data['type']
        sel_trans_type.financial = request.data['financial']
        sel_trans_type.info = request.data['info']
        sel_trans_type.journals = request.data['journals']

        sel_trans_type.save()

        return Response(data=TransTypeSerializer(sel_trans_type).data, status=status.HTTP_200_OK)

    @staticmethod
    def destroy(request, pk=None):
        trans_type = TransTypes.objects.get(pk=pk)
        trans_type.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ContactInfoViewSet(viewsets.ViewSet):
    @staticmethod
    def list(request):
        contact_info = ContactInfo.objects.order_by('-updated_at')
        serializer = ContactInfoSerializer(contact_info, many=True)
        return Response(data=serializer.data, status=status.HTTP_200_OK)

    @staticmethod
    def create(request):
        serializer = CreateContactInfoSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({
                'message': 'Some fields are missing',
                'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        data = serializer.validated_data
        contact_info = ContactInfo.objects.create(
            contact_id=data['contact_id'], name=data['name'], title=data['title'],
            type=data['type'], value=data['value'], location=data['location'], info=data['info']
        )

        return Response(data=ContactInfoSerializer(contact_info).data, status=status.HTTP_201_CREATED)

    @staticmethod
    def update(request, pk=None):
        sel_contact_info = ContactInfo.objects.get(pk=pk)

        sel_contact_info.contact_id = request.data['contact_id']
        sel_contact_info.name = request.data['name']
        sel_contact_info.title = request.data['title']
        sel_contact_info.type = request.data['type']
        sel_contact_info.location = request.data['location']
        sel_contact_info.info = request.data['info']
        sel_contact_info.value = request.data['value']

        sel_contact_info.save()

        return Response(data=ContactInfoSerializer(sel_contact_info).data, status=status.HTTP_200_OK)

    @staticmethod
    def destroy(request, pk=None):
        contact_info = ContactInfo.objects.get(pk=pk)
        contact_info.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ContactAddressViewSet(viewsets.ViewSet):
    @staticmethod
    def list(request):
        contact_address = ContactAddress.objects.order_by('-updated_at')
        serializer = ContactAddressSerializer(contact_address, many=True)
        return Response(data=serializer.data, status=status.HTTP_200_OK)

    @staticmethod
    def create(request):
        serializer = CreateContactAddressSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({
                'message': 'Some fields are missing',
                'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        data = serializer.validated_data
        contact_address = ContactAddress.objects.create(
            contact_id=data['contact_id'], type=data['type'], address1=data['address1'], address2=data['address2'],
            city=data['city'], state=data['state'], zip=data['zip'], info=data['info'], location=data['location']
        )

        return Response(data=ContactAddressSerializer(contact_address).data, status=status.HTTP_201_CREATED)

    @staticmethod
    def update(request, pk=None):
        sel_contact_address = ContactAddress.objects.get(pk=pk)

        sel_contact_address.contact_id = request.data['contact_id']
        sel_contact_address.type = request.data['type']
        sel_contact_address.address1 = request.data['address1']
        sel_contact_address.address2 = request.data['address2']
        sel_contact_address.city = request.data['city']
        sel_contact_address.state = request.data['state']
        sel_contact_address.location = request.data['location']
        sel_contact_address.info = request.data['info']
        sel_contact_address.zip = request.data['zip']

        sel_contact_address.save()

        return Response(data=ContactAddressSerializer(sel_contact_address).data, status=status.HTTP_200_OK)

    @staticmethod
    def destroy(request, pk=None):
        contact_address = ContactAddress.objects.get(pk=pk)
        contact_address.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class RolesViewSet(viewsets.ViewSet):
    @staticmethod
    def list(request):
        roles = Roles.objects.order_by('-updated_at')
        serializer = RolesSerializer(roles, many=True)
        return Response(data=serializer.data, status=status.HTTP_200_OK)

    @staticmethod
    def create(request):
        serializer = CreateRolesSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({
                'message': 'Some fields are missing',
                'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        data = serializer.validated_data
        roles = Roles.objects.create(
            role_name=data['role_name'], user_count=data['user_count']
        )

        return Response(data=RolesSerializer(roles).data, status=status.HTTP_201_CREATED)

    @staticmethod
    def update(request, pk=None):
        sel_roles = Roles.objects.get(pk=pk)

        sel_roles.role_name = request.data['roleName']
        sel_roles.user_count = request.data['userCount']

        sel_roles.save()

        return Response(data=RolesSerializer(sel_roles).data, status=status.HTTP_200_OK)

    @staticmethod
    def destroy(request, pk=None):
        role = Roles.objects.get(pk=pk)
        role.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class UserRoleActionsViewSet(viewsets.ViewSet):
    @staticmethod
    def list(request):
        user_role_actions = UserRoleActions.objects.order_by('-updated_at')
        serializer = UserRoleActionsSerializer(user_role_actions, many=True)
        # print(serializer.data)
        return Response(data=serializer.data, status=status.HTTP_200_OK)

    @staticmethod
    def create(request):
        serializer = CreateUserRoleActionsSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({
                'message': 'Some fields are missing',
                'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        data = serializer.validated_data
        user_role_actions = UserRoleActions.objects.create(
            user=data['user'], role=data['role'], actions_allowed=data['actions_allowed']
        )

        return Response(data=UserRoleActionsSerializer(user_role_actions).data, status=status.HTTP_201_CREATED)

    @staticmethod
    def update(request, pk=None):
        sel_UserRoleActions = UserRoleActions.objects.get(pk=pk)

        sel_UserRoleActions.user = request.data['user']
        sel_UserRoleActions.role = request.data['role']
        sel_UserRoleActions.actions_allowed = request.data['actions_allowed']

        sel_UserRoleActions.save()

        return Response(data=UserRoleActionsSerializer(sel_UserRoleActions).data, status=status.HTTP_200_OK)

    @staticmethod
    def destroy(request, pk=None):
        user_role_action = UserRoleActions.objects.get(pk=pk)
        user_role_action.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class MenuItemsViewSet(viewsets.ViewSet):
    @staticmethod
    def list(request):
        menu_items = MenuItems.objects.order_by('-updated_at')
        serializer = MenuItemsSerializer(menu_items, many=True)
        # print(serializer.data)
        return Response(data=serializer.data, status=status.HTTP_200_OK)

    @staticmethod
    def create(request):
        serializer = CreateMenuItemsSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({
                'message': 'Some fields are missing',
                'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        data = serializer.validated_data
        menu_items = MenuItems.objects.create(
            menu_id=data['menu_id'], description=data['description'], status=data['status'], info=data['info'], container_pod=data['container_pod'], help_text=data['help_text'], last_used=data['last_used'], usage_count=data['usage_count'], roles_used=data['roles_used']
        )

        return Response(data=MenuItemsSerializer(menu_items).data, status=status.HTTP_201_CREATED)

    @staticmethod
    def update(request, pk=None):
        sel_MenuItems = MenuItems.objects.get(pk=pk)

        sel_MenuItems.menu_id = request.data['menu_id']
        sel_MenuItems.description = request.data['description']
        sel_MenuItems.status = request.data['status']
        sel_MenuItems.info = request.data['info']
        sel_MenuItems.container_pod = request.data['container_pod']
        sel_MenuItems.help_text = request.data['help_text']
        sel_MenuItems.last_used = request.data['last_used']
        sel_MenuItems.usage_count = request.data['usage_count']
        sel_MenuItems.roles_used = request.data['roles_used']

        sel_MenuItems.save()

        return Response(data=MenuItemsSerializer(sel_MenuItems).data, status=status.HTTP_200_OK)

    @staticmethod
    def destroy(request, pk=None):
        user_role_action = MenuItems.objects.get(pk=pk)
        user_role_action.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class RoleMenuViewSet(viewsets.ViewSet):
    @staticmethod
    def list(request):
        role_menus = RoleMenu.objects.order_by('-updated_at')
        serializer = RoleMenuSerializer(role_menus, many=True)
        # print(serializer.data)
        return Response(data=serializer.data, status=status.HTTP_200_OK)

    @staticmethod
    def create(request):
        serializer = CreateRoleMenuSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({
                'message': 'Some fields are missing',
                'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        data = serializer.validated_data
        role_menus = RoleMenu.objects.create(
            role_name=data['role_name'], menu_id=data['menu_id'], info=data['info'], title=data['title'], type=data['type'], value=data['value'], location=data['location']
        )

        return Response(data=RoleMenuSerializer(role_menus).data, status=status.HTTP_201_CREATED)

    @staticmethod
    def update(request, pk=None):
        sel_RoleMenu = RoleMenu.objects.get(pk=pk)

        sel_RoleMenu.role_name = request.data['role_name']
        sel_RoleMenu.menu_id = request.data['menu_id']
        sel_RoleMenu.title = request.data['title']
        sel_RoleMenu.type = request.data['type']
        sel_RoleMenu.value = request.data['value']
        sel_RoleMenu.location = request.data['location']
        sel_RoleMenu.info = request.data['info']


        sel_RoleMenu.save()

        return Response(data=RoleMenuSerializer(sel_RoleMenu).data, status=status.HTTP_200_OK)

    @staticmethod
    def destroy(request, pk=None):
        user_role_action = RoleMenu.objects.get(pk=pk)
        user_role_action.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ItemsViewSet(viewsets.ViewSet):
    @staticmethod
    def list(request):
        items = Items.objects.order_by('-updated_at')
        serializer = ItemsSerializer(items, many=True)
        # print(serializer.data)
        return Response(data=serializer.data, status=status.HTTP_200_OK)

    @staticmethod
    def create(request):
        serializer = CreateItemsSerializer(data=request.data)
        print(request.data)
        if not serializer.is_valid():
            return Response({
                'message': 'Some fields are missing',
                'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        data = serializer.validated_data
        items = Items.objects.create(
            item_id=data['item_id'], short_description=data['short_description'], long_description=data['long_description'], info=data['info'], item_type=data['item_type'], zip=data['zip'], last_used=data['last_used'], location_name=data['location_name']
        )

        return Response(data=ItemsSerializer(items).data, status=status.HTTP_201_CREATED)

    @staticmethod
    def update(request, pk=None):
        sel_Items = Items.objects.get(pk=pk)

        sel_Items.item_id = request.data['item_id']
        sel_Items.short_description = request.data['short_description']
        sel_Items.long_description = request.data['long_description']
        sel_Items.info = request.data['info']
        sel_Items.item_type = request.data['item_type']
        sel_Items.zip = request.data['zip']
        sel_Items.last_used = request.data['last_used']
        sel_Items.location_name = request.data['location_name']

        sel_Items.save()

        return Response(data=ItemsSerializer(sel_Items).data, status=status.HTTP_200_OK)

    @staticmethod
    def destroy(request, pk=None):
        user_role_action = Items.objects.get(pk=pk)
        user_role_action.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ItemReferencesViewSet(viewsets.ViewSet):
    @staticmethod
    def list(request):
        item_references = ItemReferences.objects.order_by('-updated_at')
        serializer = ItemReferencesSerializer(item_references, many=True)
        # print(serializer.data)
        return Response(data=serializer.data, status=status.HTTP_200_OK)

    @staticmethod
    def create(request):
        serializer = CreateItemReferencesSerializer(data=request.data)
        print(request.data)
        if not serializer.is_valid():
            return Response({
                'message': 'Some fields are missing',
                'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        data = serializer.validated_data
        item_references = ItemReferences.objects.create(
            item_id=data['item_id'], reference_type=data['reference_type'], reference_value=data['reference_value'], reference_source=data['reference_source'], info=data['info']
        )

        return Response(data=ItemReferencesSerializer(item_references).data, status=status.HTTP_201_CREATED)

    @staticmethod
    def update(request, pk=None):
        sel_ItemReferences = ItemReferences.objects.get(pk=pk)

        sel_ItemReferences.item_id = request.data['item_id']
        sel_ItemReferences.reference_type = request.data['reference_type']
        sel_ItemReferences.reference_value = request.data['reference_value']        
        sel_ItemReferences.reference_source = request.data['reference_source']
        sel_ItemReferences.info = request.data['info']

        sel_ItemReferences.save()

        return Response(data=ItemReferencesSerializer(sel_ItemReferences).data, status=status.HTTP_200_OK)

    @staticmethod
    def destroy(request, pk=None):
        item_reference = ItemReferences.objects.get(pk=pk)
        item_reference.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)    


class ItemCountsViewSet(viewsets.ViewSet):
    @staticmethod
    def list(request):
        item_counts = ItemCounts.objects.order_by('-updated_at')
        serializer = ItemCountsSerializer(item_counts, many=True)
        # print(serializer.data)
        return Response(data=serializer.data, status=status.HTTP_200_OK)

    @staticmethod
    def create(request):
        serializer = CreateItemCountsSerializer(data=request.data)
        print(request.data)
        if not serializer.is_valid():
            return Response({
                'message': 'Some fields are missing',
                'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        data = serializer.validated_data
        item_counts = ItemCounts.objects.create(
            item_id=data['item_id'], count_type=data['count_type'], plan_total=data['plan_total'], plan_rows=data['plan_rows'], plan_year=data['plan_year'], info=data['info']
        )

        return Response(data=ItemCountsSerializer(item_counts).data, status=status.HTTP_201_CREATED)

    @staticmethod
    def update(request, pk=None):
        sel_ItemCounts = ItemCounts.objects.get(pk=pk)

        sel_ItemCounts.item_id = request.data['item_id']
        sel_ItemCounts.count_type = request.data['count_type']
        sel_ItemCounts.plan_total = request.data['plan_total']        
        sel_ItemCounts.plan_rows = request.data['plan_rows']
        sel_ItemCounts.plan_year = request.data['plan_year']
        sel_ItemCounts.info = request.data['info']

        sel_ItemCounts.save()

        return Response(data=ItemCountsSerializer(sel_ItemCounts).data, status=status.HTTP_200_OK)

    @staticmethod
    def destroy(request, pk=None):
        item_count = ItemCounts.objects.get(pk=pk)
        item_count.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ItemTransViewSet(viewsets.ViewSet):
    @staticmethod
    def list(request):
        item_trans = ItemTrans.objects.order_by('-updated_at')
        serializer = ItemTransSerializer(item_trans, many=True)
        # print(serializer.data)
        return Response(data=serializer.data, status=status.HTTP_200_OK)

    @staticmethod
    def create(request):
        serializer = CreateItemTransSerializer(data=request.data)
        print(request.data)
        if not serializer.is_valid():
            return Response({
                'message': 'Some fields are missing',
                'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        data = serializer.validated_data
        item_trans = ItemTrans.objects.create(
            trans_id=data['trans_id'], item_id=data['item_id'], tran_date=data['tran_date'], trans_user=data['trans_user'], trans_type=data['trans_type'], entity=data['entity'],reference=data['reference'], quantity=data['quantity'], warehouse=data['warehouse'], location=data['location'], bin=data['bin'], revenue=data['revenue'], cost=data['cost'], notes=data['notes']
        )

        return Response(data=ItemTransSerializer(item_trans).data, status=status.HTTP_201_CREATED)

    @staticmethod
    def update(request, pk=None):
        sel_ItemTrans = ItemTrans.objects.get(pk=pk)

        sel_ItemTrans.trans_id = request.data['trans_id']
        sel_ItemTrans.item_id = request.data['item_id']
        sel_ItemTrans.tran_date = request.data['tran_date']        
        sel_ItemTrans.trans_user = request.data['trans_user']
        sel_ItemTrans.trans_type = request.data['trans_type']
        sel_ItemTrans.entity = request.data['entity']
        sel_ItemTrans.reference = request.data['reference']
        sel_ItemTrans.quantity = request.data['quantity']
        sel_ItemTrans.warehouse = request.data['warehouse']        
        sel_ItemTrans.location = request.data['location']
        sel_ItemTrans.bin = request.data['bin']
        sel_ItemTrans.revenue = request.data['revenue']
        sel_ItemTrans.cost = request.data['cost']
        sel_ItemTrans.notes = request.data['notes']

        sel_ItemTrans.save()

        return Response(data=ItemTransSerializer(sel_ItemTrans).data, status=status.HTTP_200_OK)

    @staticmethod
    def destroy(request, pk=None):
        item_tran = ItemTrans.objects.get(pk=pk)
        item_tran.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)    


class AppDataSetsViewSet(viewsets.ViewSet):
    @staticmethod
    def list(request):
        app_data_sets = AppDataSets.objects.order_by('-updated_at')
        serializer = AppDataSetsSerializer(app_data_sets, many=True)
        # print(serializer.data)
        return Response(data=serializer.data, status=status.HTTP_200_OK)

    @staticmethod
    def create(request):
        serializer = CreateAppDataSetsSerializer(data=request.data)
        print(request.data)
        if not serializer.is_valid():
            return Response({
                'message': 'Some fields are missing',
                'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        data = serializer.validated_data
        app_data_sets = AppDataSets.objects.create(
            table_name=data['table_name'], related=data['related'], record_count=data['record_count'], info=data['info']
        )

        return Response(data=AppDataSetsSerializer(app_data_sets).data, status=status.HTTP_201_CREATED)

    @staticmethod
    def update(request, pk=None):
        sel_AppDataSets = AppDataSets.objects.get(pk=pk)

        sel_AppDataSets.table_name = request.data['table_name']
        sel_AppDataSets.related = request.data['related']
        sel_AppDataSets.record_count = request.data['record_count']        
        sel_AppDataSets.info = request.data['info']

        sel_AppDataSets.save()

        return Response(data=AppDataSetsSerializer(sel_AppDataSets).data, status=status.HTTP_200_OK)

    @staticmethod
    def destroy(request, pk=None):
        app_data_set = AppDataSets.objects.get(pk=pk)
        app_data_set.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)            