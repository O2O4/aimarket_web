/**
 * Created by zhubg on 2017/10/20.
 */

'use strict';

import { routerRedux } from 'dva/router'
import * as commonService from '../services/common_service';
import {gqlBody_builder} from '../utils/gql/gqlBody_builder';
import {CALLAI_GQL, GETAILIST_GQL} from '../utils/gql/gql_template/index';
import mock_data from '../components/AIList/mock_data/data'
import styles from '../components/AIList/table.css'

const fs = require('fs')


let imgArray = [<img className={styles.image_style} src={require("../assets/images/microsoft.png")}/>,<img className={styles.image_style} src={require("../assets/images/ibm.jpg")}/>,
<img className={styles.image_style} src={require("../assets/images/google.jpg")}/>,
<img className={styles.image_style} src={require("../assets/images/temp6.jpeg")}/>,
<img className={styles.image_style} src={require("../assets/images/baidu.jpg")}/>, <img className={styles.image_style} src={require("../assets/images/baidu.jpg")}/>,
<img className={styles.image_style} src={require("../assets/images/aliyun.jpg")}/>,
<img className={styles.image_style} src={require('../assets/images/xunfei.png')}/>,<img className={styles.image_style} src={require('../assets/images/hanwuji.png')}/>,
<img className={styles.image_style} src={require('../assets/images/tencent.png')}/>, <img className={styles.image_style} src={require('../assets/images/huawei.jpg')}/>]


export default {

  namespace: 'aiList',

  state: {
    sortedInfo:"",
    filteredInfo:"",
    tableData: [],
    callAIResult:{},
    value: "ALL",
    isCollected: "false"
  },
  reducers: {
    saveTableData(state, { payload: { tableData } }) {
      return { ...state, tableData };
    },
    saveCallAIResult(state, { payload: { callAIResult } }) {
      return { ...state, callAIResult };
    },
    saveFilteredInfo(state, { payload: { aiName } }) {
      return { ...state, aiName };
    }
  },
  effects: {
    * callai ({
                payload
              }, { put, call, select }) {
      //request start
      const result = yield call(commonService.service,gqlBody_builder(CALLAI_GQL,payload));
      // console.log(gqlBody_builder(SINUP_GQl,payload));
      let dataContent = JSON.parse(result.data.callAI.content);
      console.log(dataContent);

      yield put({
        type: 'saveCallAIResult',
        payload: {
          callAIResult:dataContent
        }
      });
    }
    ,
    * setFilterInfo ({
                   payload
                 }, { put, call, select }) {
      const tableDataBack = mock_data.tableData;
      let value = payload.toString().toUpperCase();
      if(value === "ALL") {
        yield put({
          type: 'saveTableData',
          payload: {
            tableData:tableDataBack
          }
        });
      }
      // const val = `^${value}$`;
      // const reg = new RegExp(val, 'gi')

      else {
        let tempData = [];
        for (let record in tableDataBack) {
          if(tableDataBack[record].price === value) {
            tempData.push(tableDataBack[record])
          }
        }
        // let tempData = tableData.map((record) => {
        //   // console.log("record")
        //   // console.log(record)
        //   const match = record.price.match(reg)
        //   console.log("match")
        //   console.log(match)
        //   if (!match) return null;
        //   return {
        //     ...record,
        //   };
        // }).filter(record => !!record);
        yield put({
          type: 'saveTableData',
          payload: {
            tableData:tempData
          }
        });
      }

    }
    ,
    * setIsCollected ({
                      payload
                    }, { put, call, select }) {
      const tableDataBack = mock_data.tableData;
      let opt = payload;
      // console.log("=======opt:\n" + opt)
      let tempData = [];
      for (let i in tableDataBack) {
        tempData.push(tableDataBack[i])
        if(tableDataBack[i].key === opt) {
          tempData[i].isCollected = !tempData[i].isCollected;
        }
      }
      //日后将修改后的tableData写入数据库

      //如果直接这么修改的话state树不会自动更新
      // for (let i in tableDataBack) {
      //   if (tableDataBack[i].key === opt) {
      //     tableDataBack[i].isCollected = !tableDataBack[i].isCollected;
      //     console.log("tableDataBack[i].isCollected: " + tableDataBack[i].isCollected);
      //     break;
      //   }
      // }

      // fs.writeFileSync(mock_data.tableData, tableDataBack);
      yield put({
        type: 'saveTableData',
        payload: {
          tableData:tempData
        }
      });
    },

    * setSortOrder ({
                      payload
                    }, { put, call, select }) {
      let tableDataBack = mock_data.tableData;
      let tempData = [];
      let field = '';
      if(payload === 'Popular') {
        field = 'followers';
      }
      function sortBy(field) {
        return function(a, b) {
          return b[field] - a[field];
        }
      }

      tableDataBack.sort(sortBy(field));

      // 如果直接把tableDataBack作为参数传给saveTableData，那么前台不会自动刷新，所以定义一个新的数组传过去
      for (let i in tableDataBack) {
        tempData.push(tableDataBack[i])
      }

      console.log("setSortOrder: =======\n", tempData);
      yield put({
        type: 'saveTableData',
        payload: {
          tableData:tempData
        }
      });
    } 

    ,
    * setcallAIResult ({
                         payload
                       }, { put, call, select }) {
      yield put({
        type: 'saveCallAIResult',
        payload: {
          aiName:payload
        }
      });
    }
    ,
    * getAiListFromDb ({
                         payload
                       }, { put, call, select }) {

        console.log("getAiListFromDb payload: ", payload);
        console.log("getAiListFromDb gqlBody_builder:", gqlBody_builder(GETAILIST_GQL,payload))
        const result = yield call(commonService.service, gqlBody_builder(GETAILIST_GQL, payload));
        console.log("getAiListFromDb result: ", result);
        // console.log("result: ", );
        const aiList = JSON.parse(result.data.getAiList.content);
        let tableData = [];
        for(let i in aiList) {
          let dataTemp = {  
            key: i + 1,
            params: aiList[i].AI_NAME_EN,
            img: imgArray[i],
            name: aiList[i].AI_NAME_CN,
            author: aiList[i].AI_BELONG_COMPANY,
            url: aiList[i].AI_INTRO_URL,
            intro: aiList[i].AI_INTRO,
            price: aiList[i].AI_BILLING_FORMULA,
            developers: aiList[i].AI_DEVELOPERS,
            followers: aiList[i].AI_FOLLOWERS,
            uptime: aiList[i].AI_UPTIME,
            isCollected: false
          };
          tableData.push(dataTemp);
        }
        yield put({
          type: 'saveTableData',
          payload: {
            tableData: tableData
          }
        });
        
    },    

  }
,



}
