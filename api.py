# from asyncio.windows_events import NULL
from pickle import NONE
from re import T
from urllib import request
from flask import Flask, jsonify, request
from flask_cors import cross_origin
import pymysql
import json
import os
from dotenv import load_dotenv
import logging
import math

APP_ROOT = os.path.join(os.path.dirname(__file__), '..')   # refers to application_top
dotenv_path = os.path.join(APP_ROOT, '.env')
load_dotenv(dotenv_path)

mysql_host = os.getenv("DB_HOST")
mysql_port = os.getenv("DB_PORT")
mysql_dbname = os.getenv("DB_DATABASE")
mysql_user = os.getenv("DB_USERNAME")
mysql_password = os.getenv("DB_PASSWORD")

connection = None
CONNECTION_TIMEOUT = 5000

print(mysql_host)
print(mysql_port)
print(mysql_dbname)
print(mysql_user)

# @app.route('/reports/<path:path>')
# def send_report(path):
#     return send_from_directory('reports', path)

# def get_cursor(connection): 
#   connection.ping(reconnect=True)
#   return connection.cursor()

app = Flask(__name__)

@app.route('/database', methods=['GET', 'POST']) 
def connect_db():
  connection = pymysql.connect(host=mysql_host, user=mysql_user, port=int(mysql_port), password=mysql_password, database=mysql_dbname, connect_timeout=CONNECTION_TIMEOUT)
  print("connected to db")
  return connection

# @app.route('/public')
# def root():
#   return app.send_static_file('link.csv')

@app.route('/', methods=["POST"])
@cross_origin()
def create_alert():
  print('Inside create alert', flush=True)
  connection = connect_db()
  cur = connection.cursor()
  keywords = request.json['keywords']
  keywords = ",".join(keywords)
  if not keywords:
    keywords = None

  aliases = request.json['aliases']
  aliases = ",".join(aliases)
  if not aliases:
    aliases = None

  lemmapp = request.json['lemmapp']
  if not lemmapp:
    lemmapp = None

  aliaslem = request.json['aliaslem']
  if not aliaslem:
    aliaslem = None

  negalias = request.json['negalias']
  if not negalias:
    negalias = None

  negsearchbool = request.json['negsearchbool']
  if not negsearchbool:
    negsearchbool = None
  
  negaliaslemm = request.json['negaliaslemm']
  if not negaliaslemm:
    negaliaslemm = None

  user = request.json['user']
  if not user:
    user = None

  emailAlert = request.json['emailAlert']
  if not emailAlert:
    emailAlert = 'no'
  else:
    emailAlert = 'yes'

  searchtype = request.json['searchtype']
  if not searchtype:
    searchtype = None

  senWoNegBool = request.json['senWoNegBool']
  if not senWoNegBool:
    senWoNegBool = 'no'
  else:
    senWoNegBool = 'yes'

  sourceClass = request.json['sourceClass']
  sourceLink = request.json['sourceLink']

  if not sourceClass:
    sourceClass = sourceLink
  
  if not sourceLink:
    sourceClass = None

  alertTitle = request.json['alertTitle']
  if not alertTitle:
    alertTitle = None

  alertDate = request.json['alertDate']
  if not alertDate:
    alertDate = None
  
  emailSubject = request.json['emailSubject']
  if not emailSubject:
    emailSubject = None
  
  header = request.json['header']
  if not header:
    header = None
  
  print(header, flush=True)
  
  subheader = request.json['subheader']
  if not subheader:
    subheader = None
  
  subheaderOrder = request.json['subheaderOrder']
  if not subheaderOrder:
    subheaderOrder = None
  
  recepientList = request.json['recepientList']
  if not recepientList:
    recepientList = None
  
  frequency = request.json['frequency']
  if not frequency:
    frequency = None

  get_last_updated_ome_id_query = '''SELECT MAX(idome_alerts) FROM `ome_alerts_DJ_fe_design`;'''
  cur.execute(get_last_updated_ome_id_query)
  last_updated_ome_id = cur.fetchall()

  if last_updated_ome_id:
    try:
      ome_index = last_updated_ome_id[0][0]
      insert_ome_alert_query = '''INSERT INTO `ome_alerts_DJ_fe_design` (`idome_alerts`,`keyword`, `aliases`, `lemmatizer_application`, `alias_lemmatization`, `negative_aliases`,`negative_search_boolean`, `negative_alias_lemmatization`, `user`, `email_alert`, `search_type`, `sentence_wo_neg_boolean`, `source_select`, `alert_title`, `date_added`, `email_subject`, `header`, `subheader`, `subheader_order`, `recepient_list`, `frequency`) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);'''
      ome_index += 1  # increase index as necessary
      cur.execute(
        insert_ome_alert_query, (
            ome_index,
            keywords,
            aliases, 
            lemmapp, 
            aliaslem, 
            negalias, 
            negsearchbool, 
            negaliaslemm, 
            user, 
            emailAlert, 
            searchtype, 
            senWoNegBool, 
            sourceClass, 
            alertTitle, 
            alertDate,
            emailSubject,
            header,
            subheader,
            subheaderOrder,
            recepientList,
            frequency
          )
        )
    except Exception as e:
      print("Insert OME Alert Exception", e)

  get_last_updated_ome_alert_query = '''SELECT * FROM `ome_alerts_DJ_fe_design` ORDER BY idome_alerts DESC LIMIT 1;'''
  cur.execute(get_last_updated_ome_alert_query)
  last_updated_ome_alert = cur.fetchall()

  print(last_updated_ome_alert, flush=True)
  
  connection.commit()
  connection.close()

  # return jsonify(results=last_updated_ome_alert)
  return jsonify(results='done')

