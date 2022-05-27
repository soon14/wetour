<template>
    <el-drawer size="70%" ref="drawer" title="编辑订单" direction="ltr" @close="handleClose" :visible.sync="visible"  :wrapperClosable="false">
        <el-form class="drawer-content" ref="editForm" label-width="130px" :model="resultData" :rules="addRules">
            <h4>行程信息</h4>
            <el-form-item label="包车类型：">
                {{ resultData.charteredCarType | carTypeFil }}
            </el-form-item>
            <el-form-item :label="resultData.charteredCarType == 2 ? '接机机场：' : '出发地点：'" prop="departureAddress">
                {{ resultData.departureCity }}
                <el-select v-if="resultData.charteredCarType == 2" style="flex: 1;  margin-left: 10px"
                    v-model="resultData.departureAddress" @change="onChangeAirport($event, 1)"
                    @visible-change="visibleChange($event, 1)" placeholder="请选择机场" clearable>
                    <el-option v-for="(item, index) in newAirportList" :key="index" :value="item.airportName"
                        :label="item.airportName">
                    </el-option>
                </el-select>
                <el-autocomplete v-else :fetch-suggestions="
                (queryString, cb, type) => {
                    querySearchAsync(queryString, cb, 1)
                }" placeholder="请输入出发地址" @select="(item) => { handleSelect(item, 1) }"
                    v-model="resultData.departureAddress" style="flex: 1; margin-left: 10px" clearable>
                    <template slot-scope="{ item }">
                        <span style="font-size: 14px">{{ item.name }}</span>
                        <div style="
                           font-size: 12px;
                           color: #666;
                           line-height: 1;
                           padding-bottom: 5px;
                         ">
                            {{ item.address || item.formattedAddress }}
                        </div>
                    </template>
                </el-autocomplete>
            </el-form-item>

            <el-form-item :label="resultData.charteredCarType == 3 ? '送机机场：' : '目的地：'"
                v-if="resultData.charteredCarType != 1" prop="destinationAddress">
                {{ resultData.destinationCity }}
                <el-select v-if="resultData.charteredCarType == 3" style="flex: 1;  margin-left: 10px"
                    v-model="resultData.destinationAddress" @change="onChangeAirport($event, 2)"
                    @visible-change="visibleChange($event, 2)" placeholder="请选择机场" clearable>
                    <el-option v-for="(item, index) in newAirportList" :key="index" :value="item.airportName"
                        :label="item.airportName">
                    </el-option>
                </el-select>
                <el-autocomplete v-else :fetch-suggestions="(queryString, cb, type) => {
                    querySearchAsync(queryString, cb, 2)
                }" @select="(item) => { handleSelect(item, 2) }" placeholder="请输入出发地址"
                    v-model="resultData.destinationAddress" style="flex: 1; margin-left: 10px" clearable>
                    <template slot-scope="{ item }">
                        <span style="font-size: 14px">{{ item.name }}</span>
                        <div style="
                             font-size: 12px;
                             color: #666;
                             line-height: 1;
                             padding-bottom: 5px;
                           ">
                            {{ item.address || item.formattedAddress }}
                        </div>
                    </template>
                </el-autocomplete>
            </el-form-item>

            <el-form-item label="用车时间(当地)：">
                {{ resultData.createTime }}
            </el-form-item>
            <el-form-item v-if="resultData.charteredCarType == 1" label="包车范围：">
                {{ resultData.charteredCarRange | carRangeFil }}
            </el-form-item>
            <el-form-item label="乘客人数：">
                成人X{{ resultData.passengerNumber }}人，儿童X{{
                        resultData.childNumber
                }}人，行李X{{ resultData.baggageNumber }}件
            </el-form-item>
            <el-form-item label="车型：">
                <span v-for="(bus, index) in resultData.busType" :key="index">
                    {{ bus.busType | bugTypeFil }}X{{ bus.number }}
                </span>
            </el-form-item>
            <h4>用户信息</h4>
            <el-form-item label="联系号码：">
                {{ resultData.contactMobile || "-" }}
            </el-form-item>
            <!-- <el-form-item label="联系人：">
                {{ resultData.contactName || "-" }}
            </el-form-item> -->
            <el-form-item label="联系人：" prop="contactName">
                <el-input
                    v-model.trim="resultData.contactName"
                    placeholder="请输入联系人"
                    style="flex: 1;"
                    class="filter-item"
                    maxlength="20"
                    clearable
                />
            </el-form-item>
            <el-form-item label="微信：">
                {{ resultData.wei || "-" }}
            </el-form-item>
            <el-form-item label="证件类型：">
                <el-select v-model="resultData.certificateType" style="width: 130px" class="filter-item" filterable>
                    <el-option :value="1" label="身份证号" />
                    <el-option :value="2" label="护照号" />
                </el-select>
                <el-input style="flex: 1; margin-left: 10px" v-model.trim="resultData.certificateNo"
                    placeholder="请输入证件号" class="filter-item" maxlength="20" clearable />
            </el-form-item>
            <el-form-item label="行程备注：">
                <el-input v-model="resultData.orderRemark" placeholder="请输入行程备注" style="flex: 1;" show-word-limit
                    maxlength="200" type="textarea" :autosize="{ minRows: 4, maxRows: 6 }" />
            </el-form-item>
            <h4>订单信息</h4>
            <!-- <el-form-item label="订单价格：">
                {{ resultData.orderAmount || "0" }}
            </el-form-item> -->
            <el-form-item prop="orderAmount" label="订单价格">
                <el-input-number
                    style="flex: 1;"
                    class="filter-item"
                    v-model.number="resultData.orderAmount"
                    placeholder="请输入数量"
                    :min="0.01"
                    :max="10000000"
                ></el-input-number>
            </el-form-item>
            <el-form-item label="订单来源：">
                {{ resultData.orderChannelShow || "-" }}
            </el-form-item>
            <el-form-item label="来源平台订单号：">
                {{ resultData.thirdOrderNo || "-" }}
            </el-form-item>
            <el-form-item label="内部备注：">
                <el-input type="textarea" maxlength="500" style="flex: 1;" show-word-limit placeholder="请输入内部备注"
                    v-model="resultData.innerRemark" :autosize="{ minRows: 4, maxRows: 6 }" />
            </el-form-item>
            <el-form-item label="是否支付：">
                {{ resultData.isPay | isPayFil }}
            </el-form-item>
        </el-form>
        <div class="flex-center" style="margin: 0px 20px">
            <el-button @click="visible = false">返回</el-button>
            <el-button type="primary" @click="onSave" v-loading.fullscreen.lock="saveLoading">保存</el-button>
        </div>
    </el-drawer>

