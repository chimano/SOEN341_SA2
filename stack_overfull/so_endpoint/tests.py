from django.test import TestCase
from django.test import Client

from so_endpoint.models import *
import json

# Create your tests here.

def login_or_create(client, username, password):
    """ Creates a new user if the user doesn't exist.
        Logs the user in with passed username and password
        Stores the session id in the passed client """

    if not User.objects.filter(username=username).exists():
        User.objects.create_user(username=username, password=password)

    is_logged_in = client.login(username=username, password=password)
    return is_logged_in


class UserViewTests(TestCase):

    def test_user_view(self):
        response = self.client.get('/api/user/')
        user_list = response.json()['user_list']

        self.assertIs(response.status_code, 200)
        self.assertEqual(len(user_list), User.objects.count())

class UserMeViewTests(TestCase):

    def test_user_not_logged(self):
        response = self.client.get('/api/user/me/')

        self.assertEqual(response.status_code, 400) # why 200
        self.assertTrue('error' in response.json())

    def test_user_logged(self):

        is_logged_in = login_or_create(self.client, 'TestUser', '12345')
        self.assertTrue(is_logged_in)

        response = self.client.get('/api/user/me/')
        response_body = response.json()

        self.assertIs(response.status_code, 200)
        self.assertIsNotNone(response_body['profile'])


class UserRegisterViewTests(TestCase):

    def test_valid_request(self):

        json_payload = json.dumps({
            "username": "TestUserRegister",
            "password": "12345",
            "email": "test@mail.com"
        })

        response = self.client.post(
            '/api/user/register/',
            data=json_payload,
            content_type='application/json'
        )

        response_body = response.json()

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response_body['username'], 'TestUserRegister')
        self.assertIsNotNone(response_body['profile'])

    def test_invalid_request(self):

        json_payload = json.dumps({
            "username": None,
            "password": "123"
        })

        response = self.client.post(
            '/api/user/register/',
            data=json_payload,
            content_type='application/json'
        )

        self.assertEqual(response.status_code, 400)

    def test_username_already_exists(self):
        login_or_create(Client(), 'TestUsernameExists', '12345')

        json_payload = json.dumps({
            "username": "TestUsernameExists",
            "password": "12345",
            "email": "test@mail.com"
        })

        response = self.client.post(
            '/api/user/register/',
            data=json_payload,
            content_type='application/json'
        )

        response_body = response.json()

        self.assertEqual(response.status_code, 400) # why 200
        self.assertTrue('error' in response_body)

class UserLoginViewTests(TestCase):

    def test_valid_request(self):

        login_or_create(Client(), 'TestUserLogin', "12345")

        json_payload = json.dumps({
            "username": "TestUserLogin",
            "password": "12345"
        })

        response = self.client.post(
            '/api/user/login/',
            data=json_payload,
            content_type='application/json'
        )

        response_body = response.json()

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response_body['username'], 'TestUserLogin')
        self.assertIsNotNone(response_body['profile'])

    def test_invalid_request(self):

        json_payload = json.dumps({
            "username": None,
            "password": "12345"
        })

        response = self.client.post(
            '/api/user/register/',
            data=json_payload,
            content_type='application/json'
        )

        self.assertEqual(response.status_code, 400)
        self.assertTrue('error' in response.json())

    def test_invalid_password(self):
        login_or_create(Client(), 'TestUserLogin', '12345')

        json_payload = json.dumps({
            "username": "TestUserLogin",
            "password": "123xx"
        })

        response = self.client.post(
            '/api/user/register/',
            data=json_payload,
            content_type='application/json'
        )

        self.assertEqual(response.status_code, 400) # why 200
        self.assertTrue('error' in response.json())



class QuestionViewTest(TestCase):
    login_info = {
        'username': 'testuser',
        'password': 'testpassword'
    }

    @classmethod
    def setUpTestData(cls):
        Question.objects.create(question_head="Test Question?", question_text="Test Body?")
        User.objects.create_user(username=cls.login_info['username'], password=cls.login_info['password'])



    def test_valid_question_post(self):
        self.client.post(
            '/api/user/login/',
            data=json.dumps(self.login_info),
            content_type='application/json'
        )
        json_payload = json.dumps({
            "question_head": "Testing question header?",
            "question_text": "Testing question body."
        })
        response = self.client.post(
            '/api/question/',
            data=json_payload,
            content_type='application/json'
        )

        self.assertEqual(response.status_code, 200)
        self.assertTrue('id' in response.json())
    
    def test_invalid_question_post(self):

        json_payload = json.dumps({
            "question_head": "Testing question header?",
            "question_text": "Testing question body."
        })

        response = self.client.post(
            '/api/question/',
            data=json_payload,
            content_type='application/json'
        )

        self.assertEqual(response.status_code, 400)
        self.assertTrue('error' in response.json())
    
    def test_invalid_short_question_post(self):

        json_payload = json.dumps({
            "question_head": "a",
            "question_text": "Testing question body."
        })

        response = self.client.post(
            '/api/question/',
            data=json_payload,
            content_type='application/json'
        )

        self.assertEqual(response.status_code, 400)
        self.assertTrue('error' in response.json())
    
    def test_valid_question_get(self):

        data = {
            "id": "1"
        }

        response = self.client.get('/api/question/', data)
        self.assertEqual(response.status_code, 200)

    def test_invalid_question_get(self):

        data = {
            "id": "012302011"
        }

        response = self.client.get('/api/question/', data)
        self.assertEqual(response.status_code, 400)
        self.assertTrue('error' in response.json())

    def test_question_list_get(self):

        data = {
            "order": "asc",
            "limit": 20,
            "sort": "date_created"
        }

        response = self.client.get('/api/question/', data)
        self.assertEqual(response.status_code, 200)
    
    @classmethod
    def tearDownClass(cls):
        Question.objects.all().delete()
        User.objects.all().delete()