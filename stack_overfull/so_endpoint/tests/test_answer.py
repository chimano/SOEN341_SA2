"""
This module contains all the tests related to Answers
"""
import json

from django.contrib.auth.models import User
from django.test import TestCase
from django.test import Client

from so_endpoint.models import Question, Answer


class AnswerViewTest(TestCase):
    login_info = [{
        'username': 'testuser',
        'password': 'testpassword'
    }, {
        'username': 'testuser2',
        'password': 'testpassword2'
    }]

    @classmethod
    def setUpTestData(cls):
        # Sets up database for the testcases
        question = Question.objects.create(
            id=1, question_head="Test Question?", question_text="Test Body?")
        u1 = User.objects.create_user(
            username=cls.login_info[0]['username'], password=cls.login_info[0]['password'])
        u2 = User.objects.create_user(
            username=cls.login_info[1]['username'], password=cls.login_info[1]['password'])
        Answer.objects.create(
            id=1, user_id=u2, answer_text="Edit answer test", question_id=question)
        Answer.objects.create(
            id=2, user_id=u2, answer_text="Delete answer test", question_id=question)

    def test_valid_answer_post(self):
        # Sends a valid answer
        self.client.post(
            '/api/user/login/',
            data=json.dumps(self.login_info[0]),
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
        # Sends an answer with 1 character
        self.client.post(
            '/api/user/login/',
            data=json.dumps(self.login_info[0]),
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
        # Sends an answer without logging in
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
        # Sends an answer for a non-existent question
        self.client.post(
            '/api/user/login/',
            data=json.dumps(self.login_info[0]),
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
        # Sends an answer get request for a valid question
        data = {
            'q_id': 1,
            'sort': 'date_created',
            'limit': 5
        }
        response = self.client.get('/api/answer/', data)

        self.assertEqual(response.status_code, 200)

    def test_invalid_answer_get(self):
        # Sends an answer get request for an invalid question
        data = {
            'q_id': 101001,
            'sort': 'date_created',
            'limit': 5
        }
        response = self.client.get('/api/answer/', data)

        self.assertEqual(response.status_code, 400)
        self.assertTrue('error' in response.json())

    def test_valid_answer_edit(self):
        # Sends a valid put request to edit question
        self.client.post(
            '/api/user/login/',
            data=json.dumps(self.login_info[1]),
            content_type='application/json'
        )
        json_payload = json.dumps({
            "a_id": 1,
            "answer_text": "Testing answer body."
        })

        response = self.client.put(
            '/api/answer/',
            data=json_payload,
            content_type='application/json'
        )

        self.assertEqual(response.status_code, 200)
        self.assertTrue('id' in response.json())

    def test_invalid_answer_edit(self):
        # Sends a put request to edit another user's question
        self.client.post(
            '/api/user/login/',
            data=json.dumps(self.login_info[0]),
            content_type='application/json'
        )
        json_payload = json.dumps({
            "a_id": 1,
            "answer_text": "Testing answer edit."
        })

        response = self.client.put(
            '/api/answer/',
            data=json_payload,
            content_type='application/json'
        )

        self.assertEqual(response.status_code, 400)
        self.assertTrue('error' in response.json())

    def test_valid_answer_delete(self):
        # Sends a valid put request to edit question
        self.client.post(
            '/api/user/login/',
            data=json.dumps(self.login_info[1]),
            content_type='application/json'
        )
        json_payload = json.dumps({
            "a_id": 2
        })

        response = self.client.delete(
            '/api/answer/',
            data=json_payload,
            content_type='application/json'
        )

        self.assertEqual(response.status_code, 200)
        self.assertTrue('success' in response.json())

    def test_invalid_question_delete(self):
        # Sends a put request to edit another user's question
        self.client.post(
            '/api/user/login/',
            data=json.dumps(self.login_info[0]),
            content_type='application/json'
        )
        json_payload = json.dumps({
            "a_id": 1
        })

        response = self.client.delete(
            '/api/answer/',
            data=json_payload,
            content_type='application/json'
        )

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
        # Sets up database for the testcases
        question = Question.objects.create(
            id=1, question_head="Test Question?", question_text="Test Body?")
        user1 = User.objects.create_user(
            id=1, username=cls.login_info[0]['username'], password=cls.login_info[0]['password'])
        user2 = User.objects.create_user(
            id=2, username=cls.login_info[1]['username'], password=cls.login_info[1]['password'])
        Answer.objects.create(id=1, answer_text="Test answer",
                              question_id=question, user_id=user1)
        Answer.objects.create(id=2, answer_text="Test answer2",
                              question_id=question, user_id=user1)
        Answer.objects.create(id=3, answer_text="Test answer3",
                              question_id=question, user_id=user2)
        Answer.objects.create(id=4, answer_text="Test answer4",
                              question_id=question, user_id=user1)
        Answer.objects.create(id=5, answer_text="Test answer5",
                              question_id=question, user_id=user1)

    def test_valid_answer_upvote_post(self):
        # Sends a valid upvote
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
        # Sends a valid downvote
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
        # Sends a valid downvote
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
        # Sends a valid downvote
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
        # Sends a vote without being logged in

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
        # Tests user voting on their own answer
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
        # Tests a user downvoting a question they
        # previously upvoted
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
        # Tests a user upvoting a question they
        # previously downvoted
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


class AnswerAcceptRejectViewTest(TestCase):
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
                              question_id=qid, user_id=author)
        Answer.objects.create(id=2, answer_text="Test answer2",
                              question_id=qid, user_id=responder)

    def test_valid_accept_posts(self):
        # Sends a valid accept
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
            '/api/answer/1/accept/',
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(None, response.json()['accepted_answer_id'])

    def test_valid_reject_post(self):
        # Sends a valid accept
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
            '/api/answer/2/reject/',
        )
        self.assertEqual(response.status_code, 200)
        self.assertTrue(1 in response.json()['rejected_answers_ids'])
        self.assertTrue(2 not in response.json()['rejected_answers_ids'])

        response = self.client.post(
            '/api/answer/1/reject/',
        )
        self.assertEqual(response.status_code, 200)
        self.assertTrue(1 not in response.json()['rejected_answers_ids'])
        self.assertTrue(2 not in response.json()['rejected_answers_ids'])

    def test_invalid_accept_posts(self):
        # Not the author of the question
        response = self.client.post(
            '/api/user/login/',
            data=json.dumps({'username': 'second', 'password': '12345'}),
            content_type='application/json'
        )
        self.assertTrue(response.status_code, 200)

        response = self.client.post(
            '/api/answer/1/accept/',
        )
        self.assertEqual(response.status_code, 400)

        response = self.client.post(
            '/api/answer/1/accept/',
        )
        self.assertEqual(response.status_code, 400)

        # Not logged in
        self.client = Client()

        response = self.client.post(
            '/api/answer/1/accept/',
        )
        self.assertEqual(response.status_code, 400)

        response = self.client.post(
            '/api/answer/1/accept/',
        )
        self.assertEqual(response.status_code, 400)

    def test_invalid_reject_posts(self):
        # Not the author of the question
        response = self.client.post(
            '/api/user/login/',
            data=json.dumps({'username': 'second', 'password': '12345'}),
            content_type='application/json'
        )
        self.assertTrue(response.status_code, 200)

        response = self.client.post(
            '/api/answer/1/reject/',
        )
        self.assertEqual(response.status_code, 400)

        response = self.client.post(
            '/api/answer/1/reject/',
        )
        self.assertEqual(response.status_code, 400)

        # Not logged in
        self.client = Client()

        response = self.client.post(
            '/api/answer/1/reject/',
        )
        self.assertEqual(response.status_code, 400)

        response = self.client.post(
            '/api/answer/1/reject/',
        )
        self.assertEqual(response.status_code, 400)

    @classmethod
    def tearDownClass(cls):
        Question.objects.all().delete()
        Answer.objects.all().delete()
        User.objects.all().delete()
