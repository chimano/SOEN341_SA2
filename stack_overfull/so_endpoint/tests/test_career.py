"""
This module contains all tests related to the 
career page
"""
import json

from django.contrib.auth.models import User
from django.test import TestCase
from django.test import Client

from so_endpoint.models import Job


class JobAppViewTest(TestCase):
    login_info = [{
        'username': 'testuser',
        'password': 'testpassword'
    }, {
        'username': 'testuser2',
        'password': 'testpassword2'
    }]
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
                                          username=cls.login_info[0]['username'],
                                          password=cls.login_info[0]['password'],
                                          )
        author.profile.is_employer = True
        author.save()
        Job.objects.create(job_id=1, position=cls.job_info['position'],
                           job_type=cls.job_info['job_type'],
                           category=cls.job_info['category'],
                           company=cls.job_info['company'],
                           location=cls.job_info['location'],
                           description=cls.job_info['description'],
                           posted_by=author)
        User.objects.create_user(id=2,
                                 username=cls.login_info[1]['username'],
                                 password=cls.login_info[1]['password'])

    def test_invalid_get_request(self):
        # Get with an account that did not post the position

        response = self.client.get('/api/job/application/',
                                   {"job_id": 1})

        self.assertEqual(400, response.status_code)

    def test_invalid_id_get_request(self):
        # Get with a job that does not exist
        response = self.client.get('/api/job/application/',
                                   {"job_id": 54})

        self.assertEqual(400, response.status_code)

    def test_valid_get_request(self):
        # Get with an account that did post the position

        self.client.post(
            '/api/user/login/',
            data=json.dumps(self.login_info[0]),
            content_type='application/json'
        )
        response = self.client.get('/api/job/application/',
                                   {"job_id": 1})

        self.assertEqual(200, response.status_code)

    def test_logged_out_post_request(self):
        # Post with an account that is not logged in
        json_data = json.dumps({
            "job_id": 1
        })
        response = self.client.post('/api/job/application/',
                                    data=json_data,
                                    content_type='application/json')

        self.assertEqual(400, response.status_code)

    def test_valid_post_request(self):
        # Post with an account that is logged in

        self.client.post(
            '/api/user/login/',
            data=json.dumps(self.login_info[1]),
            content_type='application/json'
        )

        json_data = json.dumps({
            "job_id": 1
        })
        response = self.client.post('/api/job/application/',
                                    data=json_data,
                                    content_type='application/json')

        self.assertEqual(200, response.status_code)

    def test_invalid_post_request(self):
        # Post with an incorrect job id

        self.client.post(
            '/api/user/login/',
            data=json.dumps(self.login_info[1]),
            content_type='application/json'
        )

        json_data = json.dumps({
            "job_id": 412
        })
        response = self.client.post('/api/job/application/',
                                    data=json_data,
                                    content_type='application/json')

        self.assertEqual(400, response.status_code)

    @classmethod
    def tearDownClass(cls):
        Job.objects.all().delete()
        User.objects.all().delete()


class JobViewTest(TestCase):
    login_info = {
        'username': 'testuser',
        'password': 'testpassword'
    }

    @classmethod
    def setUpTestData(cls):
        # Sets up database for the testcases
        user = User.objects.create_user(id=1,
                                        username=cls.login_info['username'],
                                        password=cls.login_info['password'])
        user.profile.is_employer = True
        user.profile.save()

    def test_valid_job_post(self):
        self.client.post(
            '/api/user/login/',
            data=json.dumps(self.login_info),
            content_type='application/json'
        )

        json_payload = json.dumps({
            "position": "front-end developper",
            "job_type": "Full-time",
            "category": "computer_science",
            "company": "Apple",
            "location": "Montreal",
            "description": "Bring your competitive spirit, your love of innovation, and your desire to be at the forefront of an evolutionary change in our digital workforce. Now is the time to become a part of an exciting company where your ideas, passion and commitment to excellence will have a direct impact on the products that we build, the new markets we create and the people that we engage."
        })
        response = self.client.post(
            '/api/job/',
            data=json_payload,
            content_type='application/json'
        )
        print(response.json())
        self.assertEqual(response.status_code, 200)
        self.assertTrue('success' in response.json())

    def test_invalid_category_job_post(self):
        json_payload = json.dumps({
            "position": "front-end developper",
            "job_type": "Full-time",
            "category": "procrastinating",
            "company": "Apple",
            "location": "Montreal",
            "description": "we are searching for student"
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
            "position": "front-end developper",
            "job_type": "half-time",
            "category": "computer_science",
            "company": "Apple",
            "location": "Montreal",
            "description": "we are searching for student"
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
            "position": "front-end developper",
            "job_type": "Full-time",
            "category": "computer_science",
            "company": "Apple",
            "location": "Montreal",
            "description": "we are searching for student"
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
            "position": "",
            "job_type": "Full-time",
            "category": "computer_science",
            "company": "Apple",
            "location": "Montreal",
            "description": "Bring your competitive spirit, your love of innovation, and your desire to be at the forefront of an evolutionary change in our digital workforce. Now is the time to become a part of an exciting company where your ideas, passion and commitment to excellence will have a direct impact on the products that we build, the new markets we create and the people that we engage."
        })
        response = self.client.post(
            '/api/job/',
            data=json_payload,
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 400)
        self.assertTrue('error' in response.json())

    def test_valid_job_get(self):
        # Sends a get request with a valid category
        data = {
            "category": "computer_science"
        }

        response = self.client.get('/api/job/', data)
        self.assertEqual(response.status_code, 200)

    def test_invalid_job_get(self):
        # Sends a get request with a valid category
        data = {
            "category": "assassination"
        }
        response = self.client.get('/api/job/', data)

        self.assertEqual(response.status_code, 400)
        self.assertTrue('error' in response.json())

    @classmethod
    def tearDownClass(cls):
        User.objects.all().delete()
        Job.objects.all().delete()
