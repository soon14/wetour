<template>
  <el-drawer
    :title="
      dialogType == 'create' ? '新增' : dialogType === 'edit' ? '修改' : '查看'
    "
    @close="handleClose"
    direction="ltr"
    custom-class="demo-drawer"
    ref="drawer"
    :close-on-click-modal="false"
    size="70%"
    :visible.sync="visible"
     :wrapperClosable="false"
  >
    <el-scrollbar style="height: 100%">

       <div style="margin: 0 30px; width: 85%;padding-bottom: 100px;">
        <el-form
          :model="dataForm"
          ref="dataForm"
          label-width="140px"
          :rules="dataRule"
        >
          <h4>基本信息</h4>
          <el-form-item label="使用端口："  prop="">
            <el-radio-group v-model="dataForm.businessType" :disabled="dialogType === 'look' || dialogType === 'edit' || dialogType === 'smallEdit'" @change="setBusinessType">
              <el-radio :label="1">wetour旅行</el-radio>
              <el-radio :label="2">微巴士出行</el-radio>
            </el-radio-group>
            
          </el-form-item>
          <el-form-item label="优惠券模板标题：" prop="templateTitle">
            <el-input
              v-model="dataForm.templateTitle"
              maxlength="10"
              :disabled="dialogType === 'look'"
              placeholder="请输入优惠券名称"
            ></el-input>
          </el-form-item>
          <div class="flex-between">
            <el-form-item label="优惠券类型：" >
            <el-select
                v-model="dataForm.couponType"
                :disabled="dialogType === 'look' || dialogType === 'edit' || dialogType === 'smallEdit'"
                style="width: 140px"
                class="filter-item"
              >
                <el-option :value="1" label="满减券" />
                <el-option :value="2" label="满折券" />
              </el-select>
            </el-form-item>
            <template v-if="dataForm.couponType == 1">
              <el-form-item style="flex:1" label-width="100px" prop="withRealAmount">
                <span slot="label">订单满</span>
                <el-input
                  v-model="dataForm.withRealAmount"
                  maxlength="10"
                  placeholder="请输入金额"
                  :disabled="dialogType === 'look' || dialogType === 'edit' || dialogType === 'smallEdit'"
                ></el-input>
              </el-form-item>
              <el-form-item style="flex:1" label-width="50px" prop="reduceRealAmount">
                <span slot="label">减</span>
                <el-input
                  v-model="dataForm.reduceRealAmount"
                  maxlength="10"
                  placeholder="请输入金额"
                  :disabled="dialogType === 'look' || dialogType === 'edit' || dialogType === 'smallEdit'"
                ></el-input>
              </el-form-item>
            </template>
            <template v-else-if="dataForm.couponType == 2">
              <el-form-item style="flex:1" label-width="100px" prop="withRealAmount">
                <span slot="label">订单满</span>
                <el-input
                  v-model="dataForm.withRealAmount"
                  maxlength="10"
                  placeholder="请输入金额"
                  :disabled="dialogType === 'look' || dialogType === 'edit' || dialogType === 'smallEdit'"
                ></el-input>
              </el-form-item>
              <el-form-item style="flex:1" label-width="50px" prop="discount">
                <span slot="label">打</span>
                <div class="flex-start">
                  <el-input
                    v-model="dataForm.discount"
                    maxlength="10"
                    placeholder="请输入1～9.9中的数字"
                    :disabled="dialogType === 'look' || dialogType === 'edit' || dialogType === 'smallEdit'"
                  ></el-input>
                  <span style="padding:0 5px;">折</span>
                  <el-tooltip content="优惠金额：订单金额*（10-折扣）/10" placement="top">
                    <i class="el-icon-warning"></i>
                  </el-tooltip>
                </div>
                <!-- 优惠金额：订单金额*（10-折扣） -->
              </el-form-item>

              
              <el-form-item style="flex:1" label-width="80px" prop="maxDiscountRealAmount">
                <span slot="label">最多优惠</span>
                <div class="flex-start">
                  <el-input
                    v-model="dataForm.maxDiscountRealAmount"
                    maxlength="10"
                    placeholder="请输入金额"
                    :disabled="dialogType === 'look' || dialogType === 'edit' || dialogType === 'smallEdit'"
                  ></el-input>
                  <span style="padding:0 5px;">元</span>

                </div>
              </el-form-item>
            </template>
          </div>
          <div class="flex-between">
            <el-form-item label="发放数量：" prop="releaseQuantity" style="flex:1;">
              <el-input
                v-model="dataForm.releaseQuantity"
                maxlength="4"
                :disabled="dialogType === 'look' || dialogType === 'smallEdit'"
                placeholder="请输入1～9999之间的数字"
              ></el-input>
            </el-form-item>
            <el-form-item label="增发数量：" prop="addQuantity" v-if="dialogType === 'smallEdit'" style="width:50%;">
              <el-input
                v-model="dataForm.addQuantity"
                maxlength="4"
                placeholder="请输入1～9999之间的数字"

              ></el-input>
                <!-- :placeholder="`请输入1～${9999 - dataForm.releaseQuantity}之间的数字`" -->

            </el-form-item>
          </div>
          
          <div class="flex-between" v-if="dialogType != 'create'">
            <el-form-item label="创建人："  style="flex:1;">
              {{dataForm.createUser}}
            </el-form-item>
            <el-form-item label="创建时间："  style="flex:1;">
              {{dataForm.createTime}}
            </el-form-item>
          </div>

          <div class="flex-between" v-if="dialogType != 'create' && dataForm.templateStatus ==3">
            <el-form-item label="下架时间："  style="flex:1;">
              {{dataForm.soldOutTime}}
            </el-form-item>
            <el-form-item label="下架原因："  style="flex:1;">
              {{dataForm.soldOutReason}}
            </el-form-item>
          </div>


          <el-form-item label="优惠券说明：" prop="templateDesc">
            <el-input
              v-model="dataForm.templateDesc"
              maxlength="200"
              :disabled="dialogType === 'look'"
              type="textarea"
              :autosize="{ minRows: 5}"
              placeholder="请输入内容"
            ></el-input>
          </el-form-item>

          <h4>领取信息</h4>

          <el-form-item label="发放方式："  prop="useType">
            <el-radio-group v-model="dataForm.useType" :disabled="dialogType === 'look' || dialogType === 'edit' || dialogType === 'smallEdit'">
              <el-radio :label="1">系统投放</el-radio>
              <el-radio :label="2">自发领取</el-radio>
              <el-radio :label="3">券码兑换</el-radio>
            </el-radio-group>
            
          </el-form-item>

          <el-form-item label="仅新用户可领："  prop="userState" v-if="dataForm.useType != 1">
            <el-radio-group v-model="dataForm.userState" :disabled="dialogType === 'look' || dialogType === 'smallEdit'">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
            
          </el-form-item>
          
          <div class="flex-start">
            <el-form-item label="每人领取张数："  prop="userLimitType" v-if="dataForm.useType != 1">
              <el-radio-group v-model="dataForm.userLimitType" :disabled="dialogType === 'look' || dialogType === 'smallEdit'">
                <el-radio :label="0">不限</el-radio>
                <el-radio :label="1">
                  限
                </el-radio>
                
              </el-radio-group>
              
            </el-form-item>
            <el-form-item label=""  prop="userLimitNumber" v-if="dataForm.useType != 1" label-width="10px">
              <div class="flex-start" >
                <el-input
                  v-model="dataForm.userLimitNumber"
                  maxlength="7"
                  placeholder="请输入1～9999999之间的数字"
                  :disabled="dialogType === 'look' || dataForm.userLimitType != 1  || dialogType === 'smallEdit'"
                ></el-input>
                <span style="padding:0 5px;">张</span>
              </div>
            </el-form-item>

          </div>
          
          <div class="flex-between">
            <el-form-item label="可领取时间段："  :prop="dataForm.useType != 1?'time':''" v-show="dataForm.useType != 1">
              <el-date-picker
                size="small"
                type="daterange"
                v-model="dataForm.time"
                range-separator="至"
                value-format="yyyy-MM-dd"
                end-placeholder="结束日期"
                start-placeholder="开始日期"
                style="margin-bottom: 10px; vertical-align: middle; margin-left: 10px"
                :picker-options="pickerOptions"
                @change="handelTimeChange"
                :clearable="false"
                :disabled="dialogType === 'look'  || dialogType === 'smallEdit'"
              />
            </el-form-item>


            <el-form-item label="延期至："  prop="endTime" v-if="dialogType === 'smallEdit' && dataForm.useType != 1">

              <el-date-picker
                v-model="dataForm.endTime"
                type="date"
                  value-format="yyyy-MM-dd"
                :picker-options="endPickerOptions"
                :disabled="dialogType === 'look'"

                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </div>

          <el-form-item label="截止日期："  prop="endTime" v-if="dataForm.useType == 1">
            <!-- <el-date-picker
              size="small"
              type="daterange"
              v-model="dataForm.time"
              range-separator="至"
              value-format="yyyy-MM-dd"
              end-placeholder="结束日期"
              start-placeholder="开始日期"
              style="margin-bottom: 10px; vertical-align: middle; margin-left: 10px"
              :picker-options="pickerOptions"
              @change="handelTimeChange"
            /> -->

            <el-date-picker
              v-model="dataForm.endTime"
              type="date"
                value-format="yyyy-MM-dd"
              :picker-options="endPickerOptions"
              :disabled="dialogType === 'look'"

              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          

          <h4>使用信息</h4>


          <el-form-item label="优惠券有效期："  >
            <div>
              <el-radio v-model="dataForm.deadlineType" :label="1" class="flex-start" style="margin-bottom:18px;" :disabled="dialogType === 'look' || dialogType === 'smallEdit'">
                <el-form-item prop="couponTime" style="margin-bottom:0;">

                <el-date-picker
                  size="small"
                  type="daterange"
                  v-model="dataForm.couponTime"
                  :disabled="dialogType === 'look'  || dialogType === 'smallEdit' || (dataForm.useType != 1 && dataForm.time.length == 0) || (dataForm.useType == 1 && !dataForm.endTime) || dataForm.deadlineType != 1"
                  range-separator="至"
                  value-format="yyyy-MM-dd"
                  end-placeholder="结束日期"
                  start-placeholder="开始日期"
                  :picker-options="couponPickerOptions"
                  @change="couponChange"
                  :clearable="false"

                />
                </el-form-item>
              </el-radio>
            </div>
            <div>
              <el-radio v-model="dataForm.deadlineType" :label="2" class="flex-start" :disabled="dialogType === 'look' || dialogType === 'smallEdit'">
                <div class="flex-start">
                  <el-form-item style="flex:1;margin-bottom:0;" label-width="50px"  prop="effectiveDay">
                    <div slot="label">领券后</div>
                    <el-input
                      v-model="dataForm.effectiveDay"
                      maxlength="10"
                      placeholder="请输入天数"
                      :disabled="dialogType === 'look' || dataForm.deadlineType != 2 || dialogType === 'smallEdit'"
                    ></el-input>
                  </el-form-item>
                  <el-form-item style="flex:1;margin-bottom:0;" label-width="150px" prop="validDay">
                    <div slot="label">天后生效，有效期</div>
                    <div class="flex-start">
                      <el-input
                        v-model="dataForm.validDay"
                        maxlength="10"
                        placeholder="请输入天数"
                        :disabled="dialogType === 'look' || dataForm.deadlineType != 2 || dialogType === 'smallEdit'"
                      ></el-input>
                      <span style="padding:0 5px;">天</span>
                      <el-tooltip  placement="top">
                        <div slot="content" style="text-align:center;max-width:300px;">有效期按自然天计算。举例：如设置领券后立即生效且有效期2天，用户在5月21日14:00时领取优惠券，则该优惠券的可用时间为5月21日的00:00:00至5月22日的23:59:59。</div>
                        <i class="el-icon-warning"></i>
                      </el-tooltip>
                    </div>
                    
                  </el-form-item>
                </div>
              </el-radio>
            </div>
          </el-form-item>


          <el-form-item label="生效时间："  prop="weekConfig">
            <!-- <el-radio-group v-model="dataForm.type" :disabled="dialogType === 'look'">
              <el-radio :label="0">系统投放</el-radio>
              <el-radio :label="1">自发领取</el-radio>
              <el-radio :label="2">券码兑换</el-radio>
            </el-radio-group> -->
              
            <el-checkbox-group v-model="dataForm.weekConfig" :disabled="dialogType === 'look' || dialogType === 'smallEdit'" >
              <el-checkbox label="1">周一</el-checkbox>
              <el-checkbox label="2">周二</el-checkbox>
              <el-checkbox label="3">周三</el-checkbox>
              <el-checkbox label="4">周四</el-checkbox>
              <el-checkbox label="5">周五</el-checkbox>
              <el-checkbox label="6">周六</el-checkbox>
              <el-checkbox label="0">周日</el-checkbox>
            </el-checkbox-group>
          </el-form-item>

          <el-form-item label="可用业务类型："  prop="charteredTypeConfig" v-if="dataForm.businessType == 1" >
            <el-checkbox-group v-model="dataForm.charteredTypeConfig" :disabled="dialogType === 'look' || dialogType === 'smallEdit'">
              <el-checkbox label="1">日租包车</el-checkbox>
              <el-checkbox label="2">接机包车</el-checkbox>
              <el-checkbox label="3">送机包车</el-checkbox>
              <el-checkbox label="4">单程包车</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <!-- weekConfig -->

          <el-form-item label="可用城市选择："  prop="cityConfig" >
         

            <el-transfer
              filterable
              :filter-method="filterMethod"
              filter-placeholder="请输入城市"
              v-model="dataForm.cityConfig"
              :titles="['可选城市', '已选城市']"
              @change="cityChange"
             
              :data="cityList">
            </el-transfer>

          </el-form-item>


          <!-- (包车) -->
          <el-form-item label="可用车型："  prop="busTypeConfig" v-if="dataForm.businessType == 1">
            <el-select
                v-model="dataForm.busTypeConfig"
                filterable clearable
                multiple
                style="width:100%;"
                :disabled="dialogType === 'look' || dialogType === 'smallEdit'"
                
              >
              <el-option value="5" label="舒适5座" />
              <el-option value="7" label="舒适7座" />
              <el-option value="12" label="商务12座" />
              <el-option value="19" label="小巴19座" />
              <el-option value="37" label="大巴37座" />
              <el-option value="49" label="大巴49座" />
            </el-select>
          </el-form-item>

          <!-- (城际专线) -->
          <el-form-item label="可用线路："  prop="lineConfig" v-if="dataForm.businessType == 2">
            <el-select
                v-model="dataForm.lineConfig"
                filterable clearable
                multiple
                :disabled="dialogType === 'look' || dialogType === 'smallEdit'"
                style="width:100%;"
              >

              <!-- lineList -->
              <el-option :value="item.id+''" :label="item.lineName" v-for="item in lineList" :key="item.id" />

              <!-- <el-option :value="5" label="舒适5座" />
              <el-option :value="12" label="商务12座" />
              <el-option :value="19" label="小巴19座" />
              <el-option :value="37" label="大巴37座" />
              <el-option :value="49" label="大巴49座" /> -->
            </el-select>
          </el-form-item>


          


          <!-- 5:'舒适5座',7:'舒适7座',12:'商务12座',19:'小巴19座',37:'大巴37座',49:'大巴49座' -->


        </el-form>
        <div class="flex-between" style="margin-top: 30px">
          <div></div>
          <div>
            <el-button @click="visible = false">取消</el-button>
            <el-button
              type="primary"
              @click="dataFormSubmit()"
              v-if="dialogType !== 'look'"
              :loading="!canSubmit"
              >确定</el-button
            >
          </div>
        </div>
      </div>
    </el-scrollbar>
    <!-- <mapDialog :myData="dataForm"  v-if="mapVisible" ref="map" @success="mapSuccess" @close="mapVisible = false"></mapDialog> -->
  </el-drawer>
