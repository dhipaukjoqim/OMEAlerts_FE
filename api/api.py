from asyncio.windows_events import NULL
from pickle import NONE
from urllib import request
from flask import Flask, jsonify, request
from flask_cors import cross_origin
import pymysql
import json
import os
from dotenv import load_dotenv
import logging

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

def connect_db():
  connection = pymysql.connect(host=mysql_host, user=mysql_user, port=int(mysql_port), password=mysql_password, database=mysql_dbname, connect_timeout=CONNECTION_TIMEOUT)
  print("connected to db")
  return connection

  
def get_cursor(connection): 
  connection.ping(reconnect=True)
  return connection.cursor()

app = Flask(__name__)

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
  
  logoURL = request.json['logoURL']
  if not logoURL:
    logoURL = None
  
  subheader = request.json['subheader']
  if not subheader:
    subheader = None
  
  subheaderOrder = request.json['subheaderOrder']
  if not subheaderOrder:
    subheaderOrder = None

  get_last_updated_ome_id_query = '''SELECT MAX(idome_alerts) FROM `ome_alerts_DJ_fe_design`;'''
  cur.execute(get_last_updated_ome_id_query)
  last_updated_ome_id = cur.fetchall()

  if last_updated_ome_id:
    try:
      ome_index = last_updated_ome_id[0][0]
      insert_ome_alert_query = '''INSERT INTO `ome_alerts_DJ_fe_design` (`idome_alerts`,`keyword`, `aliases`, `lemmatizer_application`, `alias_lemmatization`, `negative_aliases`,`negative_search_boolean`, `negative_alias_lemmatization`, `user`, `email_alert`, `search_type`, `sentence_wo_neg_boolean`, `source_select`, `alert_title`, `date_added`, `email_subject`, `logo_url`, `subheader`, `subheader_order`) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);'''
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
            logoURL,
            subheader,
            subheaderOrder
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

  d = dict()
  d['keywords'] = keywords
  d['aliases'] = aliases
  d['subheadings'] = subheadings
  
  # response = {
  #   keywords,
  #   aliases
  # }
  
  connection.commit()
  connection.close()
  return jsonify(d)

if __name__ == '__main__':
  app.run(debug=False)