</template>

<script>
import {
    orderInfo
} from "@/api/wetour/order.js";
import { cityCnSelect, airportList ,updateOrder } from "@/api/wetour/order.js";
export default {
    filters: {
        carTypeFil(val) {
            const map = {
                1: '日租',
                2: '接机',
                3: '送机',
                4: '单程',
            }
            return map[val]
        },
        bugTypeFil(val) {
            const map = {
                5: "舒适5座",
                7: "舒适7座",
                12: "商务12座",
                17: "大巴17座",
                37: "大巴37座",
                49: "巴士49座",
            };
            return map[val];
        },
        carRangeFil(val) {
            const map = {
                1: '市内包车',
                2: '周边包车'
            }
            return map[val]
        },
        isPayFil(val) {
            const map = {
                0: '尚未支付',
                1: '已经支付'
            }
            return map[val]
        },
    },
    props: {
        dialogId: {
            type: String,
            default: "",
        },
        dialogVisible: {
            type: Boolean,
            default: false,
        },
    },
    computed: {
        visible: {
            get() {
                return this.dialogVisible;
            },
            set(val) {
                this.$emit("update:dialogVisible", val);
            }
        }
    },
    mounted() {
        this.getDetail();
        this.cityCnSelect();
        this.getAirportList();
    },
    data() {
        return {
            cityList:[],
            airportList:[],
            newAirportList:[],
            resultData: {},
            dataForm:{},
            saveLoading: false,
            addRules: {
                departureAddress: [
                    {
                    required: true,
                    message: "不能为空",
                    trigger: "blur",
                    },
                ],
                destinationAddress: [
                    {
                    required: true,
                    message: "不能为空",
                    trigger: "blur",
                    },
                ],
                contactName: [
                    {
                        required: true,
                        message: "联系人不能为空",
                        trigger: "blur",
                    },
                ],
                orderAmount: [
                    {
                        required: true,
                        message: "订单价格不能为空",
                        trigger: "blur",
                    },
                ],
            }
        }
    },
    methods: {
        getDetail() {
            orderInfo(this.dialogId).then((response) => {
                var result = response.data;
                this.saveLoading = false;
                console.log("sssss", result);
                if (result.code == 0) {
                    result.data.busType = JSON.parse(result.data.busType);
                    result.data.additionalService = JSON.parse(
                        result.data.additionalService
                    );
                    // 
                    result.data.id = this.dialogId
                    this.resultData = Object.assign({},result.data)
                    this.dataForm = Object.assign({},result.data)
                    // this.dataForm = result.data
                } else {
                    this.$message.error(response.msg);
                }
            });
        },
        //关闭弹窗
        handleClose() {
            setTimeout(() => {
                this.$emit("close");
            }, 300);
        },
        //保存
        onSave() {
            console.log(1111)
            this.$refs.editForm.validate((valid) => {
                console.log(22222)
                if (valid) {
                    // let data = {
                    //     "certificateNo": "string",
                    //     "certificateType": 0,
                    //     "contactName": "string",
                    //     "departureAddress": "string",
                    //     destinationLatitude: 43.840213,
                    //     destinationLongitude: 87.529002,
                    //     "id": 0,
                    //     "innerRemark": "string",
                    //     "orderAmount": 0,
                    //     "orderRemark": "string",

                    //     departureAddress:'string'
                        
                    // }
                    // console.log(this.resultData,data)
                    // return false


                    // result.data.id = this.dialogId
                    let obj = {
                        
                    }
                    for (const key in this.dataForm) {
                        if (Object.hasOwnProperty.call(this.dataForm, key)) {
                            const element = this.dataForm[key];
                            if(element != this.resultData[key]){
                                obj[key] = this.resultData[key]
                            }
                        }
                    }
                    obj.id = this.dialogId
                    // dataForm
                    // let data = Object.assign({},this.resultData)
                    updateOrder(obj).then(res=>{
                        this.visible = false;
                        this.$message.success("修改成功");
                        this.$emit("refreshDataList");
                    })
                }
            })
        },
        //城市地址搜索
        querySearchAsync(queryString, cb, type) {
            var indexSelect = this.cityList.findIndex(
                (item) =>
                    item.city ==
                    (type == 1
                        ? this.resultData.departureCity
                        : this.resultData.destinationCity)
            );
            var city = this.cityList[indexSelect];
            if (city.country == "中国") {
                this.seachPoiChina(queryString, city.city, cb);
            } else {
                this.seachPoiForeign(queryString, city, cb);
            }
        },
        //城市地址选择
        handleSelect(item, type) {
            var indexSelect = this.cityList.findIndex(
                (item) =>
                    item.city ==
                    (type == 1
                        ? this.resultData.departureCity
                        : this.resultData.destinationCity)
            );
            console.log(item,indexSelect,type,this.cityList)
            if (this.cityList[indexSelect].country == "中国") {
                if (!item.location.lat && !item.location.lng) {
                    this.$message.error("地址无效，请重新选择");
                    return;
                }
                if (type == 1) {
                    this.resultData.departureAddress = item.name; //出发地址 
                    this.resultData.departureLatitude = item.location.lat; //出发纬度
                    this.resultData.departureLongitude = item.location.lng; //出发经度
                } else {
                    this.resultData.destinationAddress = item.name; //目的地址 
                    this.resultData.destinationLatitude = item.location.lat; //目的纬度
                    this.resultData.destinationLongitude = item.location.lng; //目的经度
                }
            } else {
                if (!item.geometry.location.lat && !item.geometry.location.lng) {
                    this.$message.error("地址无效，请重新选择");
                    return;
                }
                if (type == 1) {
                    this.resultData.departureAddress = item.name; //出发地址 
                    this.resultData.departureLatitude = item.location.lat; //出发纬度
                    this.resultData.departureLongitude = item.location.lng; //出发经度
                } else {
                    this.resultData.destinationAddress = item.name; //目的地址 
                    this.resultData.destinationLatitude = item.geometry.location.lat; //目的纬度
                    this.resultData.destinationLongitude = item.geometry.location.lng; //目的经度
                }
            }
        },
        onChangeAirport(value, type) {
            var index = this.airportList.findIndex((item) => item.airportName == value);
            if (type == 1) {
                this.resultData.departureLatitude = this.airportList[index].latitude;
                this.resultData.departureLongitude = this.airportList[index].longitude;
            } else {
                this.resultData.destinationLatitude = this.airportList[index].latitude;
                this.resultData.destinationLongitude = this.airportList[index].longitude;
            }
        },
        visibleChange(visible, type) {
            if (visible) {
                this.$nextTick(()=>{
                     this.newAirportList = this.airportList.filter(
                         (item) => item.cityCnName == (type == 1 ? this.resultData.departureCity : this.resultData.destinationCity)
                     );
                })
                console.log("newAirportList",this.newAirportList)
            }
         },
        //获得城市
        cityCnSelect() {
            cityCnSelect().then((response) => {
                var result = response.data;
                if (result.code == 0) {
                    this.cityList = result.data;
                } else {
                    this.$message.error(response.msg);
                }
            });
        },
        //获取机场
        getAirportList() {
            airportList().then((response) => {
                var result = response.data;
                if (result.code == 0) {
                    this.airportList = result.data;
                } else {
                    this.$message.error(response.msg);
                }
            });
        },
        //poi搜索中国
        seachPoiChina(search, city, cb) {
            if (search == "") {
                cb([]);
                return;
            }
            if (!this.autoComplete) {
                this.autoComplete = new AMap.Autocomplete({
                    city,
                    citylimit: true,
                    type: "01|02|03|04|05|06|07|08|09|10|11|12|13|14|15|16|17|18|19",
                });
            }
            let autoComplete = this.autoComplete;
            // 根据关键字进行搜索
            autoComplete.search(search, function (status, result) {
                // 搜索成功时，result即是对应的匹配数据
                let results = [];
                if (result.tips) {
                    results = result.tips;
                }
                cb(results);
            });
        },
        //poi搜索国外
        seachPoiForeign(search, city, cb) {
            if (search == "") {
                cb([]);
                return;
            }
            var param = {
                countryCode: "",
                keyword: search,
                lat: 0,
                lng: 0,
            };
            if (city.lat != 0 && city.lng != 0) {
                param.lat = city.lat;
                param.lng = city.lng;
            } else {
                param.countryCode = city.countryCode;
            }
            googleMap(param).then((response) => {
                var data = response.data;
                if (data.code == 0) {
                    cb(data.data);
                } else {
                    this.$message.error(data.msg);
                }
            });
        },
    }
}
</script>

<style  scoped lang="scss">
.drawer-content {
    padding: 0px 30px;
    max-height: 85vh;
    overflow-y: scroll;
}

/deep/ .el-form-item__content {
    flex: 1;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
}
</style>
