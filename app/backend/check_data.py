import sys
import json
import pandas
import os

"""
    Data format: channel(id) ,originating(u_id), terminating(u_id), ts(real), type(message/file_share) edited(binomial), edited_by(u_id), edit_ts(real), attachment(binomial)
"""
IM_DATA_FILENAME = "im_data.txt"
headers = ["channel","originating", "terminating", "ts", "type", "edited", "edited_by", "edit_ts", "attachment"]


def read_stored_df():
    return pandas.DataFrame(json.load(open("C:\\sociometric-analysis-dashboard\\app\\backend\\public\\uploads\\"+IM_DATA_FILENAME)),columns=headers)

def main():
    try:
        im_data_df = read_stored_df()
        print("OK")
        sys.exit(0)
    except Exception as e:
        print("NOK")
        print(e)
        sys.exit(-1)
    
if __name__ == '__main__':
    main()