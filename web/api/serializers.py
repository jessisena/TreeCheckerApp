from rest_framework import serializers
from rest_framework.fields import CurrentUserDefault
from django.contrib.auth import get_user, get_user_model
from .models import *

class CountrySerializer(serializers.ModelSerializer):
	"""Serializer to map the Model instance into JSON format."""

	key = serializers.IntegerField(source='id')

	class Meta:
		"""Meta class to map serializer's fields with the model fields."""
		model = Country
		fields = ('key', 'code', 'name')


class UserSerializer(serializers.ModelSerializer):
	"""Serializer to map the Model instance into JSON format."""

	key = serializers.IntegerField(source='id')
	country = serializers.SerializerMethodField()

	def get_country(self, instance):
		request = self.context.get('request')
		user = request.user
		serialized = CountrySerializer(user.country, context={'request': request})
		return serialized.data

	class Meta:
		"""Meta class to map serializer's fields with the model fields."""
		model = User
		fields = ('key' ,'name', 'username', 'email', 'occupation', 'country', 
			'language')


class GeographicalZoneSerializer(serializers.ModelSerializer):
	"""Serializer to map the Model instance into JSON format."""

	key = serializers.IntegerField(source='id')
	is_enabled = serializers.SerializerMethodField()

	def get_is_enabled(self, instance):
		request = self.context.get('request')
		user = request.user
		return instance in user.gz

	class Meta:
		"""Meta class to map serializer's fields with the model fields."""
		model = GeographicalZone
		fields = ('key', 'name', 'image_url', 'bbox', 'is_enabled')


class GGZSerializer(serializers.ModelSerializer):
	"""Serializer to map the Model instance into JSON format."""

	class Meta:
		"""Meta class to map serializer's fields with the model fields."""
		model = GGZ
		fields = ('group_id', 'geographical_zone_id')


class AOIReadSerializer(serializers.ModelSerializer):
	"""Serializer to map the Model instance into JSON format."""
	key = serializers.IntegerField(source='id')
	obs = serializers.SerializerMethodField()
	bbox = serializers.SerializerMethodField()

	def get_obs(self, instance):
		request = self.context.get('request')
		ruser = request.user
		objs = SurveyData.objects.filter(owner_id=ruser.id).filter(aoi=instance).filter(is_deleted=False)
		serialized = SurveyDataSerializer(objs, context={'request': request}, many=True)
		return serialized.data

	def get_bbox(self, instance):
		return instance.bbox

	class Meta:
		"""Meta class to map serializer's fields with the model fields."""
		model = AOI
		fields = ('key', 'name', 'obs', 'bbox')

class AOIWriteSerializer(serializers.ModelSerializer):
	"""Serializer to map the Model instance into JSON format."""

	def create(self, validated_data):
		validated_data['owner'] = self.context.get('request').user
		return AOI.objects.create(**validated_data)

	class Meta:
		"""Meta class to map serializer's fields with the model fields."""
		model = AOI
		fields = ('name', 'x_min', 'x_max', 'y_min', 'y_max', 'geographical_zone', 'owner')


class TreeSpecieSerializer(serializers.ModelSerializer):
	"""Serializer to map the Model instance into JSON format."""
	key = serializers.IntegerField(source='id')

	class Meta:
		"""Meta class to map serializer's fields with the model fields."""
		model = TreeSpecie
		fields = ('key' ,'name', )


class TreeSpecieWriteSerializer(serializers.ModelSerializer):
	"""Serializer to map the Model instance into JSON format."""

	def create(self, validated_data):
		return TreeSpecie.objects.create(**validated_data)

	class Meta:
		"""Meta class to map serializer's fields with the model fields."""
		model = TreeSpecie
		fields = ('name', )


class CrownDiameterSerializer(serializers.ModelSerializer):
	"""Serializer to map the Model instance into JSON format."""
	key = serializers.IntegerField(source='id')

	class Meta:
		"""Meta class to map serializer's fields with the model fields."""
		model = CrownDiameter
		fields = ('key', 'name', )


