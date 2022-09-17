
from flask import Flask, request, jsonify
from decouple import config
from flask_mysqldb import MySQL
from flask_cors import CORS
from app.function import  validateJWT
application = Flask(__name__)
CORS(application)
application.config['MYSQL_HOST'] = config('MYSQL_HOST')
application.config['MYSQL_USER'] = config('MYSQL_USER')
application.config['MYSQL_PASSWORD'] = config('MYSQL_PASSWORD')
application.config['MYSQL_DB'] = config('MYSQL_DB')
mysql = MySQL(application)
ART_VERSE_TABLE = 'ArtVerse'
@application.route('/get-user-posts', methods=['POST'])
def get_user_posts():
    try:
        data = request.get_json()
        publicKey = data['publicKey']
        cur = mysql.connection.cursor()
        cur.execute(
            f'''SELECT * FROM {ART_VERSE_TABLE} WHERE publicKey = "{publicKey}"''')
        posts = cur.fetchall()
        responseJson = {}
        postFound = []
        for post in posts:
            postFoundJson = {
                'postHashHex': post[0],
                'publicKey': post[1],


                'timeStampNanos': post[2]
            }
            postFound.append(postFoundJson)
        responseJson['postsFound'] = postFound

        return jsonify(responseJson)
    except Exception as e:
        print(e)
        return jsonify({'error': 'An error has occured'})


@application.route('/submit-post', methods=['POST'])
def submit_post():
    try:
        data = request.get_json()
        publicKey = data['publicKey']

        postHashHex = data['postHashHex']

        timestampNanos = data['timestampNanos']
        jwtToken = data['jwtToken']
        if validateJWT(jwtToken, publicKey):

            cur = mysql.connection.cursor()
            cur.execute(
                f'''INSERT INTO {ART_VERSE_TABLE}  VALUES ("{postHashHex}", "{publicKey}",{timestampNanos})''')
            mysql.connection.commit()

            return jsonify({'success': 'Post submitted successfully'})
        else:
            return jsonify({'error': 'Invalid JWT token'})
    except Exception as e:
        print(e)
        return jsonify({'error': 'An error has occured'})