</template>

<script>
import { cityCnSelect} from "@/api/wetour/order.js";
import { getCitySelect, getLineSelect } from "@/api/busadmin/line";
import { code } from "@/util/adcode";
import { addObj, putObj } from "@/api/market/template";

import moment from "moment"

export default {
  data() {
    const checkEffectiveDay = (rule, value, callback)=>{
      if(this.dataForm.deadlineType ==1){
        callback();
      }else{
        let reg =  /^([0-9]|[1-9][0-9]|[1-2][0-9][0-9]|[3][0-5][0-9]|(360|361|363|362|364|365))$/
        if(!reg.test(value)){
          callback(new Error('请输入大于等于0小于365的正整数'));
        }else{
          callback();
        }
      }
    }
    const checkValidDay = (rule, value, callback)=>{
      if(this.dataForm.deadlineType ==1){
        callback();
      }else{
        let reg = /^([1-9]|[1-9][0-9]|[1-2][0-9][0-9]|[3][0-5][0-9]|(360|361|363|362|364|365))$/
        if(!reg.test(value)){
          callback(new Error('请输入大于0小于365的正整数'));
        }else{
          callback();
        }
      }
    }
    
    
    const checkUserLimitNumber = (rule, value, callback)=>{
      if(this.dataForm.userLimitType == 0){
        callback();
      }else{
        let reg = /^[1-9]\d*$/
        if(!reg.test(value)){
          callback(new Error('请输入大于0的正整数'));
        }else{
          callback();
        }
      }
    }

    const checkCouponTime = (rule, value, callback)=>{
      if(this.dataForm.deadlineType != 1){
        callback();
      }else{
        
        if(this.dataForm.couponTime.length != 2){
          callback(new Error('请选择优惠券有效时间'));
        }else{
          callback();
        }
      }
    }

    const checkAddQuantity = (rule, value, callback)=>{
      // if(this.dataForm.deadlineType != 1){
      //   callback();
      // }else{
        let reg =  /^[1-9]\d*$/
        if(!reg.test(this.dataForm.addQuantity)){
          callback(new Error('请输入大于0的正整数'));
        }else if(this.dataForm.addQuantity<1 || this.dataForm.addQuantity > 9999-this.dataForm.releaseQuantity){
          
          callback(new Error(`请输入1～${9999 - this.dataForm.releaseQuantity}之间的数字`));

        }else{
          callback();
        }

        
      // }
    }

    
    
    return {
      canSubmit: true,
      mapVisible: false,
      selectDate:false,
      dataForm: {
        // type:1,
        id: 0,
        // siteName: "",
        // province: "",
        // city: "",
        // town: "",
        // stationType: "",
        // stationLocation: [],
        // stationShape: 0,
        // stationPoint: [],
        // centerPoint: [],
        // createUser: "",
        // createTime: "",
        // updateUser: "",
        // updateTime: "",
        // address: "",


        time:[],
        couponTime:[],
        
        templateDesc: "1、优惠券使用后，不会退回\n2、优惠券不能兑换成现金\n3、优惠券无法叠加使用\n4、如有疑问，请联系客服\n5、使用优惠券的订单，进入待支付状态，订单失效后，优惠券不退回",
      
        templateTitle:"",  // '优惠券模版标题',
        couponType:1, // '优惠券类型，1=满减劵，2=满折券',
        withRealAmount:"",   // '满多少金额，单位分',
        reduceRealAmount:"", // '减多少金额，单位分',

        discount:'', //折扣',
        maxDiscountRealAmount:"", //'最多优惠金额，单位分',
        releaseQuantity:"", //发放数量
        addQuantity:'', //增发数量
        deadlineType:1,   // '优惠券截止时间类型，1=绝对时间，2=相对时间',
        businessType:1, //'业务类型，1=wetour旅游，2=微巴士出行',
        effectiveDay:'', //'领券后几天后生效',
        validDay:'', //'有效期天数',
        weekConfig:[], // '生效时间配置，周日为0，周一为1，以此类推，多个值以逗号隔开'
        charteredTypeConfig:[], //  '可用业务类型配置，1=日租，2=接机，3=送机，4=单程，多个值以逗号隔开',
        busTypeConfig:[],  //'可用车型配置，多个值以逗号隔开',
        lineConfig:[],  //'可用线路配置，多个值以逗号隔开',

        cityConfig:[],  //选择城市
        // lineConfig:[] , //选择线路
        useType:1 , //  发放类型
        userState:1, // 仅新用户可领：
        userLimitType:0,  // '用户领取张数限制，0=不限，1=限制',
        userLimitNumber:'',  //  '每人领取限制张数',
      },
      filterMethod(query, item) {
        return item.label.indexOf(query) > -1;
      },
      cityList:[],
      cityListOne:[],
      cityListTwo:[],
      lineList:[],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < new Date().getTime() - 24 * 3600 * 1000
        }
      },
      endPickerOptions: this.endLimitTime(),
      couponPickerOptions:this.limitTime(),
      dataRule: {
        templateTitle:[
          {
            required: true,
            message: "优惠券模板标题不可空",
            trigger: "blur",
          }
        ],
        effectiveDay: [
          {validator: checkEffectiveDay,trigger: 'blur'}
        ],
        validDay: [
          {validator: checkValidDay,trigger: 'blur'}
        ],
        // busTypeConfig:[
        //   {
        //     required: true,
        //     message: "车型不可空",
        //     trigger: "change",
        //   }
        // ],
        withRealAmount: [
          {
            required: true,
            message: "金额不能为空",
            trigger: "blur",
          },
          {
            pattern:
              /^(([1-9]\d{1,6}(\.\d{1,2})?)|\d((\.\d{1,2})?))$/,
                message: "价格(0~9999999.99),两位小数",
            //   /^([1-9]\d{0,6})([.]\d{1,2})?$|^0[.]([1-9]\d{0,1}|[0-9][1-9])$/,
            // message: "价格(0.01~9999999.99),两位小数",
          },
        ],
        reduceRealAmount: [
          {
            required: true,
            message: "金额不能为空",
            trigger: "blur",
          },
          {
            pattern:
             /^(([1-9]\d{1,6}(\.\d{1,2})?)|\d((\.\d{1,2})?))$/,
                message: "价格(0~9999999.99),两位小数",
          },
        ],
        discount: [
          {
            required: true,
            message: "折扣不能为空",
            trigger: "blur",
          },
          {
            pattern:
              /^[1-9]{1}(\.[0-9])?$/,
            message: "价格(1~9.9),一位小数",
          },
        ],
        maxDiscountRealAmount: [
          {
            required: true,
            message: "金额不能为空",
            trigger: "blur",
          },
          {
            pattern:
              /^([1-9]\d{0,6})([.]\d{1,2})?$|^0[.]([1-9]\d{0,1}|[0-9][1-9])$/,
            message: "价格(0.01~9999999.99),两位小数",
          },
        ],
        releaseQuantity: [
          {
            required: true,
            message: "发放数量不能为空",
            trigger: "blur",
          },
          {
            pattern:
              /^[1-9]\d*$/,
            message: "请输入正整数",
          },

        ],
        addQuantity: [
          {
            required: false,
            message: "增发数量不能为空",
            trigger: "blur",
          },
          {
            pattern:
              /^[1-9]\d*$/,
            message: "请输入正整数",
          },
          // {validator: checkAddQuantity,trigger: 'blur'},

        ],
        templateDesc: [
          {
            required: true,
            message: "优惠券说明不能为空",
            trigger: "blur",
          }
        ],
        useType: [
          {
            required: true,
            message: "请选择发放方式",
            trigger: "change",
          }
        ],
        userState: [
          {
            required: true,
            message: "请选择是否新用户可领",
            trigger: "change",
          }
        ],
        userLimitNumber: [
          {validator: checkUserLimitNumber,trigger: 'blur'}
        ],
        time: [
          {
            required: true,
            message: "请选择可领取时间段",
            trigger: "change",
          }
        ],
        endTime: [
          {
            required: true,
            message: "请选择截止日期",
            trigger: "change",
          }
        ],
        // weekConfig: [
        //   {
        //     required: true,
        //     message: "请选择生效时间",
        //     trigger: "change",
        //   }
        // ],
        // charteredTypeConfig: [
        //   {
        //     required: true,
        //     message: "请选择可用业务类型",
        //     trigger: "change",
        //   }
        // ],
        // cityConfig: [
        //   {
        //     required: true,
        //     message: "请选择城市",
        //     trigger: "change",
        //   }
        // ],
        couponTime: [
          // {
          //   required: true,
          //   message: "请选择优惠券有效时间",
          //   trigger: "change",
          // }
          {validator: checkCouponTime,trigger: 'change'}

        ],
      }
      // /^[1-9]{1}(\.[0-9])?$/    1～9.9

      // ^[1-9]\d*$    正整数
    };
  },
  components: {
    //   mapDialog
  },
  props: {
    dialogData: {
      type: Object,
      default: () => ({}),
    },
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    dialogType: {
      type: String,
      default: "",  //create  新增  edit 待上架编辑   look 查看
    },
  },
  computed: {
    visible: {
      get() {
        return this.dialogVisible;
      },
      set(val) {
        if(!val){
            this.$emit("refreshDataList");
          }
        this.$emit("update:dialogVisible", val);
      },
    },
  },
  filters: {
    
    statusFil(val) {
      const map = {
        0: "未过期",
        1: "已过期",
      };
      return map[val];
    },
  },
  methods: {
    setBusinessType(){
      this.dataForm.cityConfig = []
      if(this.dataForm.businessType == 2){
        this.cityList = this.cityListOne
      }else{
        this.cityList = this.cityListTwo
        this.dataForm.lineConfig = []
        this.getLineSelect()
      }
      this.$refs.dataForm.clearValidate();
    },
    couponChange(){
      // if(this.dataForm.couponTime.length == 1){
      //   this.selectDate = true
      // }else{
      //   this.selectDate = false;
      // }
    },
    endLimitTime(){
      let _this = this
      return {
        disabledDate(time) {
          
          if(_this.dialogType == 'smallEdit' && _this.dataForm.useType == 1){
            
            return time.getTime() < moment(_this.dialogData.endTime,'YYYY-MM-DD').valueOf()
          }else if(_this.dialogType == 'smallEdit' && _this.dataForm.useType != 1){
            return time.getTime() < moment(_this.dialogData.time[1],'YYYY-MM-DD').valueOf()
          }
          return time.getTime() < new Date().getTime() - 24 * 3600 * 1000

        }
      }
    },
    limitTime(){
      let _this = this
      return {
        onPick: ({ maxDate, minDate }) => {
          // this.selectDate = minDate.getTime();
          // if (maxDate) {
          //   this.selectDate = "";
          // }
          console.log(maxDate, minDate,'-----',_this.selectDate)
          if(minDate && !maxDate){
            _this.selectDate = true;
          }else if(minDate && maxDate){
            _this.selectDate = false;
          }else{
            _this.selectDate = false;
          }

          // if(minDate){
          //   _this.selectDate = false;
          // }else{
          //   _this.selectDate = true;

          // }

          
        },
        disabledDate(time) {
          // console.log(_this.dataForm.time)
          // console.log(moment(_this.dataForm.time,'YYYY/MM/DD').valueOf())
          // return time.getTime() < new Date().getTime()
          let timeArr = _this.dataForm.time,minTime='',maxTime=''
          
          if(timeArr.length && timeArr[0].replace(/-/ig,'') - timeArr[1].replace(/-/ig,'') > 0){
            minTime = timeArr[1],maxTime = timeArr[0]
          }else{
            minTime = timeArr[0],maxTime = timeArr[1]
          }
          if(!_this.selectDate){
            let myTime = ''
            if(_this.dataForm.useType != 1){
              myTime = moment(minTime,'YYYY/MM/DD').valueOf()
            }else{
              myTime = moment(moment().format('YYYY/MM/DD'),'YYYY/MM/DD').valueOf()
            }
            return time.getTime() <= myTime - 24 * 3600 * 1000 

          }else{
            // if(_this.dataForm.useType != 1){
              let myTime = ''
              if(_this.dataForm.useType != 1){
                myTime = moment(maxTime,'YYYY/MM/DD').valueOf()
              }else{
                myTime = moment(_this.dataForm.endTime,'YYYY/MM/DD').valueOf()
              }
              console.log(time.getTime() , myTime - 24 * 3600 * 1000,time.getTime() <= myTime - 24 * 3600 * 1000  )
              return time.getTime() <= myTime - 24 * 3600 * 1000 


            // }else{
            //   return time.getTime() < moment(_this.dataForm.couponTime[0],'YYYY/MM/DD').valueOf() + 24 * 3600 * 1000
            // }

          }
        }
      }
    },
    handelTimeChange(){
      console.log(this.dataForm.time,this.selectDate,66666)
      this.dataForm.couponTime = []
      this.selectDate = false
    },
    // 重置
    resetForm() {
      this.$refs["dataForm"].resetFields();
    },
    handleClose() {
      setTimeout(() => {
        this.$emit("close");
      }, 300);
      
    },
    dataFormSubmit(){
      console.log(this.dataForm,'-----')
      this.$refs['dataForm'].validate((valid) => {
        if(valid){
          let data = Object.assign({},this.dataForm)
          data.weekConfig = data.weekConfig.join(",")

          // data.charteredTypeConfigStr
          let mapCharteredType = {
            1:'日租包车',
            2:'接机包车',
            3:'送机包车',
            4:'单程包车',
          }
          let charteredArr = []
          data.charteredTypeConfig.forEach(element => {
            charteredArr.push(mapCharteredType[element])
          });

          data.charteredTypeConfig = data.charteredTypeConfig.join(",")
          data.charteredTypeConfigStr = charteredArr.join(",")



          // busTypeConfigStr
          let busTypeMap = {
            5:'舒适5座',
            7:'舒适7座',
            12:'商务12座',
            19:'小巴19座',
            37:'大巴37座',
            49:'大巴49座',
          }
          let busArr = []
          data.busTypeConfig.forEach(element => {
            busArr.push(busTypeMap[element])
          });
          data.busTypeConfig = data.busTypeConfig.join(",")
          data.busTypeConfigStr = busArr.join(",")

          let cityLabelArr = []


          if(data.businessType == 1 && data.cityConfig.length){
            // this.cityListTwo
            this.cityListTwo.forEach(element => {
              if(data.cityConfig.indexOf(element.key)!= -1) cityLabelArr.push(element.label)
            });
            // data.cityConfig.forEach(element => {
            //   let bol = this.cityListTwo.some(item => item.key === element)
            //   console.log(element,bol)

            // })
            
          }else if(data.businessType == 2 && data.cityConfig.length){
            this.cityListOne.forEach(element => {
              if(data.cityConfig.indexOf(element.key)!= -1) cityLabelArr.push(element.label)
            });
          }
          
          data.cityConfig = data.cityConfig.join(",")
          data.cityConfigStr = cityLabelArr.join(",")


          let lineLabelArr = []

          data.lineConfig.forEach(element=>{
            this.lineList.forEach(element => {
              if(data.lineConfig.indexOf(element.id+'')!= -1 && lineLabelArr.indexOf(element.lineName) == -1) lineLabelArr.push(element.lineName)
            });
          })

          data.lineConfig = data.lineConfig.join(",")
          data.lineConfigStr = lineLabelArr.join(",")


          if(data.useType != 1){
            data.startTime = data.time[0] + " 00:00:00"
            data.endTime = data.time[1] + " 23:59:59"
          }else{
            data.startTime = moment().format("YYYY-MM-DD") + " 00:00:00"
            data.endTime = data.endTime.split(' ')[0] + " 23:59:59"
          }

          if(this.dialogType == 'smallEdit'){
            data.endTime = this.dataForm.endTime.split(' ')[0] + " 23:59:59"
            data.releaseQuantity = null

          }
          if(data.deadlineType == 1){
            data.couponStartTime = data.couponTime[0] + " 00:00:00"
            data.couponEndTime = data.couponTime[1] + " 23:59:59"
          }
          // addObj
          // putObj


          if(this.dialogType == 'create'){
            addObj(data).then(res=>{
              if(res.data.code == 0 ){
                this.$message.success(`新增成功`);
                // this.dialogFormVisible = false
                this.visible = false
              }
            })
          }else{
            
            
            putObj(data).then(res=>{
              if(res.data.code == 0 ){
                this.$message.success(`修改成功`);
                // this.dialogFormVisible = false
                this.visible = false
              }
            })
          }
        }
      })
      // console.log(this.dataForm,3333)
      // console.log(this.dataForm.remarks,3333)
    },
    cityCnSelect(){
      cityCnSelect().then(res=>{
        let arr = []
        res.data.data.forEach(element => {
          if( this.dialogType == 'look' || this.dialogType === 'smallEdit'){
            element.disabled = true
          }
          arr.push({
            ...element,
            key:element.id+'',
            label:element.city,
          })
        });
        this.cityListTwo = arr
        if(this.dataForm.businessType == 1){
          this.cityList = arr
        }
      })
    },
    getCitySelect(){
      getCitySelect().then(res=>{
        let arr = []
        res.data.data.forEach(element => {
          if(this.dialogType == 'look' || this.dialogType === 'smallEdit'){
            element.disabled = true
          }
          arr.push({
            ...element,
            key:element.fromCity+'',
            label:code[element.fromCity]
          })
        });
        this.cityListOne = arr
        if(this.dataForm.businessType == 2){
          this.cityList = arr
        }
      })
    },
    getLineSelect(){
      // this.dataForm.cityConfig
      let cityCodeList = this.dataForm.cityConfig.join(',')
      getLineSelect({cityCodeList}).then(res=>{
        // console.log(res,'-444444')
        this.lineList = res.data.data
      })
    },
    cityChange(){
      if(this.dataForm.businessType == 2){
        this.dataForm.lineConfig = []
        this.getLineSelect()
      }
    },
  },
  created() {
    this.cityCnSelect()
    this.getCitySelect()
    this.getLineSelect()
    // this.dataForm = this.dialogData;
    if(this.dialogType == 'edit' || this.dialogType == 'look'  || this.dialogType == 'smallEdit'){
      this.dataForm = Object.assign({},this.dialogData)
      console.log(this.dataForm,'-----')
    }
  },
};
</script>
<style scoped lang="scss">
.dialog-footer {
  display: block;
}
/deep/ .el-transfer-panel__item.el-checkbox{
  margin-left: 0;
  display: block!important;
}
</style>