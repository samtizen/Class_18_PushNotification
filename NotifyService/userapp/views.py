from django.shortcuts import render
from django.utils import timezone
from django.http import HttpResponse, JsonResponse
from userapp.models import Users
from django.views.decorators.csrf import csrf_exempt

import requests

def index(request):
    for row in Users.objects.all():
        print("%s %s %s" % (row.nickname, row.email, row.req_id))

    return HttpResponse("Hello, world. You're at the polls index.")

def check_users(request):
    pass

@csrf_exempt
def get_users(request):

    rdata = {}
    rdata["emails"] = []
    rdata["nicknames"] = []

    for row in Users.objects.all():
        rdata["emails"].append(row.email)
        rdata["nicknames"].append(row.nickname)

    return JsonResponse(rdata)

@csrf_exempt
def register_user(request):
    nm = request.POST.get("nickname")
    em = request.POST.get("email")
    rid = request.POST.get("regid")

    if nm and em and rid:
        user = Users(nickname=nm, email=em, reg_id=rid, create_date=timezone.now())
        user.save()
        return HttpResponse("Success")
    else:
        return HttpResponse("Failure")

@csrf_exempt
def send_message(request):

    #print(request.POST)

    sender = request.POST.get("sender")

    sender_nickname = ""
    sender_email = ""

    if Users.objects.filter(reg_id=sender).exists():
        sender_user = Users.objects.filter(reg_id=sender)[0]
        sender_nickname = sender_user.nickname
        sender_email = sender_user.email
    else:
        #print(sender + " doesn't exist")
        return HttpResponse("Failure")

    recipients = request.POST.get("recipients").split(",")

    #print(recipients)

    reg_id_list = []

    for recipient in recipients:
        if Users.objects.filter(pk=recipient).exists():
            reg_id_list.append(Users.objects.get(pk=recipient).reg_id)
        #else:
        #    print(recipient + " doesn't exist")

    message = request.POST.get("message")

    header = {"appID": "L08fBX9RqA",
              "appSecret": "CMxh/YyBIiuJ7pb5UzkInT8LQTwAAA=="}

    appData = '{"sender_nickname":"'+sender_nickname+'","sender_email":"'+sender_email+'"}'

    #print(appData)

    # Формирование запроса к Push-серверу Tizen	
    data = {"regID": reg_id_list,
            "requestID": "000011",
            "message": "badgeOption=SET&badgeNumber=10&action=ALERT&alertMessage=" + message,
            "appData": appData
            }
    # POST запрос к Push-серверу Tizen
    r_post = requests.post("https://apnortheast.push.samsungosp.com:8090/spp/pns/api/push",
                           headers=header, json=data)
    
    #print(r_post.json())

    return HttpResponse("Success")


