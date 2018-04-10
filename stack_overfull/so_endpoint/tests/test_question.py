"""
This module contains all the tests related to questions
"""
import json

from django.contrib.auth.models import User
from django.test import TestCase
from django.test import Client

from so_endpoint.models import Job, Question, Answer, Tag
from so_endpoint.views import add_tags_to_question

# Create your tests here.


class QuestionViewTest(TestCase):
    login_info = [{
        'username': 'testuser',
        'password': 'testpassword'
    }, {
        'username': 'testuser2',
        'password': 'testpassword2'
    }]

    @classmethod
    def setUpTestData(cls):
        # Sets up data base for testcases
        Question.objects.create(
            id=1, question_head="Test Question?", question_text="Test Body?")

        tag = Tag.objects.create(tag_text="testtag")
        tagged = Question.objects.create(
            id=2, question_head="Test Question Tags?", question_text="Test Tags Body?")
        tagged.tags.set([tag])

        u1 = User.objects.create_user(
            username=cls.login_info[0]['username'], password=cls.login_info[0]['password'])
        u2 = User.objects.create_user(
            username=cls.login_info[1]['username'], password=cls.login_info[1]['password'])
        Question.objects.create(
            id=3, question_head="Test Question edit?", question_text="Test Body?", user_id=u2)
        Question.objects.create(
            id=4, question_head="Test Question delete?", question_text="Test Body?", user_id=u2)

    def test_valid_question_post(self):
        # Sends a valid post request
        self.client.post(
            '/api/user/login/',
            data=json.dumps(self.login_info[0]),
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
        # Sends post request without logging in
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
        # Sends a post request with a 1 character question
        self.client.post(
            '/api/user/login/',
            data=json.dumps(self.login_info[0]),
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
        # Sends a valid post request
        self.client.post(
            '/api/user/login/',
            data=json.dumps(self.login_info[0]),
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
        # Sends a get request with a valid id
        data = {
            "id": "1"
        }

        response = self.client.get('/api/question/', data)
        self.assertEqual(response.status_code, 200)

    def test_invalid_question_get(self):
        # Sends a get request with an invalid id
        data = {
            "id": "012302011"
        }

        response = self.client.get('/api/question/', data)
        self.assertEqual(response.status_code, 400)
        self.assertTrue('error' in response.json())

    def test_question_list_get(self):
        # Sends a valid get request to get question list
        data = {
            "order": "asc",
            "limit": 20,
            "sort": "date_created"
        }

        response = self.client.get('/api/question/', data)
        self.assertEqual(response.status_code, 200)

    def test_question_list_get_with_tags(self):
        # Sends a valid get request to get question list
        data = {
            "order": "asc",
            "limit": 20,
            "sort": "date_created",
            "tags[]": ['testtag']
        }

        response = self.client.get('/api/question/', data)
        question_list = response.json()['question_list']

        self.assertEqual(response.status_code, 200)
        self.assertTrue(len(question_list) == 1)

    def test_valid_question_edit(self):
        # Sends a valid put request to edit question
        self.client.post(
            '/api/user/login/',
            data=json.dumps(self.login_info[1]),
            content_type='application/json'
        )
        json_payload = json.dumps({
            "q_id": 3,
            "question_head": "a",
            "question_text": "Testing question body."
        })

        response = self.client.put(
            '/api/question/',
            data=json_payload,
            content_type='application/json'
        )

        self.assertEqual(response.status_code, 200)
        self.assertTrue('id' in response.json())

    def test_invalid_question_edit(self):
        # Sends a put request to edit another user's question
        self.client.post(
            '/api/user/login/',
            data=json.dumps(self.login_info[0]),
            content_type='application/json'
        )
        json_payload = json.dumps({
            "q_id": 3,
            "question_head": "a",
            "question_text": "Testing question body."
        })

        response = self.client.put(
            '/api/question/',
            data=json_payload,
            content_type='application/json'
        )

        self.assertEqual(response.status_code, 400)
        self.assertTrue('error' in response.json())

    def test_valid_question_delete(self):
        # Sends a valid put request to edit question
        self.client.post(
            '/api/user/login/',
            data=json.dumps(self.login_info[1]),
            content_type='application/json'
        )
        json_payload = json.dumps({
            "q_id": 4
        })

        response = self.client.delete(
            '/api/question/',
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
            "q_id": 3
        })

        response = self.client.delete(
            '/api/question/',
            data=json_payload,
            content_type='application/json'
        )

        self.assertEqual(response.status_code, 400)
        self.assertTrue('error' in response.json())

    @classmethod
    def tearDownClass(cls):
        Question.objects.all().delete()
        Tag.objects.all().delete()
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
        # Sets up database for the testcases
        u1 = User.objects.create_user(
            id=1, username=cls.login_info[0]['username'], password=cls.login_info[0]['password'])
        u2 = User.objects.create_user(
            id=2, username=cls.login_info[1]['username'], password=cls.login_info[1]['password'])
        Question.objects.create(
            id=1, question_head="Test Question?", question_text="Test Body?", user_id=u1)
        Question.objects.create(
            id=2, question_head="Test Question?2", question_text="Test Body?2", user_id=u1)
        Question.objects.create(
            id=3, question_head="Test Question?3", question_text="Test Body?3", user_id=u2)
        Question.objects.create(
            id=4, question_head="Test Question?4", question_text="Test Body?4", user_id=u1)
        Question.objects.create(
            id=5, question_head="Test Question?5", question_text="Test Body?5", user_id=u1)

    def test_valid_question_upvote_post(self):
        # Sends a valid upvote
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
        # Sends a valid downvote
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
        # Sends a valid downvote
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
        # Sends a valid downvote
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
        # Sends a vote without being logged in

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
        # Tests user voting on their own answer
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
        # Tests a user downvoting a question they
        # previously upvoted
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
        # Tests a user upvoting a question they
        # previously downvoted
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


class SearchViewTest(TestCase):
    login_info = {
        'username': 'testuser',
        'password': 'testpassword'
    }

    @classmethod
    def setUpTestData(cls):
        # Sets up data base for testcases
        Question.objects.create(
            id=1, question_head="QHead", question_text="abcde")
        Question.objects.create(
            id=2, question_head="abcde", question_text="QBody")

        author = User.objects.create_user(
            username=cls.login_info['username'], password=cls.login_info['password'])
        Question.objects.create(
            id=3, question_head="abcde", question_text="abcde", user_id=author)

    def test_search(self):
        # Test search by question_head
        response = self.client.get(
            '/api/search/',
            data={"q": "QHead"}
        )
        self.assertTrue(len(response.json()['question_list']) == 1)
        self.assertEqual(1, response.json()['question_list'][0]['id'])

        # Test search by question_text
        response = self.client.get(
            '/api/search/',
            data={"q": "QBody"}
        )
        self.assertTrue(len(response.json()['question_list']) == 1)
        self.assertEqual(2, response.json()['question_list'][0]['id'])

        # Test search by username
        response = self.client.get(
            '/api/search/',
            data={"q": self.login_info['username']}
        )
        self.assertTrue(len(response.json()['question_list']) == 1)
        self.assertEqual(3, response.json()['question_list'][0]['id'])

    @classmethod
    def tearDownClass(cls):
        Question.objects.all().delete()
        User.objects.all().delete()


class TagViewTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        # Sets up database for the testcases
        Tag.objects.create(tag_text='tag1')
        Tag.objects.create(tag_text='tag2')
        qid1 = Question.objects.create(
            id=1, question_head="Test Q", question_text="Test Body")
        qid2 = Question.objects.create(
            id=2, question_head="Test Q2", question_text="Test Body")
        add_tags_to_question(qid1, ['tag2'])
        add_tags_to_question(qid2, ['tag2'])
        qid1.save()
        qid2.save()

    def test_tag_get(self):
        response = self.client.get('/api/tag/')
        self.assertEqual(response.status_code, 200)

        tag_list = response.json()['tag_list']
        self.assertTrue(len(tag_list) == 2)

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
