from flask import Flask, request,jsonify
import pandas as pd
import pickle
from surprise import SVD
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

with open('SVD.pkl','rb') as file:
    model = pickle.load(file)

print(type(model))
product_stats = pd.read_csv('product_stats.csv')

@app.route('/')
def home():
    return "Go to recommend page."

@app.route('/recommend',methods=['POST'])
def recommend():
    data = request.get_json()
    user_id = data.get('user_id')

    if not user_id:
        return jsonify({'error': 'User ID is required'}), 400
    
    all_pids = product_stats['Product ID'].tolist()
    predictions = []
    for pid in all_pids:
        pred = model.predict(uid = str(user_id),iid = str(pid))
        predictions.append((pid,pred.est))
    

    rec_df = pd.DataFrame(predictions, columns=['Product ID', 'SVD_Prediction'])

    product_stats_reset = product_stats.reset_index()

    rec_df = rec_df.merge(
        product_stats_reset[['Product ID', 'Weighted_Rating']],
        on='Product ID'
    )

    rec_df['Final_Score'] = (
        (rec_df['SVD_Prediction'] * 0.5) +
        (rec_df['Weighted_Rating'] * 0.5)
    )


    top_recs = rec_df.sort_values('Final_Score',ascending=False).head(5)
    return jsonify(top_recs.to_dict(orient='records'))

if __name__ == '__main__':
    app.run(debug=True, port=5000)