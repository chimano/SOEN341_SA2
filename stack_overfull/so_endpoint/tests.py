from django.test import TestCase
from django.test import Client

from so_endpoint.models import *
from so_endpoint.views import add_tags_to_question
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

    @classmethod
    def setUpTestData(cls):
        #Sets up data base for testcases
        User.objects.create_user(username="testuser", password="testpassword")
        User.objects.create_user(username="testuser2", password="testpassword")
        User.objects.create_user(username="myuser", password="testpassword")


    def test_user_view(self):
        response = self.client.get(
            '/api/user/',
            data = {"limit": 10}
        )
        user_list = response.json()['user_list']

        self.assertIs(response.status_code, 200)
        self.assertEqual(len(user_list), 3)


    def test_userview_inname(self):
        response = self.client.get(
            '/api/user/',
            data = {"inname": "testuser", "limit": 10}
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

class JobViewTest(TestCase):
    
    def test_valid_job_post(self):
        json_payload = json.dumps({
            "position":"front-end developper",
            "job_type":"Full-time",
            "category":"computer_science",
            "company":"Apple",
            "location":"Montreal",
            "description":"Bring your competitive spirit, your love of innovation, and your desire to be at the forefront of an evolutionary change in our digital workforce. Now is the time to become a part of an exciting company where your ideas, passion and commitment to excellence will have a direct impact on the products that we build, the new markets we create and the people that we engage."
        })
        response = self.client.post(
            '/api/job/',
            data=json_payload,
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 200)
        self.assertTrue('success' in response.json())

    def test_invalid_category_job_post(self):
        json_payload = json.dumps({
            "position":"front-end developper",
            "job_type":"Full-time",
            "category":"procrastinating",
            "company":"Apple",
            "location":"Montreal",
            "description":"we are searching for student"
        })
        response = self.client.post(
            '/api/job/',
            data=json_payload,
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 400)
        self.assertTrue('error' in response.json())

    def test_invalid_type_job_post(self):
        json_payload = json.dumps({
            "position":"front-end developper",
            "job_type":"half-time",
            "category":"computer_science",
            "company":"Apple",
            "location":"Montreal",
            "description":"we are searching for student"
        })
        response = self.client.post(
            '/api/job/',
            data=json_payload,
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 400)
        self.assertTrue('error' in response.json())

    def test_invalid_description_length_job_post(self):
        json_payload = json.dumps({
            "position":"front-end developper",
            "job_type":"Full-time",
            "category":"computer_science",
            "company":"Apple",
            "location":"Montreal",
            "description":"we are searching for student"
        })
        response = self.client.post(
            '/api/job/',
            data=json_payload,
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 400)
        self.assertTrue('error' in response.json())
    
    def test_invalid_empty_input_job_post(self):
        json_payload = json.dumps({
            "position":"",
            "job_type":"Full-time",
            "category":"computer_science",
            "company":"Apple",
            "location":"Montreal",
            "description":"Bring your competitive spirit, your love of innovation, and your desire to be at the forefront of an evolutionary change in our digital workforce. Now is the time to become a part of an exciting company where your ideas, passion and commitment to excellence will have a direct impact on the products that we build, the new markets we create and the people that we engage."
        })
        response = self.client.post(
            '/api/job/',
            data=json_payload,
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 400)
        self.assertTrue('error' in response.json())

    def test_valid_job_get(self):
        #Sends a get request with a valid category
        data = {
            "category" : "computer_science"
        }

        response = self.client.get('/api/job/', data)
        self.assertEqual(response.status_code, 200)
    
    def test_invalid_job_get(self):
        #Sends a get request with a valid category
        data = {
            "category" : "assassination"
        }
        response = self.client.get('/api/job/', data)
        
        self.assertEqual(response.status_code, 400)
        self.assertTrue('error' in response.json())

class QuestionViewTest(TestCase):
    login_info = {
        'username': 'testuser',
        'password': 'testpassword'
    }

    @classmethod
    def setUpTestData(cls):
        #Sets up data base for testcases
        Question.objects.create(id=1,question_head="Test Question?", question_text="Test Body?")

        tag = Tag.objects.create(tag_text="testtag")
        tagged = Question.objects.create(id=2,question_head="Test Question Tags?", question_text="Test Tags Body?")
        tagged.tags.set([tag])

        User.objects.create_user(username=cls.login_info['username'], password=cls.login_info['password'])

    def test_valid_question_post(self):
        #Sends a valid post request
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
        #Sends post request without logging in
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
        #Sends a post request with a 1 character question
        self.client.post(
            '/api/user/login/',
            data=json.dumps(self.login_info),
            content_type='application/json'
        )
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

    def test_valid_question_post_with_tags(self):
        #Sends a valid post request
        self.client.post(
            '/api/user/login/',
            data=json.dumps(self.login_info),
            content_type='application/json'
        )
        json_payload = json.dumps({
            "question_head": "Question header",
            "question_text": "Question text",
            "tags": ["tag1", "tag2"]
        })
        response = self.client.post(
            '/api/question/',
            data=json_payload,
            content_type='application/json'
        )

        json_response = response.json()

        self.assertEqual(response.status_code, 200)
        self.assertTrue('id' in json_response)

        tags = Question.objects.get(pk=json_response['id']).tags

        self.assertTrue(tags.filter(tag_text='tag1').exists())
        self.assertTrue(tags.filter(tag_text='tag2').exists())


    def test_valid_question_get(self):
        #Sends a get request with a valid id
        data = {
            "id": "1"
        }

        response = self.client.get('/api/question/', data)
        self.assertEqual(response.status_code, 200)

    def test_invalid_question_get(self):
        #Sends a get request with an invalid id
        data = {
            "id": "012302011"
        }

        response = self.client.get('/api/question/', data)
        self.assertEqual(response.status_code, 400)
        self.assertTrue('error' in response.json())

    def test_question_list_get(self):
        #Sends a valid get request to get question list
        data = {
            "order": "asc",
            "limit": 20,
            "sort": "date_created"
        }

        response = self.client.get('/api/question/', data)
        self.assertEqual(response.status_code, 200)

    def test_question_list_get_with_tags(self):
        #Sends a valid get request to get question list
        data = {
            "order": "asc",
            "limit": 20,
            "sort": "date_created",
            "tags[]": ['testtag']
        }

        response = self.client.get('/api/question/', data)
        question_list = response.json()['question_list']

        self.assertEqual(response.status_code, 200)
        self.assertTrue( len(question_list) == 1)

    @classmethod
    def tearDownClass(cls):
        Question.objects.all().delete()
        Tag.objects.all().delete()
        User.objects.all().delete()


class AnswerViewTest(TestCase):
    login_info = {
        'username': 'testuser',
        'password': 'testpassword'
    }

    @classmethod
    def setUpTestData(cls):
        #Sets up database for the testcases
        Question.objects.create(id=1,question_head="Test Question?", question_text="Test Body?")
        User.objects.create_user(username=cls.login_info['username'], password=cls.login_info['password'])


    def test_valid_answer_post(self):
        #Sends a valid answer
        self.client.post(
            '/api/user/login/',
            data=json.dumps(self.login_info),
            content_type='application/json'
        )
        json_payload = json.dumps({
            "q_id": "1",
            "answer": "Answering question"
        })
        response = self.client.post(
            '/api/answer/',
            data=json_payload,
            content_type='application/json'
        )

        self.assertEqual(response.status_code, 200)
        self.assertTrue('id' in response.json())


    def test_short_answer_post(self):
        #Sends an answer with 1 character
        self.client.post(
            '/api/user/login/',
            data=json.dumps(self.login_info),
            content_type='application/json'
        )
        json_payload = json.dumps({
            "q_id": "1",
            "answer": "A"
        })
        response = self.client.post(
            '/api/answer/',
            data=json_payload,
            content_type='application/json'
        )

        self.assertEqual(response.status_code, 400)
        self.assertTrue('error' in response.json())


    def test_logged_out_answer_post(self):
        #Sends an answer without logging in
        json_payload = json.dumps({
            "q_id": "1",
            "answer": "Answering question"
        })
        response = self.client.post(
            '/api/answer/',
            data=json_payload,
            content_type='application/json'
        )

        self.assertEqual(response.status_code, 400)
        self.assertTrue('error' in response.json())

    def test_invalid_answer_post(self):
        #Sends an answer for a non-existent question
        self.client.post(
            '/api/user/login/',
            data=json.dumps(self.login_info),
            content_type='application/json'
        )

        json_payload = json.dumps({
            "q_id": "10000101",
            "answer": "Answering question"
        })
        response = self.client.post(
            '/api/answer/',
            data=json_payload,
            content_type='application/json'
        )

        self.assertEqual(response.status_code, 400)
        self.assertTrue('error' in response.json())

    def test_valid_answer_get(self):
        #Sends an answer get request for a valid question
        data = {
            'q_id': 1,
            'sort': 'date_created',
            'limit': 5
        }
        response = self.client.get('/api/answer/', data)

        self.assertEqual(response.status_code, 200)

    def test_invalid_answer_get(self):
        #Sends an answer get request for an invalid question
        data = {
            'q_id': 101001,
            'sort': 'date_created',
            'limit': 5
        }
        response = self.client.get('/api/answer/', data)

        self.assertEqual(response.status_code, 400)
        self.assertTrue('error' in response.json())


    @classmethod
    def tearDownClass(cls):
        Question.objects.all().delete()
        User.objects.all().delete()


class AnswerVoteViewTest(TestCase):
    login_info = [{
        'username': 'testuser',
        'password': 'testpassword'
    }, {
        'username': 'testuser2',
        'password': 'testpassword2'
    }]

    @classmethod
    def setUpTestData(cls):
        #Sets up database for the testcases
        question = Question.objects.create(id=1,question_head="Test Question?", question_text="Test Body?")
        user1 = User.objects.create_user(id=1,username=cls.login_info[0]['username'], password=cls.login_info[0]['password'])
        user2 = User.objects.create_user(id=2,username=cls.login_info[1]['username'], password=cls.login_info[1]['password'])
        Answer.objects.create(id=1, answer_text="Test answer", question_id=question, user_id=user1)
        Answer.objects.create(id=2, answer_text="Test answer2", question_id=question, user_id=user1)
        Answer.objects.create(id=3, answer_text="Test answer3", question_id=question, user_id=user2)
        Answer.objects.create(id=4, answer_text="Test answer4", question_id=question, user_id=user1)
        Answer.objects.create(id=5, answer_text="Test answer5", question_id=question, user_id=user1)


    def test_valid_answer_upvote_post(self):
        #Sends a valid upvote
        self.client.post(
            '/api/user/login/',
            data=json.dumps(self.login_info[1]),
            content_type='application/json'
        )
        json_payload = json.dumps({
            "a_id": "1",
            "vote_type": "UP"
        })
        response = self.client.post(
            '/api/answer/vote/',
            data=json_payload,
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 200)
        self.assertTrue('success' in response.json())

    def test_valid_answer_downvote_post(self):
        #Sends a valid downvote
        self.client.post(
            '/api/user/login/',
            data=json.dumps(self.login_info[1]),
            content_type='application/json'
        )
        json_payload = json.dumps({
            "a_id": "1",
            "vote_type": "DOWN"
        })
        response = self.client.post(
            '/api/answer/vote/',
            data=json_payload,
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 200)
        self.assertTrue('success' in response.json())

    def test_doubledownvote_post(self):
        #Sends a valid downvote
        self.client.post(
            '/api/user/login/',
            data=json.dumps(self.login_info[1]),
            content_type='application/json'
        )
        json_payload = json.dumps({
            "a_id": "2",
            "vote_type": "DOWN"
        })
        response = self.client.post(
            '/api/answer/vote/',
            data=json_payload,
            content_type='application/json'
        )
        response = self.client.post(
            '/api/answer/vote/',
            data=json_payload,
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 200)
        self.assertTrue('success' in response.json())


    def test_doubleupvote_post(self):
        #Sends a valid downvote
        self.client.post(
            '/api/user/login/',
            data=json.dumps(self.login_info[1]),
            content_type='application/json'
        )
        json_payload = json.dumps({
            "a_id": "2",
            "vote_type": "UP"
        })
        response = self.client.post(
            '/api/answer/vote/',
            data=json_payload,
            content_type='application/json'
        )
        response = self.client.post(
            '/api/answer/vote/',
            data=json_payload,
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 200)
        self.assertTrue('success' in response.json())



    def test_logout_vote(self):
        #Sends a vote without being logged in

        json_payload = json.dumps({
            "a_id": "1",
            "vote_type": "DOWN"
        })

        response = self.client.post(
            '/api/answer/vote/',
            data=json_payload,
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 400)
        self.assertTrue('error' in response.json())

    
    def test_self_vote(self):
        #Tests user voting on their own answer
        self.client.post(
            '/api/user/login/',
            data=json.dumps(self.login_info[1]),
            content_type='application/json'
        )
        json_payload = json.dumps({
            "a_id": "3",
            "vote_type": "DOWN"
        })

        response = self.client.post(
            '/api/answer/vote/',
            data=json_payload,
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 400)
        self.assertTrue('error' in response.json())
    
    def test_updown_vote(self):
        #Tests a user downvoting a question they
        #previously upvoted
        self.client.post(
            '/api/user/login/',
            data=json.dumps(self.login_info[1]),
            content_type='application/json'
        )
        json_payload = json.dumps({
            "a_id": "4",
            "vote_type": "UP"
        })

        response = self.client.post(
            '/api/answer/vote/',
            data=json_payload,
            content_type='application/json'
        )
        json_payload = json.dumps({
            "a_id": "4",
            "vote_type": "DOWN"
        })
        response = self.client.post(
            '/api/answer/vote/',
            data=json_payload,
            content_type='application/json'
        )

        self.assertEqual(response.status_code, 200)
        self.assertTrue('success' in response.json())
        self.assertEqual(-1, response.json()['points'])

    def test_downup_vote(self):
        #Tests a user upvoting a question they
        #previously downvoted
        self.client.post(
            '/api/user/login/',
            data=json.dumps(self.login_info[1]),
            content_type='application/json'
        )
        json_payload = json.dumps({
            "a_id": "5",
            "vote_type": "DOWN"
        })

        response = self.client.post(
            '/api/answer/vote/',
            data=json_payload,
            content_type='application/json'
        )
        json_payload = json.dumps({
            "a_id": "5",
            "vote_type": "UP"
        })
        response = self.client.post(
            '/api/answer/vote/',
            data=json_payload,
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 200)
        self.assertTrue('success' in response.json())
        self.assertEqual(1, response.json()['points'])



    @classmethod
    def tearDownClass(cls):
        Question.objects.all().delete()
        Answer.objects.all().delete()
        User.objects.all().delete()

class QuestionVoteViewTest(TestCase):
    login_info = [{
        'username': 'testuser',
        'password': 'testpassword'
    }, {
        'username': 'testuser2',
        'password': 'testpassword2'
    }]

    @classmethod
    def setUpTestData(cls):
        #Sets up database for the testcases
        u1 = User.objects.create_user(id=1,username=cls.login_info[0]['username'], password=cls.login_info[0]['password'])
        u2 = User.objects.create_user(id=2,username=cls.login_info[1]['username'], password=cls.login_info[1]['password'])
        Question.objects.create(id=1,question_head="Test Question?", question_text="Test Body?", user_id=u1)
        Question.objects.create(id=2,question_head="Test Question?2", question_text="Test Body?2", user_id=u1)
        Question.objects.create(id=3,question_head="Test Question?3", question_text="Test Body?3", user_id=u2)
        Question.objects.create(id=4,question_head="Test Question?4", question_text="Test Body?4", user_id=u1)
        Question.objects.create(id=5,question_head="Test Question?5", question_text="Test Body?5", user_id=u1)


    def test_valid_question_upvote_post(self):
        #Sends a valid upvote
        self.client.post(
            '/api/user/login/',
            data=json.dumps(self.login_info[1]),
            content_type='application/json'
        )
        json_payload = json.dumps({
            "q_id": "1",
            "vote_type": "UP"
        })
        response = self.client.post(
            '/api/question/vote/',
            data=json_payload,
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 200)
        self.assertTrue('success' in response.json())

    def test_valid_question_downvote_post(self):
        #Sends a valid downvote
        self.client.post(
            '/api/user/login/',
            data=json.dumps(self.login_info[1]),
            content_type='application/json'
        )
        json_payload = json.dumps({
            "q_id": "1",
            "vote_type": "DOWN"
        })
        response = self.client.post(
            '/api/question/vote/',
            data=json_payload,
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 200)
        self.assertTrue('success' in response.json())

    def test_doubledownvote_question_post(self):
        #Sends a valid downvote
        self.client.post(
            '/api/user/login/',
            data=json.dumps(self.login_info[1]),
            content_type='application/json'
        )
        json_payload = json.dumps({
            "q_id": "2",
            "vote_type": "DOWN"
        })
        response = self.client.post(
            '/api/question/vote/',
            data=json_payload,
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 200)
        response = self.client.post(
            '/api/question/vote/',
            data=json_payload,
            content_type='application/json'
        )

        self.assertEqual(response.status_code, 200)
        self.assertTrue('success' in response.json())

    def test_doubleupvote_question_post(self):
        #Sends a valid downvote
        self.client.post(
            '/api/user/login/',
            data=json.dumps(self.login_info[1]),
            content_type='application/json'
        )
        json_payload = json.dumps({
            "q_id": "2",
            "vote_type": "UP"
        })
        response = self.client.post(
            '/api/question/vote/',
            data=json_payload,
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 200)
        response = self.client.post(
            '/api/question/vote/',
            data=json_payload,
            content_type='application/json'
        )

        self.assertEqual(response.status_code, 200)
        self.assertTrue('success' in response.json())


    def test_logout_vote(self):
        #Sends a vote without being logged in

        json_payload = json.dumps({
            "q_id": "1",
            "vote_type": "DOWN"
        })

        response = self.client.post(
            '/api/question/vote/',
            data=json_payload,
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 400)
        self.assertTrue('error' in response.json())
    
    def test_self_vote(self):
        #Tests user voting on their own answer
        self.client.post(
            '/api/user/login/',
            data=json.dumps(self.login_info[1]),
            content_type='application/json'
        )
        json_payload = json.dumps({
            "q_id": "3",
            "vote_type": "DOWN"
        })

        response = self.client.post(
            '/api/answer/vote/',
            data=json_payload,
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 400)
        self.assertTrue('error' in response.json())
    
    def test_updown_vote(self):
        #Tests a user downvoting a question they
        #previously upvoted
        self.client.post(
            '/api/user/login/',
            data=json.dumps(self.login_info[1]),
            content_type='application/json'
        )
        json_payload = json.dumps({
            "q_id": "4",
            "vote_type": "UP"
        })

        response = self.client.post(
            '/api/question/vote/',
            data=json_payload,
            content_type='application/json'
        )
        json_payload = json.dumps({
            "q_id": "4",
            "vote_type": "DOWN"
        })
        response = self.client.post(
            '/api/question/vote/',
            data=json_payload,
            content_type='application/json'
        )

        self.assertEqual(response.status_code, 200)
        self.assertTrue('success' in response.json())
        self.assertEqual(-1, response.json()['points'])

    def test_downup_vote(self):
        #Tests a user upvoting a question they
        #previously downvoted
        self.client.post(
            '/api/user/login/',
            data=json.dumps(self.login_info[1]),
            content_type='application/json'
        )
        json_payload = json.dumps({
            "q_id": "5",
            "vote_type": "DOWN"
        })

        response = self.client.post(
            '/api/question/vote/',
            data=json_payload,
            content_type='application/json'
        )
        json_payload = json.dumps({
            "q_id": "5",
            "vote_type": "UP"
        })
        response = self.client.post(
            '/api/question/vote/',
            data=json_payload,
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 200)
        self.assertTrue('success' in response.json())
        self.assertEqual(1, response.json()['points'])


    @classmethod
    def tearDownClass(cls):
        Question.objects.all().delete()
        Answer.objects.all().delete()
        User.objects.all().delete()

class AnswerAcceptRejectViewTest(TestCase):
    login_info = {
        'username': 'testuser',
        'password': 'testpassword'
    }

    @classmethod
    def setUpTestData(cls):
        #Sets up database for the testcases
        author    = User.objects.create_user(id=1, username=cls.login_info['username'], password=cls.login_info['password'])
        responder = User.objects.create_user(id=2, username='second', password='12345')
        qid = Question.objects.create(id=1, question_head="Author's q", question_text="Test Body", user_id=author)
        Answer.objects.create(id=1, answer_text="Test answer", question_id=qid, user_id=author)
        Answer.objects.create(id=2, answer_text="Test answer2", question_id=qid, user_id=responder)


    def test_valid_accept_posts(self):
        #Sends a valid accept
        self.client.post(
            '/api/user/login/',
            data=json.dumps(self.login_info),
            content_type='application/json'
        )

        response = self.client.post(
            '/api/answer/1/accept/',
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(1, response.json()['accepted_answer_id'])

        response = self.client.post(
            '/api/answer/1/accept/undo/',
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(None, response.json()['accepted_answer_id'])

    def test_valid_reject_post(self):
        #Sends a valid accept
        self.client.post(
            '/api/user/login/',
            data=json.dumps(self.login_info),
            content_type='application/json'
        )

        response = self.client.post(
            '/api/answer/1/reject/',
        )
        self.assertEqual(response.status_code, 200)
        self.assertTrue(1 in response.json()['rejected_answers_ids'])

        response = self.client.post(
            '/api/answer/2/reject/',
        )
        self.assertEqual(response.status_code, 200)
        self.assertTrue(1 in response.json()['rejected_answers_ids'])
        self.assertTrue(2 in response.json()['rejected_answers_ids'])

        response = self.client.post(
            '/api/answer/2/reject/undo/',
        )
        self.assertEqual(response.status_code, 200)
        self.assertTrue(1 in response.json()['rejected_answers_ids'])
        self.assertTrue(2 not in response.json()['rejected_answers_ids'])

        response = self.client.post(
            '/api/answer/1/reject/undo/',
        )
        self.assertEqual(response.status_code, 200)
        self.assertTrue(1 not in response.json()['rejected_answers_ids'])
        self.assertTrue(2 not in response.json()['rejected_answers_ids'])

    def test_invalid_accept_posts(self):
        #Not the author of the question
        response = self.client.post(
            '/api/user/login/',
            data=json.dumps({'username':'second', 'password':'12345'}),
            content_type='application/json'
        )
        self.assertTrue(response.status_code, 200)

        response = self.client.post(
            '/api/answer/1/accept/',
        )
        self.assertEqual(response.status_code, 400)

        response = self.client.post(
            '/api/answer/1/accept/undo/',
        )
        self.assertEqual(response.status_code, 400)

        #Not logged in
        self.client = Client()

        response = self.client.post(
            '/api/answer/1/accept/',
        )
        self.assertEqual(response.status_code, 400)

        response = self.client.post(
            '/api/answer/1/accept/undo/',
        )
        self.assertEqual(response.status_code, 400)

    def test_invalid_reject_posts(self):
        #Not the author of the question
        response = self.client.post(
            '/api/user/login/',
            data=json.dumps({'username':'second', 'password':'12345'}),
            content_type='application/json'
        )
        self.assertTrue(response.status_code, 200)

        response = self.client.post(
            '/api/answer/1/reject/',
        )
        self.assertEqual(response.status_code, 400)

        response = self.client.post(
            '/api/answer/1/reject/undo/',
        )
        self.assertEqual(response.status_code, 400)

        #Not logged in
        self.client = Client()

        response = self.client.post(
            '/api/answer/1/reject/',
        )
        self.assertEqual(response.status_code, 400)

        response = self.client.post(
            '/api/answer/1/reject/undo/',
        )
        self.assertEqual(response.status_code, 400)

    @classmethod
    def tearDownClass(cls):
        Question.objects.all().delete()
        Answer.objects.all().delete()
        User.objects.all().delete()


class SearchViewTest(TestCase):
    login_info = {
        'username': 'testuser',
        'password': 'testpassword'
    }

    @classmethod
    def setUpTestData(cls):
        #Sets up data base for testcases
        Question.objects.create(id=1, question_head="QHead", question_text="abcde")
        Question.objects.create(id=2, question_head="abcde", question_text="QBody")

        author = User.objects.create_user(username=cls.login_info['username'], password=cls.login_info['password'])
        Question.objects.create(id=3, question_head="abcde", question_text="abcde", user_id=author)


    def test_search(self):
        #Test search by question_head
        response = self.client.get(
            '/api/search/',
            data = {"q": "QHead"}
        )
        self.assertTrue(1 == len(response.json()['question_list']))
        self.assertEqual(1, response.json()['question_list'][0]['id'])

        #Test search by question_text
        response = self.client.get(
            '/api/search/',
            data = {"q": "QBody"}
        )
        self.assertTrue(1 == len(response.json()['question_list']))
        self.assertEqual(2, response.json()['question_list'][0]['id'])

        #Test search by username
        response = self.client.get(
            '/api/search/',
            data = {"q": self.login_info['username']}
        )
        self.assertTrue(1 == len(response.json()['question_list']))
        self.assertEqual(3, response.json()['question_list'][0]['id'])


    @classmethod
    def tearDownClass(cls):
        Question.objects.all().delete()
        User.objects.all().delete()


class TagViewTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        #Sets up database for the testcases
        Tag.objects.create(tag_text='tag1')
        Tag.objects.create(tag_text='tag2')
        qid1 = Question.objects.create(id=1, question_head="Test Q", question_text="Test Body")
        qid2 = Question.objects.create(id=2, question_head="Test Q2", question_text="Test Body")
        add_tags_to_question(qid1, ['tag2'])
        add_tags_to_question(qid2, ['tag2'])
        qid1.save()
        qid2.save()


    def test_tag_get(self):
        response = self.client.get('/api/tag/')
        self.assertEqual(response.status_code, 200)

        tag_list = response.json()['tag_list']
        self.assertTrue( len(tag_list) == 2)

    def test_tagname_get(self):
        test_tagname = "tag2"
        response = self.client.get(f'/api/tag/name/{test_tagname}/')

        self.assertEqual(response.status_code, 200)
        body = response.json()
        self.assertTrue(body['question_count'] == 2)


    @classmethod
    def tearDownClass(cls):
        Question.objects.all().delete()
        Answer.objects.all().delete()
        Tag.objects.all().delete()
        User.objects.all().delete()


class ProfileQuestionViewTest(TestCase):
    login_info = {
        'username': 'testuser',
        'password': 'testpassword'
    }

    @classmethod
    def setUpTestData(cls):
        #Sets up database for the testcases
        author = User.objects.create_user(id=1, username=cls.login_info['username'], password=cls.login_info['password'])
        responder = User.objects.create_user(id=2, username='second', password='12345')
        qid = Question.objects.create(id=1, question_head="Author's q", question_text="Test Body", user_id=author)
        Answer.objects.create(id=1, answer_text="Test answer", question_id=qid, user_id=responder)
        Answer.objects.create(id=2, answer_text="Test answer2", question_id=qid, user_id=responder)


    def test_valid_request(self):
        #Test search by question_head
        response = self.client.get(
            '/api/user/name/' + self.login_info['username'] + '/questions/'
        )
        self.assertEqual(1 ,len(response.json()['asked_questions']))
        self.assertEqual(0, len(response.json()['answered_questions']))

    def test_invalid_request(self):
        #Test search by question_head
        response = self.client.get(
            '/api/user/name/fakeuser/questions/'
        )
        self.assertEqual(400 ,response.status_code)

    @classmethod
    def tearDownClass(cls):
        Question.objects.all().delete()
        User.objects.all().delete()