@app.route('/keys')
@cross_origin()
def get_keywords_aliases():
  print('Inside get keywords and aliases', flush=True)
  connection = connect_db()
  cur = connection.cursor()
  # keyword_query = '''SELECT DISTINCT keyword FROM `ome_alerts_DJ_fe_design`;'''
  keyword_query = '''SELECT DISTINCT keyword, COUNT(*) AS magnitude 
    FROM `ome_alerts_DJ_fe_design` 
    GROUP BY keyword 
    ORDER BY magnitude DESC
    LIMIT 45'''
  cur.execute(keyword_query)
  keywords = cur.fetchall()

  # alias_query = '''SELECT DISTINCT aliases FROM `ome_alerts_DJ_fe_design`;'''
  alias_query = '''SELECT DISTINCT aliases, COUNT(*) AS magnitude 
    FROM `ome_alerts_DJ_fe_design` 
    GROUP BY aliases 
    ORDER BY magnitude DESC
    LIMIT 12'''
  cur.execute(alias_query)
  aliases = cur.fetchall()

  subheading_query = '''SELECT DISTINCT subheader
    FROM `ome_alerts_DJ_fe_design`
    '''
  cur.execute(subheading_query)
  subheadings = cur.fetchall()
  print(subheadings, flush=True)

  heading_query = '''SELECT DISTINCT header
    FROM `ome_alerts_DJ_fe_design`
    '''
  cur.execute(heading_query)
  headings = cur.fetchall()
  print(headings, flush=True)

  d = dict()
  d['keywords'] = keywords
  d['aliases'] = aliases
  d['subheadings'] = subheadings
  d['headings'] = headings
  
  connection.commit()
  connection.close()
  return jsonify(d)

@app.route('/alerts', methods=["POST"])
@cross_origin()
def alerts():
  print('Inside alerts', flush=True)
  
  connection = connect_db()
  cur = connection.cursor()

  user = request.json['user']
  print('user', flush=True)

  currentPage = request.json['activePage']

  #setting pageLimit as constant for now, should probably set as environment variable
  pageLimit = 5
  skipLimit = (currentPage-1)*pageLimit
  
  fetch_user_query = """SELECT alert_title, user, date_added, subheader, header, email, idome_alerts
    FROM ome_alerts_DJ_fe_design
    WHERE user LIKE %s
    ORDER BY date_added DESC
    LIMIT %s 
    OFFSET %s
    """
  cur.execute(fetch_user_query, ["%" + user + "%", pageLimit, skipLimit])
  alerts = cur.fetchall()
  print(alerts, flush=True)

  total_user_query = """SELECT COUNT(SELECT * WHERE user LIKE %s) FROM ome_alerts_DJ_fe_design"""
  total_user_query = """SELECT COUNT(*) FROM (
    SELECT * FROM ome_alerts_DJ_fe_design WHERE user LIKE %s
  ) AS derived;"""
  cur.execute(total_user_query, ["%" + user + "%"])
  count = cur.fetchall()
  print(count, flush=True)


  subheading_query = '''SELECT DISTINCT subheader
    FROM `ome_alerts_DJ_fe_design`
    '''
  cur.execute(subheading_query)
  subheadings = cur.fetchall()

  heading_query = '''SELECT DISTINCT header
    FROM `ome_alerts_DJ_fe_design`
    '''
  cur.execute(heading_query)
  headings = cur.fetchall()

  email_query = '''SELECT DISTINCT email
    FROM `ome_alerts_DJ_fe_design`
    '''
  cur.execute(email_query)
  emails = cur.fetchall()

  res = dict()
  res['alerts'] = alerts
  res['count'] = math.ceil(count[0][0]/pageLimit)
  res['subheadings'] = subheadings
  res['headings'] = headings
  res['emails'] = emails
  
  connection.commit()
  connection.close()
  return jsonify(res)


@app.route('/update_alert', methods=["POST"])
@cross_origin()
def update_alert():
  print('Inside update alerts', flush=True)
  
  connection = connect_db()
  cur = connection.cursor()

  print(request.json, flush=True)

  #data = request.data
  
  omeId = request.json[6]
  subheader = request.json[3]
  header = request.json[4]
  email = request.json[5]

  print(header, flush=True)

  alert_update_query = "UPDATE ome_alerts_DJ_fe_design SET subheader=%s, header=%s, email=%s WHERE idome_alerts=%s;"
  values = (subheader, header, email, omeId)
  cur.execute(alert_update_query, values)

  res = 'updated'
  
  connection.commit()
  connection.close()
  return jsonify(res)

if __name__ == '__main__':
  app.run(debug=False)