class CanopyStatusSerializer(serializers.ModelSerializer):
	"""Serializer to map the Model instance into JSON format."""
	key = serializers.IntegerField(source='id')

	class Meta:
		"""Meta class to map serializer's fields with the model fields."""
		model = CanopyStatus
		fields = ('key', 'name', )


class SurveyDataSerializer(serializers.ModelSerializer):
	"""Serializer to map the Model instance into JSON format."""
	key = serializers.IntegerField(source='id')
	tree_specie = serializers.SerializerMethodField()
	crown_diameter = serializers.SerializerMethodField()
	canopy_status = serializers.SerializerMethodField()
	images = serializers.SerializerMethodField();

	def get_tree_specie(self, instance):
		request = self.context.get('request')
		serializer = TreeSpecieSerializer(instance.tree_specie, context={'request': request})
		return serializer.data

	def get_crown_diameter(self, instance):
		request = self.context.get('request')
		serializer = CrownDiameterSerializer(instance.crown_diameter, context={'request': request})
		return serializer.data

	def get_canopy_status(self, instance):
		request = self.context.get('request')
		serializer = CanopyStatusSerializer(instance.canopy_status, context={'request': request})
		return serializer.data

	def get_images(self, instance):
		request = self.context.get('request')
		serializer = PhotoSerializer(instance.photo_set, context={'request': request}, many=True)
		return serializer.data

	class Meta:
		"""Meta class to map serializer's fields with the model fields."""
		model = SurveyData
		fields = ('key', 'name', 'tree_specie', 'crown_diameter', 'canopy_status',
			'comment', 'position', 'compass', 'images')
		read_only_fields = ('creation_date', 'update_date')

class SurveyDataWriteSerializer(serializers.ModelSerializer):
	"""Serializer to map the Model instance into JSON format."""

	def create(self, validated_data):
		validated_data['owner'] = self.context.get('request').user
		return SurveyData.objects.create(**validated_data)

	def update(self, instance, validated_data):
		instance.name = validated_data.get('name', instance.name)
		instance.tree_specie = validated_data.get('tree_specie', instance.tree_specie)
		instance.crown_diameter = validated_data.get('crown_diameter', instance.crown_diameter)
		instance.canopy_status = validated_data.get('canopy_status', instance.canopy_status)
		instance.comment = validated_data.get('comment', instance.comment)
		instance.longitude = validated_data.get('longitude', instance.longitude)
		instance.latitude = validated_data.get('latitude', instance.latitude)
		instance.compass = validated_data.get('compass', instance.compass)

		inputImages = self.context.get('imagesToKeep')
		if inputImages:
		
			currentImages = Photo.objects.filter(survey_data_id=instance.id).values_list('id', flat=True)

			imagesToDelete = set(currentImages) - set(inputImages)
			Photo.objects.filter(id__in=imagesToDelete).filter(survey_data_id=instance.id).delete()
			
		instance.save()
		return instance

	class Meta:
		"""Meta class to map serializer's fields with the model fields."""
		model = SurveyData
		fields = ('name', 'tree_specie', 'crown_diameter', 'canopy_status',
			'comment', 'aoi', 'gz', 'longitude', 'latitude', 'compass')


class PhotoSerializer(serializers.ModelSerializer):
	"""Serializer to map the Model instance into JSON format."""
	key = serializers.IntegerField(source='id')

	class Meta:
		"""Meta class to map serializer's fields with the model fields."""
		model = Photo
		fields = ('key', 'url')

class PhotoWriteSerializer(serializers.ModelSerializer):
	"""Serializer to map the Model instance into JSON format."""

	class Meta:
		"""Meta class to map serializer's fields with the model fields."""
		model = Photo
		fields = ('survey_data', 'latitude', 'longitude', 'compass', 'url')