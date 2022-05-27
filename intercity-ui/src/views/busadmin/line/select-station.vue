<template>
  <el-dialog
    title="站点选择"
    :close-on-click-modal="false"
    append-to-body
    :visible.sync="visible"
  >
    <div class="filter-container" style="display: flex; justify-content: end">
      <el-select v-model="searchForm.city" v-if="propsData.fromCity != propsData.toCity">
      <!-- <el-select v-model="searchForm.city" > -->
        <el-option value="" label="全部城市"></el-option>
        <el-option :value="propsData.fromCity" :label="propsData.fromCity | codeFil"></el-option>
        <el-option :value="propsData.toCity" :label="propsData.toCity | codeFil"></el-option>
      </el-select>
      <el-input
        v-model="searchForm.siteName"
        placeholder="站点名称"
        style="width: 140px"
        class="filter-item"
      />
      <!-- <el-button
        type="primary"
        class="filter-item"
        icon="el-icon-search"
        @click="currentChangeHandle(1)"
        >搜索</el-button
      > -->
    </div>
    <div class="avue-crud">
      <el-table
        :data="newDataList"
        border
        v-loading="dataListLoading"
        @selection-change="handleSelectionChange"
        row-key="id"
        ref="buyerTable"
        height="500px"
      >
        <el-table-column type="selection" width="55" reserve-selection> </el-table-column>
        <el-table-column
          prop="siteName"
          header-align="center"
          align="center"
          label="站点名称"
        >
        </el-table-column>
        <el-table-column
          prop="stationType"
          header-align="center"
          align="center"
          label="站点类型"
        >
          <template slot-scope="scope">
            {{ scope.row.stationType | stationTypeFil }}
          </template>
        </el-table-column>

        <el-table-column
          prop="stationShape"
          header-align="center"
          align="center"
          label="站点形状"
        >
          <template slot-scope="scope">
            {{ scope.row.stationShape | stationShapeFil }}
          </template>
        </el-table-column>

        <el-table-column
          prop="city"
          header-align="center"
          align="center"
          label="所属城市"
        >
          <template slot-scope="scope">
            {{ scope.row.city | codeFil }}<template v-if="scope.row.town"> - {{ scope.row.town | codeFil }}</template>
          </template>
        </el-table-column>
        <el-table-column
          prop="type"
          header-align="center"
          align="center"
          label="上下站点"
        >
          <template slot-scope="scope">
            <el-select v-model="scope.row.type" :disabled="operationsMode == 1 || operationsMode == 4">
              <el-option :value="1" label="上车点"></el-option>
              <el-option :value="2" label="下车点"></el-option>
            </el-select>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top:10px;">
        已选择{{multipleSelection.length}}个站点
      </div>
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button @click="clearSelection()">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()" :disabled="disabled" v-if="canSubmit"
        >确定</el-button
      >
    </span>
  </el-dialog>
</template>

<script>
import { queryList } from "@/api/station";
import { code } from "@/util/adcode";

export default {
  data() {
    return {
      visible: false,
      canSubmit: false,
      dataList: [],
      driverList: [],
      pageIndex: 1,
      pageSize: 999999,
      totalPage: 0,
      searchForm: {
        siteName: "",
        city:''
      },
      listKey:{
        siteName: "",
        cityIds:'',
        stationShape:undefined,
      },
      dataListLoading: false,
      multipleSelection: [],
      stationList: [],
      operationsMode:0,
      disabled:false,
      propsData:{

      }
    };
  },
  computed:{
    newDataList(){
      let arr = []
      this.dataList.forEach(element=>{
        let num = 0
        console.log(element.siteName.indexOf(this.searchForm.siteName),this.searchForm.city , element.city)
        if(element.siteName.indexOf(this.searchForm.siteName) != -1 ){
          num ++
        }
        if(!this.searchForm.city || this.searchForm.city == element.city){
          num ++
        }
        if(num == 2) arr.push(element)
      })
      return arr
    },
  },
  filters: {
    stationTypeFil(val) {
      let map = {
        0: "其它",
        1: "火车站",
        2: "景区",
        3: "医院",
        4: "机场",
        5: "行政区",
        6: "学校",
        7: "汽车站",
        8: "社区",
        9: "综合体",
      };
      return map[val];
    },
    stationShapeFil(val) {
      let map = {
        1: "站点",
        2: "区域",
      };
      return map[val];
    },
    codeFil(val) {
      return code[val];
    },
  },
  methods: {
    init(data) {
      this.propsData = data
      this.searchForm.city = ''
      this.visible = true;
      this.canSubmit = true;
      this.disabled = false
      this.stationList = data.stationList;
      this.operationsMode = data.operationsMode
      this.listKey.stationShape = `${data.stationShape}`
      this.listKey.cityIds = data.fromCity ===data.toCity ? `${data.toCity}` : `${data.fromCity},${data.toCity}`
      this.$nextTick(() => {
        this.getDataList();
      });
    },
    // 表单提交
    dataFormSubmit() {
      console.log(this.disabled)
      if(this.disabled) return false
      console.log(this.dataList,3333)
      if (!this.multipleSelection.length) {
        return this.$message.error("至少选择一个站点");
      }
      this.disabled = true
      let driverStatus = false;
      let arr = [];
      this.multipleSelection.forEach((element) => {
        
        arr.push({
          ...element,
          status: "create",
          stationId: element.id,
          id: 0,
        });
        if (!element.type) driverStatus = true;
      });
      if (driverStatus) {
        this.disabled = false
        return this.$message.error("请选择上下站点的属性信息");
      }
      this.clearSelection()
      this.$emit("select", arr);
      setTimeout(()=>{
        this.disabled = false
      },700)

    },
    clearSelection(){
      this.visible = false;
      this.$refs.buyerTable.clearSelection()
    },
    // 当前页
    currentChangeHandle(val) {
      this.pageIndex = val;
      this.getDataList();
    },
    // 获取数据列表
    getDataList() {
      this.dataListLoading = true;
      queryList(
        Object.assign({
          ...this.listKey,
        })
      ).then((response) => {
        let arr = [];
        response.data.data.forEach((element) => {
          var flag = this.stationList.some((item) => item.stationId === element.id);
          if (!flag) {
            let obj = {
              ...element,
              type: '',
              runtime:'0',
              distance:'0',
            }
            if(this.operationsMode === 1) {
              obj.type = obj.stationShape === 1 ? 1 : 2
            }else if(this.operationsMode === 4){
              obj.type = obj.stationShape === 1 ? 2 : 1

            }
            arr.push(obj)
          }
        });
        this.dataList = arr;
      });
      this.dataListLoading = false;
    },

    handleSelectionChange(val) {
      this.multipleSelection = val;
      console.log(val, 33333);
    },
  },
};
</script>
