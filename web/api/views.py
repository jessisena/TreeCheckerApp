from django.shortcuts import render
from django.http import JsonResponse
from django.conf import settings as djangoSettings
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from django.utils.crypto import get_random_string
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.parsers import JSONParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import *
from .serializers import *

import random
import json
import base64

# Gets the zones. Only the ones available to the user are enabled
@api_view(['GET'])
@permission_classes((IsAuthenticated, ))
def getGZ(request):

	objs = GeographicalZone.objects.all()
	serialized = GeographicalZoneSerializer(objs, context={'request': request}, many=True)
	
	return JsonResponse(serialized.data, safe=False);


# Gets the areas of interest for a given zone with the user observations or adds a new one
@api_view(['GET', 'POST'])
@permission_classes((IsAuthenticated, ))
def aoiView(request, gz):

	gzId = int(gz)
	if request.method == 'GET':

		aois = AOI.objects.filter(geographical_zone_id=gzId).filter(owner_id=request.user.id)
		serialized = AOIReadSerializer(aois, context={'request': request}, many=True)

		return JsonResponse(serialized.data, safe=False)

	else:

		data = JSONParser().parse(request)
		data['geographical_zone'] = gzId;
		data['owner'] = request.user.id;
		serialized = AOIWriteSerializer(data=data, context={'request': request})
		if (serialized.is_valid()):
			serialized = serialized.save()
			serialized = AOIReadSerializer(serialized, context={'request': request}, many=False);
			return JsonResponse(serialized.data, safe=False)
		else:
			return Response(serialized.errors)


# Deletes an area of interest
@api_view(['DELETE'])
@permission_classes((IsAuthenticated, ))
def deleteAOI(request, id):

	aoiId = int(id)
	aoi = AOI.objects.filter(id=aoiId)

	if(aoi):
		if(aoi[0].owner.id == request.user.id):
			aoi.delete()
			return Response(status=status.HTTP_200_OK)
		else:
			return Response(status=status.HTTP_403_FORBIDDEN)
	else:
		return Response(status=status.HTTP_404_NOT_FOUND)


# Gets the user data
@api_view(['GET'])
@permission_classes((IsAuthenticated, ))
def userView(request):

	serialized = UserSerializer(request.user, context={'request': request})
	return JsonResponse(serialized.data, safe=False)


@api_view(['POST'])
@permission_classes((IsAuthenticated, ))
def addObservation(request, id):

	aoiId = int(id)
	aoi = AOI.objects.filter(id=aoiId)

	if(aoi):

		aoi = aoi[0]
		if(aoi.owner.id == request.user.id):
			data = JSONParser().parse(request)
			data['aoi'] = aoiId
			data['gz'] = aoi.geographical_zone.id
			data['tree_specie'] = getTreeSpecie(data['tree_specie'], request)
			serialized = SurveyDataWriteSerializer(data=data, context={'request': request})

			if (serialized.is_valid()):
				serialized = serialized.save()
				serialized = SurveyDataSerializer(serialized, context={'request': request}, many=False)
				return JsonResponse(serialized.data, safe=False)
			else:
				return Response(serialized.errors)
		else:
			return Response(status=status.HTTP_403_FORBIDDEN)

	else:
		return Response(status=status.HTTP_404_NOT_FOUND)
	

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes((IsAuthenticated, ))
def observationView(request, id):

	obsId = int(id)
	if request.method == 'GET':

		objs = SurveyData.objects.filter(id=obsId).filter(owner_id=request.user.id).filter(is_deleted=False)
		serialized = SurveyDataSerializer(objs, context={'request': request}, many=True)
		return JsonResponse(serialized.data, safe=False)

	elif(request.method == 'PUT'):

		obs = SurveyData.objects.filter(id=obsId).filter(is_deleted=False)

		if(obs):
			if(obs[0].owner.id == request.user.id):

				data = JSONParser().parse(request)
				obj = obs[0]

				data['tree_specie'] = getTreeSpecie(data['tree_specie'], request)
				if 'images' in data:
					imagesToKeep = data['images']
				else:
					imagesToKeep = []

				serialized = SurveyDataWriteSerializer(obj, data=data, context={'imagesToKeep': imagesToKeep})

				if(serialized.is_valid()):

					serialized.save()
					return JsonResponse(serialized.data, safe=False)

				return Response(serialized.errors)

			else:
				return Response(status=status.HTTP_403_FORBIDDEN)
		else:
			return Response(status=status.HTTP_404_NOT_FOUND)

	else:

		obs = SurveyData.objects.filter(id=obsId).filter(is_deleted=False)

		if(obs):

			if(obs[0].owner.id == request.user.id):

				obj = obs[0]
				obj.is_deleted = True
				obj.save()
				return Response(status=status.HTTP_200_OK)

			else:
				return Response(status=status.HTTP_403_FORBIDDEN)

		else:
			return Response(status=status.HTTP_404_NOT_FOUND)



