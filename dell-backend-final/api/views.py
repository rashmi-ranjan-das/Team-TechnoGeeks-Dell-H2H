from django.shortcuts import render
from django.http import JsonResponse
import mysql.connector
import json
from django.views.decorators.csrf import csrf_exempt
import pickle
import csv
import os
from .tasks import execute_pipeline
# Create your views here.

@csrf_exempt
def DbAuthentication(request):
    if request.method == 'POST':
        db_details = json.loads(request.body)
        db_url=db_details['db_url']
        username=db_details['db_username']
        password=db_details['db_password']
        try:
            mydb = mysql.connector.connect(
            host=db_url,
            user=username,
            password=password,
            )
            if mydb:
                return JsonResponse({'Authenticated': True, 'value': 'Database Authentication Successful', 'db_url': db_url, 'username': username, 'password': password})
        except:
            return JsonResponse({'Authenticated': False, 'value': 'Database Authentication Failed', 'db_url': db_url, 'username': username, 'password': password})    

@csrf_exempt
def GetDatabaseDetails(request):
    if request.method == 'POST':
        db_details = json.loads(request.body)
        db_url=db_details['db_url']
        username=db_details['db_username']
        password=db_details['db_password']
        mydb = mysql.connector.connect(
            host=db_url,
            user=username,
            password=password,
        )
        cursor_db = mydb.cursor()
        databases = ("show databases")
        cursor_db.execute(databases)
        mysql_details = {}
        for database in cursor_db:
            if database[0] == 'information_schema':
                pass
            else:
                mysql_details[database[0]] = {}
        for database in mysql_details.keys():
            print(database)
            cursor_db.execute(f"USE {database}")
            cursor_db.execute("SHOW TABLES")
            for table in cursor_db:
                mysql_details[database][table[0]] = []
        for database in mysql_details.keys():
            for table in mysql_details[database].keys():
                cursor = mydb.cursor(dictionary=True)
                cursor.execute(f"SELECT * FROM {database}.{table}")
                result = cursor.fetchall()
                mysql_details[database][table] = result
        return JsonResponse(mysql_details)

