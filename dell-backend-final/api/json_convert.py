import json
import mysql.connector

db = mysql.connector.connect(host="b6eeodhjniofymupz2vt-mysql.services.clever-cloud.com",
  user="usjgo2yn1grpgarn",
  password="8GF8r3ifI468b0AcCNZE",
  database="b6eeodhjniofymupz2vt")

cursor = db.cursor(dictionary=True)
cursor.execute("SELECT * FROM sales_details")
result = cursor.fetchall()

primary_key_query = "SHOW INDEX FROM b6eeodhjniofymupz2vt.sales_details WHERE Key_name = 'PRIMARY';"
cursor.execute(primary_key_query)
res = cursor.fetchall()
primary_key = res[0]['Column_name']

with open("test.txt", 'w+') as ft:
  for i in range(len(result)):
    d = {}
    for j in range(len(list(result[i].keys()))):
      # print(list(result[i]))
      d[f'key{str(j + 1)}'] = list(result[i].keys())[j]
      d[f'val{str(j + 1)}'] = result[i][list(result[i].keys())[j]]
      d["primary"] = primary_key
    print(d)
    json_line = json.dumps(d)
    ft.write(json_line)
    if i == len(result) - 1:
      pass
    else:
      ft.write("\n")
