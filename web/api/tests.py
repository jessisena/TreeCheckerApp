from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from django.core.urlresolvers import reverse
from .models import User

class ModelTestCase(TestCase):
	"""This class defines the test suite for the user model."""

	def setUp(self):
		self.user = User(name="testUser", username="test", password="bla", emailAddress="isaac.besora@gmail.com")

	def test_model_can_create_a_bucketlist(self):
		"""Test the user model can create an user."""
		old_count = User.objects.count()
		self.user.save()
		new_count = User.objects.count()
		self.assertNotEqual(old_count, new_count)

class ViewTestCase(TestCase):
	"""Test suite for the api views."""

	def setUp(self):
		"""Define the test client and other test variables."""
		self.client = APIClient()
		self.userData = {'name': 'test'}
		self.response = self.client.post(
			reverse('create'),
			self.userData,
			format="json")

	def test_api_can_create_an_user(self):
		"""Test the api has user creation capability."""
		self.assertEqual(self.response.status_code, status.HTTP_201_CREATED)