@csrf_exempt
def PredictDataClass(request):
    if request.method == "POST":
        final_result = []
        db_details = json.loads(request.body)
        db_name = db_details['database']
        table_name = db_details['table']
        db_url=db_details['db_url']
        username=db_details['db_username']
        password=db_details['db_password']
        module_dir = os.path.dirname(__file__)
        file_path1 = os.path.join(module_dir, 'clf.pkl')
        file_path2 = os.path.join(module_dir, 'count_vect.pkl')
        clf = pickle.load(open(file_path1,'rb'))
        loaded_vec = pickle.load(open(file_path2, "rb"))
        # db_name = request.POST['database']
        # table_name = request.POST['table']
        # db_url=request.POST['db_url']
        # username=request.POST['db_username']
        # password=request.POST['db_password']
        mydb = mysql.connector.connect(
            host=db_url,
            user=username,
            password=password,
        )
        cursor_db = mydb.cursor()
        cursor_db.execute(f"SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = '{table_name}'")
        column_list = cursor_db.fetchall()
        final_result.append(f"Data from table <span style='color: #1976D2;'>{table_name}</span> fetched...")
        final_column_list=[]
        for entity in column_list:
            final_column_list.append(entity[0])
        print(','.join(final_column_list))
        result = ','.join(final_column_list)
        result_pred = clf.predict(loaded_vec.transform([result]))
        data_type = ''
        if result_pred[0] == 0:
            data_type = "CUSTOMER"
        elif result_pred[0] == 1:
            data_type = "EMPLOYEE"
        else:
            data_type = "SALES"
        final_result.append(f"Fetched Data sent to deployed ML Model...")
        final_result.append(f"Category of data predicted...(Predicted type = <span style='color: #1976D2;'>{data_type}</span>)")
        if result_pred[0] == 0: #CUSTOMER
            cursor = mydb.cursor(dictionary=True)
            cursor.execute(f"SELECT * FROM {db_name}.{table_name}")
            result = cursor.fetchall()
            primary_key_query = f"SHOW INDEX FROM {db_name}.{table_name} WHERE Key_name = 'PRIMARY';"
            cursor.execute(primary_key_query)
            res = cursor.fetchall()
            primary_key = res[0]['Column_name']
            final_result.append(f"Primary Key detected...(Primary Key = <span style='color: #1976D2;'>{primary_key}</span>)")
            final_result.append(f"Initiating <span style='color: #1976D2;'>{data_type}</span> pipeline in APACHE NIFI...")
            with open(f"./customer/{table_name}.txt", 'w+') as ft:
                for i in range(len(result)):
                    d = {}
                    for j in range(len(list(result[i].keys()))):
                        d[f'key{str(j + 1)}'] = list(result[i].keys())[j]
                        d[f'val{str(j + 1)}'] = result[i][list(result[i].keys())[j]]
                        d["primary"] = primary_key
                        d["type"] = "PRIMARY KEY"
                        d["table_name"] = table_name
                    json_line = json.dumps(d)
                    ft.write(json_line)
                    if i == len(result) - 1:
                        pass
                    else:
                        ft.write("\n")
            final_result.append(f"Running ETL in <span style='color: #1976D2;'>{data_type}</span> Pipeline...")
            final_result.append( f"Pipeline Executed Successfully...")
            return JsonResponse({'final': final_result})
        elif result_pred[0] == 1: #EMPLOYEE
            cursor = mydb.cursor(dictionary=True)
            cursor.execute(f"SELECT * FROM {db_name}.{table_name}")
            result = cursor.fetchall()
            primary_key_query = f"SHOW INDEX FROM {db_name}.{table_name} WHERE Key_name = 'PRIMARY';"
            cursor.execute(primary_key_query)
            res = cursor.fetchall()
            primary_key = res[0]['Column_name']
            final_result.append(f"Primary Key detected...(Primary Key = <span style='color: #1976D2;'>{primary_key}</span>)")
            final_result.append(f"Initiating <span style='color: #1976D2;'>{data_type}</span> pipeline in APACHE NIFI...")
            with open(f"./employee/{table_name}.txt", 'w+') as ft:
                for i in range(len(result)):
                    d = {}
                    for j in range(len(list(result[i].keys()))):
                        d[f'key{str(j + 1)}'] = list(result[i].keys())[j]
                        d[f'val{str(j + 1)}'] = result[i][list(result[i].keys())[j]]
                        d["primary"] = primary_key
                        d["type"] = "PRIMARY KEY"
                        d["table_name"] = table_name
                    json_line = json.dumps(d)
                    ft.write(json_line)
                    if i == len(result) - 1:
                        pass
                    else:
                        ft.write("\n")
            final_result.append(f"Running ETL in <span style='color: #1976D2;'>{data_type}</span> Pipeline...")
            final_result.append( f"Pipeline Executed Successfully...")
            return JsonResponse({'final': final_result})
        elif result_pred[0] == 2: #SALES
            cursor = mydb.cursor(dictionary=True)
            cursor.execute(f"SELECT * FROM {db_name}.{table_name}")
            result = cursor.fetchall()
            primary_key_query = f"SHOW INDEX FROM {db_name}.{table_name} WHERE Key_name = 'PRIMARY';"
            cursor.execute(primary_key_query)
            res = cursor.fetchall()
            primary_key = res[0]['Column_name']
            final_result.append(f"Primary Key detected...(Primary Key = <span style='color: #1976D2;'>{primary_key}</span>)")
            final_result.append(f"Initiating <span style='color: #1976D2;'>{data_type}</span> pipeline in APACHE NIFI...")
            with open(f"./sales/{table_name}.txt", 'w+') as ft:
                for i in range(len(result)):
                    d = {}
                    for j in range(len(list(result[i].keys()))):
                        d[f'key{str(j + 1)}'] = list(result[i].keys())[j]
                        d[f'val{str(j + 1)}'] = result[i][list(result[i].keys())[j]]
                        d["primary"] = primary_key
                        d["type"] = "PRIMARY KEY"
                        d["table_name"] = table_name
                    json_line = json.dumps(d)
                    ft.write(json_line)
                    if i == len(result) - 1:
                        pass
                    else:
                        ft.write("\n")
            final_result.append(f"Running ETL in <span style='color: #1976D2;'>{data_type}</span> Pipeline...")
            final_result.append( f"Pipeline Executed Successfully...")
            return JsonResponse({'final': final_result})
    