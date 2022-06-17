from celery import shared_task
from celery_progress.backend import ProgressRecorder
from time import sleep
from django.http import JsonResponse
import mysql.connector
import json
from django.views.decorators.csrf import csrf_exempt
import pickle
import csv
import os

@shared_task(bind=True)
def execute_pipeline(self, db_details):
    progress_recorder = ProgressRecorder(self)
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
    d = {}
    progress_recorder.set_progress(1, 7, f"Data from table {table_name} fetched...")
    d[1] = f"Data from table {table_name} fetched..."
    sleep(50)
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
    progress_recorder.set_progress(2, 7, f"Fetched Data sent to deployed ML Model...")
    d[2] = f"Fetched Data sent to deployed ML Model..."
    sleep(50)
    progress_recorder.set_progress(3, 7, f"Category of data predicted...(Predicted type = {data_type})")
    d[3] = f"Category of data predicted...(Predicted type = {data_type})"
    if result_pred[0] == 0: #CUSTOMER
        cursor = mydb.cursor(dictionary=True)
        cursor.execute(f"SELECT * FROM {db_name}.{table_name}")
        result = cursor.fetchall()
        primary_key_query = f"SHOW INDEX FROM {db_name}.{table_name} WHERE Key_name = 'PRIMARY';"
        cursor.execute(primary_key_query)
        res = cursor.fetchall()
        primary_key = res[0]['Column_name']
        sleep(50)
        d[4] = f"Primary Key detected...(Primary Key = {primary_key})"
        progress_recorder.set_progress(4, 7, f"Primary Key detected...(Primary Key = {primary_key})")
        sleep(50)
        d[5] = f"Initiating {data_type} pipeline in APACHE NIFI..."
        progress_recorder.set_progress(5, 7, f"Initiating {data_type} pipeline in APACHE NIFI...")
        with open(f"./customer/{table_name}.txt", 'w+') as ft:
            for i in range(len(result)):
                d = {}
                for j in range(len(list(result[i].keys()))):
                    d[f'key{str(j + 1)}'] = list(result[i].keys())[j]
                    d[f'val{str(j + 1)}'] = result[i][list(result[i].keys())[j]]
                    d["primary"] = primary_key
                    d["type"] = "PRIMARY KEY"
                    d["table_name"] = table_name
                print("*****************", d)
                json_line = json.dumps(d)
                ft.write(json_line)
                if i == len(result) - 1:
                    pass
                else:
                    ft.write("\n")
        sleep(50)
        d[6] = f"Running ETL in {data_type} Pipeline..."
        progress_recorder.set_progress(6, 7, f"Running ETL in {data_type} Pipeline...")
        sleep(50)
        d[7] = f"Pipeline Executed Successfully..."
        progress_recorder.set_progress(7, 7, f"Pipeline Executed Successfully...")
        return d
    elif result_pred[0] == 1: #EMPLOYEE
        cursor = mydb.cursor(dictionary=True)
        cursor.execute(f"SELECT * FROM {db_name}.{table_name}")
        result = cursor.fetchall()
        primary_key_query = f"SHOW INDEX FROM {db_name}.{table_name} WHERE Key_name = 'PRIMARY';"
        cursor.execute(primary_key_query)
        res = cursor.fetchall()
        primary_key = res[0]['Column_name']
        d[4] = f"Primary Key detected...(Primary Key = {primary_key})"
        progress_recorder.set_progress(4, 7, f"Primary Key detected...(Primary Key = {primary_key})")
        sleep(50)
        d[5] = f"Initiating {data_type} pipeline in APACHE NIFI..."
        sleep(50)
        progress_recorder.set_progress(4, 7, f"Primary Key detected...(Primary Key = {primary_key})")
        sleep(50)
        progress_recorder.set_progress(5, 7, f"Initiating {data_type} pipeline in APACHE NIFI...")
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
        d[6] = f"Running ETL in {data_type} Pipeline..."
        progress_recorder.set_progress(6, 7, f"Running ETL in {data_type} Pipeline...")
        sleep(50)
        d[7] = f"Pipeline Executed Successfully..."
        progress_recorder.set_progress(7, 7, f"Pipeline Executed Successfully...")
        return d
    elif result_pred[0] == 2: #SALES
        cursor = mydb.cursor(dictionary=True)
        cursor.execute(f"SELECT * FROM {db_name}.{table_name}")
        result = cursor.fetchall()
        primary_key_query = f"SHOW INDEX FROM {db_name}.{table_name} WHERE Key_name = 'PRIMARY';"
        cursor.execute(primary_key_query)
        res = cursor.fetchall()
        primary_key = res[0]['Column_name']
        sleep(50)
        d[4] = f"Primary Key detected...(Primary Key = {primary_key})"
        progress_recorder.set_progress(4, 7, f"Primary Key detected...(Primary Key = {primary_key})")
        sleep(50)
        d[5] = f"Initiating {data_type} pipeline in APACHE NIFI..."
        progress_recorder.set_progress(4, 7, f"Primary Key detected...(Primary Key = {primary_key})")
        sleep(50)
        progress_recorder.set_progress(5, 7, f"Initiating {data_type} pipeline in APACHE NIFI...")
        with open(f"./sales/{table_name}.txt", 'w+') as ft:
            for i in range(len(result)):
                print(len(result))
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
        d[6] = f"Running ETL in {data_type} Pipeline..."
        progress_recorder.set_progress(6, 7, f"Running ETL in {data_type} Pipeline...")
        sleep(50)
        d[7] = f"Pipeline Executed Successfully..."
        progress_recorder.set_progress(7, 7, f"Pipeline Executed Successfully...")
        return d