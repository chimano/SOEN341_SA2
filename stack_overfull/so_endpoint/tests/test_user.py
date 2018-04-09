"""
This module contains all tests related to users and their profiles
"""
import json

from django.contrib.auth.models import User
from django.test import TestCase
from django.test import Client

from so_endpoint.models import Question, Answer, Job


def login_or_create(client, username, password):
    """ Creates a new user if the user doesn't exist.
        Logs the user in with passed username and password
        Stores the session id in the passed client """

    if not User.objects.filter(username=username).exists():
        User.objects.create_user(username=username, password=password)

    is_logged_in = client.login(username=username, password=password)
    return is_logged_in


class UserViewTests(TestCase):

    @classmethod
    def setUpTestData(cls):
        # Sets up data base for testcases
        User.objects.create_user(username="testuser", password="testpassword")
        User.objects.create_user(username="testuser2", password="testpassword")
        User.objects.create_user(username="myuser", password="testpassword")

    def test_user_view(self):
        response = self.client.get(
            '/api/user/',
            data={"limit": 10}
        )
        user_list = response.json()['user_list']

        self.assertIs(response.status_code, 200)
        self.assertEqual(len(user_list), 3)

    def test_userview_inname(self):
        response = self.client.get(
            '/api/user/',
            data={"inname": "testuser", "limit": 10}
        )
        user_list = response.json()['user_list']

        self.assertIs(response.status_code, 200)
        self.assertEqual(len(user_list), 2)

    @classmethod
    def tearDownClass(cls):
        User.objects.all().delete()


class UserMeViewTests(TestCase):

    def test_user_not_logged(self):
        response = self.client.get('/api/user/me/')

        self.assertEqual(response.status_code, 400)
        self.assertTrue('error' in response.json())

    def test_user_logged(self):

        is_logged_in = login_or_create(self.client, 'TestUser', '12345')
        self.assertTrue(is_logged_in)

        response = self.client.get('/api/user/me/')
        response_body = response.json()

        self.assertIs(response.status_code, 200)
        self.assertIsNotNone(response_body['profile'])

    @classmethod
    def tearDownClass(cls):
        User.objects.all().delete()


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

        self.assertEqual(response.status_code, 400)
        self.assertTrue('error' in response_body)

    @classmethod
    def tearDownClass(cls):
        User.objects.all().delete()


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

        self.assertEqual(response.status_code, 400)
        self.assertTrue('error' in response.json())

    @classmethod
    def tearDownClass(cls):
        User.objects.all().delete()


class ProfileJobViewTest(TestCase):
    login_info = {
        'username': 'testuser',
        'password': 'testpassword'
    }
    job_info = {
        'category': 'coordinator',
        'job_type': 'Contract',
        'position': 'Coordinator',
        'company': 'Google',
        'location': 'Montreal',
        'description': 'Lorem ipsum dolor sit amet, ut \
        qui vero detraxit. No enim iudico vix, \
        in sea legendos deseruisse. Qui utinam \
        vituperata neglegentur ei, mazim iudico \
        virtute te vim, officiis ocurreret no eum. \
        Assum aperiri ancillae cu ius, oratio \
        adipiscing ad nam.'
    }

    @classmethod
    def setUpTestData(cls):
        # Sets up database for the testcases
        author = User.objects.create_user(id=1,
                                          username=cls.login_info['username'],
                                          password=cls.login_info['password'],
                                          )
        author.profile.is_employer = True
        author.save()
        Job.objects.create(position=cls.job_info['position'],
                           job_type=cls.job_info['job_type'],
                           category=cls.job_info['category'],
                           company=cls.job_info['company'],
                           location=cls.job_info['location'],
                           description=cls.job_info['description'],
                           posted_by=author)

    def test_valid_request(self):
        # Test with valid username
        response = self.client.get(
            '/api/user/name/' + self.login_info['username'] + '/jobs/'
        )
        self.assertEqual(1, len(response.json()['posted_positions']))

    def test_invalid_request(self):
        # Test with invalid username
        response = self.client.get(
            '/api/user/name/fakeuser/questions/'
        )
        self.assertEqual(400, response.status_code)

    @classmethod
    def tearDownClass(cls):
        Job.objects.all().delete()
        User.objects.all().delete()


class ProfileQuestionViewTest(TestCase):
    login_info = {
        'username': 'testuser',
        'password': 'testpassword'
    }

    @classmethod
    def setUpTestData(cls):
        # Sets up database for the testcases
        author = User.objects.create_user(
            id=1, username=cls.login_info['username'], password=cls.login_info['password'])
        responder = User.objects.create_user(
            id=2, username='second', password='12345')
        qid = Question.objects.create(
            id=1, question_head="Author's q", question_text="Test Body", user_id=author)
        Answer.objects.create(id=1, answer_text="Test answer",
                              question_id=qid, user_id=responder)
        Answer.objects.create(id=2, answer_text="Test answer2",
                              question_id=qid, user_id=responder)

    def test_valid_request(self):
        # Test search by question_head
        response = self.client.get(
            '/api/user/name/' + self.login_info['username'] + '/questions/'
        )
        self.assertEqual(1, len(response.json()['asked_questions']))
        self.assertEqual(0, len(response.json()['answered_questions']))

    def test_invalid_request(self):
        # Test search by question_head
        response = self.client.get(
            '/api/user/name/fakeuser/questions/'
        )
        self.assertEqual(400, response.status_code)

    @classmethod
    def tearDownClass(cls):
        Question.objects.all().delete()
        User.objects.all().delete()
