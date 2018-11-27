from django.contrib.auth.models import AbstractUser, Group
from django.db import models

class Country(models.Model):
	"""This class represents the country model."""

	name = models.CharField(max_length=100, blank=False, unique=False)
	code = models.CharField(max_length=20, blank=False, unique=True)

	def __str__(self):
		"""Return a human readable representation of the country instance."""
		return "{0}, {1}".format(str(self.name), str(self.code))

class Metadata(models.Model):
	"""This class represents the metadata model."""

	key = models.CharField(max_length=100, blank=False, unique=False)
	value = models.CharField(max_length=100, blank=False, unique=False)

	def __str__(self):
		"""Return a human readable representation of the model instance."""
		return "{0}, {1}".format(str(self.key), str(self.value))

class User(AbstractUser):
	"""This class represents the user model."""

	name = models.CharField(max_length=255, blank=False, unique=False)
	username = models.CharField(max_length=100, blank=False, unique=False)
	email = models.EmailField(max_length=100, blank=False, unique=True)
	password = models.CharField(max_length=255, blank=False, unique=False)
	occupation = models.CharField(max_length=255, blank=True, unique=False)
	country = models.ForeignKey(Country, null=True, on_delete=models.SET_NULL)
	language = models.CharField(max_length=255, blank=True, unique=False)
	creation_date = models.DateTimeField(auto_now_add=True)
	update_date = models.DateTimeField(auto_now=True)

	@property
	def gz(self):
		return GeographicalZone.objects.filter(ggz__group__user=self).all()

	USERNAME_FIELD = 'email'
	EMAIL_FIELD = 'email'
	REQUIRED_FIELDS = ['name', 'username']

	def __str__(self):
		"""Return a human readable representation of the model instance."""
		return "{}".format(str(self.name))

	def get_full_name(self): 
		return self.name

	def get_short_name(self):
		return self.username

class GeographicalZone(models.Model):
	"""This class represents the geographical zone model."""

	name = models.CharField(max_length=255, blank=False, unique=False)
	country = models.ForeignKey(Country, null=True, on_delete=models.SET_NULL)
	layer_name = models.CharField(max_length=255, blank=False, unique=False)
	wms_url = models.CharField(max_length=255, blank=False, unique=False)
	proj = models.CharField(max_length=255, blank=False, unique=False)
	image_url = models.CharField(max_length=255, blank=False, unique=False)
	x_min = models.FloatField()
	x_max = models.FloatField()
	y_min = models.FloatField()
	y_max = models.FloatField()

	@property
	def bbox(self):
		return [self.y_min, self.x_min, self.y_max, self.x_max]

	def __str__(self):
		"""Return a human readable representation of the model instance."""
		return "{}".format(str(self.name))

class GGZ(models.Model):
	"""This class represents the group-geographical zone model."""

	group = models.ForeignKey(Group, on_delete=models.CASCADE)
	geographical_zone = models.ForeignKey(GeographicalZone, on_delete=models.CASCADE)

	def __str__(self):
		"""Return a human readable representation of the model instance."""
		return "{0}, {1}".format(self.groupId, self.geographicalZoneId)

class AOI(models.Model):
	"""This class represents the AOI model."""

	name = models.CharField(max_length=100, blank=False, unique=False)
	x_min = models.FloatField()
	x_max = models.FloatField()
	y_min = models.FloatField()
	y_max = models.FloatField()
	owner = models.ForeignKey(User, null=True, on_delete=models.SET_NULL)
	geographical_zone = models.ForeignKey(GeographicalZone, on_delete=models.CASCADE)
	creation_date = models.DateTimeField(auto_now_add=True)
	is_deleted = models.BooleanField(default=False)

	@property
	def bbox(self):
		return [self.y_min, self.x_min, self.y_max, self.x_max]

	def __str__(self):
		"""Return a human readable representation of the model instance."""
		return "{}".format(self.name)

class TreeSpecie(models.Model):
	"""This class represents the Tree specie model."""

	name = models.CharField(max_length=50, blank=False, unique=False)

	def __str__(self):
		"""Return a human readable representation of the model instance."""
		return "{}".format(self.name)

class CrownDiameter(models.Model):
	"""This class represents the crown diameter model."""

	name = models.CharField(max_length=50, blank=False, unique=False)

	def __str__(self):
		"""Return a human readable representation of the model instance."""
		return "{}".format(self.name)

class CanopyStatus(models.Model):
	"""This class represents the canopy status model."""

	name = models.CharField(max_length=50, blank=False, unique=False)

	def __str__(self):
		"""Return a human readable representation of the model instance."""
		return "{}".format(self.name)

class SurveyData(models.Model):
	"""This class represents the survey data model."""

	name = models.CharField(max_length=255, blank=False, unique=False, null=False)
	tree_specie = models.ForeignKey(TreeSpecie, null=True, on_delete=models.SET_NULL)
	crown_diameter = models.ForeignKey(CrownDiameter, null=True, on_delete=models.SET_NULL)
	canopy_status = models.ForeignKey(CanopyStatus, null=True, on_delete=models.SET_NULL)
	comment = models.TextField(blank=True, unique=False)
	owner = models.ForeignKey(User, null=True, on_delete=models.SET_NULL)
	aoi = models.ForeignKey(AOI, null=True, on_delete=models.SET_NULL)
	gz = models.ForeignKey(GeographicalZone, null=True, on_delete=models.SET_NULL)
	longitude = models.FloatField()
	latitude = models.FloatField()
	compass = models.FloatField()
	creation_date = models.DateTimeField(auto_now_add=True)
	update_date = models.DateTimeField(auto_now=True)
	is_deleted = models.BooleanField(default=False)


	@property
	def position(self):
		return {"latitude": self.latitude, "longitude":self.longitude}

	def __str__(self):
		"""Return a human readable representation of the model instance."""
		return "{}".format(self.name)

class Photo(models.Model):
	"""This class represents the photo model."""

	survey_data =  models.ForeignKey(SurveyData, on_delete=models.CASCADE)
	longitude = models.FloatField()
	latitude = models.FloatField()
	compass = models.FloatField()
	url = models.CharField(max_length=255, blank=False, unique=False)

	def __str__(self):
		"""Return a human readable representation of the model instance."""
		return "{}".format(self.id)