def getTreeSpecie(idOrName, request):

	''' 
		Check to see if the input value is an id.
		If it isn't, we create a new TreeSpecie with the input value as name
	'''

	if(isinstance(idOrName, int )):
		obs = TreeSpecie.objects.filter(id=idOrName)
		if(obs):
			return idOrName;	

	serialized = TreeSpecieWriteSerializer(data={'name': idOrName},  context={'request': request})
	if(serialized.is_valid()):
		
		serialized = serialized.save()
		serialized = TreeSpecieSerializer(serialized, context={'request': request}, many=False)
		return serialized.data['key']


@api_view(['POST'])
@permission_classes((IsAuthenticated, ))
def addImage(request):

	data = JSONParser().parse(request)
	serialized = PhotoWriteSerializer(data=data, context={'request': request})

	if (serialized.is_valid()):
		obs = SurveyData.objects.filter(id=data['survey_data']).filter(is_deleted=False);
		if (obs):

			if(obs[0].owner.id == request.user.id):

				serialized = serialized.save()
				serialized = PhotoSerializer(serialized, context={'request': request}, many=False)
				return JsonResponse(serialized.data, safe=False)

			else:
				return Response(status=status.HTTP_403_FORBIDDEN)

		else:
			return Response(status=status.HTTP_404_NOT_FOUND)

	else:
		return Response(serialized.errors)


@api_view(['GET'])
@permission_classes((IsAuthenticated, ))
def getSpecies(request):

	objs = TreeSpecie.objects.all()
	serialized = TreeSpecieSerializer(objs, context={'request': request}, many=True)
	
	return JsonResponse(serialized.data, safe=False);


@api_view(['GET'])
@permission_classes((IsAuthenticated, ))
def getCrowns(request):
	
	objs = CrownDiameter.objects.all()
	serialized = CrownDiameterSerializer(objs, context={'request': request}, many=True)
	
	return JsonResponse(serialized.data, safe=False);


@api_view(['GET'])
@permission_classes((IsAuthenticated, ))
def getCanopies(request):
	
	objs = CanopyStatus.objects.all()
	serialized = CanopyStatusSerializer(objs, context={'request': request}, many=True)
	
	return JsonResponse(serialized.data, safe=False);


@api_view(['POST'])
@permission_classes((IsAuthenticated, ))
def fileUploadView(request):

	data = JSONParser().parse(request)
	data = data['image']
	format, imgstr = data.split(';base64,') 
	ext = format.split('/')[-1] 

	data = ContentFile(base64.b64decode(imgstr), name='temp.' + ext)
	imagePath = 'obs/' + get_random_string(length=32) + '.' + ext
	path = djangoSettings.STATIC_ROOT + imagePath
	default_storage.save(path, data)
	
	return JsonResponse({"url": djangoSettings.STATIC_URL + imagePath}, safe=False);
