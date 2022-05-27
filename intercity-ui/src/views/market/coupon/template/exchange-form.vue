<template>
  <el-drawer
    title="兑换"
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
        <div class="filter-container">
          <el-select
            v-model="searchForm.exchangeKeyStatus"
            style="width: 180px"
            class="filter-item"
            filterable
            multiple
            placeholder="全部"
            clearable
          >
            <el-option :value="1" label="是" />
            <el-option :value="0" label="否" />
          </el-select>

          
          
          <el-button
            type="primary"
            class="filter-item"
            icon="el-icon-search"
            @click="currentChangeHandle(1)"
            >搜索</el-button
          >
          <!-- <el-button
            class="filter-item"
            @click="resetForm"
            >重置</el-button
          > -->
          
          <el-button
              v-if="permissions.webus_market_exchangekey_export"
              icon="el-icon-download"
              type="primary"
              plain
              class="filter-item"
              @click="exportExcel()"
              >下载</el-button
            >
            
        </div>

        <div class="avue-crud">
          <el-table :data="dataList" border v-loading="dataListLoading">
            <el-table-column
              prop="exchangeKey"
              header-align="center"
              align="center"
              label="兑换码"
            >
            </el-table-column>
            <el-table-column
              prop="exchangeKeyStatusShow"
              header-align="center"
              align="center"
              label="是否使用"
            >
            </el-table-column>
          </el-table>
        </div>
        <div class="avue-crud__pagination">
        <el-pagination
          @size-change="sizeChangeHandle"
          @current-change="currentChangeHandle"
          :current-page="pageIndex"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          :total="totalPage"
          background
          layout="total, sizes, prev, pager, next, jumper"
        >
        </el-pagination>
      </div>
      </div>
    </el-scrollbar>
  </el-drawer>
</template>

<script>
import { getCouponexchangekey } from "@/api/market/template";
import { mapGetters } from "vuex";
import moment from "moment"
import { parseTime } from '@/util/common.js'
export default {
  components:{

  },
  data() {
    return {
      searchForm:{
        exchangeKeyStatus:[1,0],
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading:false,

    }
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
    ...mapGetters(["permissions"]),
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
  methods:{
    handleClose() {
      setTimeout(() => {
        this.$emit("close");
      }, 300);
      
    },
    // 获取数据列表
    getDataList() {
      this.dataListLoading = true;
      // if (this.cartTime.length) {
      //   this.searchForm.startTime = this.cartTime[0] + " 00:00:00";
      //   this.searchForm.endTime = this.cartTime[1] + " 23:59:59";
      // } else {
      //   this.searchForm.startTime = undefined;
      //   this.searchForm.endTime = undefined;
      // }
      let searchForm  = Object.assign({},this.searchForm)
      getCouponexchangekey(
        Object.assign({
          current: this.pageIndex,
          size: this.pageSize,
          templateId:this.dialogData.id,
          ...searchForm,
        })
      ).then((response) => {
        this.dataList = response.data.data.records;
        this.totalPage = response.data.data.total;
      });
      this.dataListLoading = false;
    },
    // 每页数
    sizeChangeHandle(val) {
      this.pageSize = val;
      this.pageIndex = 1;
      this.getDataList();
    },
    // 当前页
    currentChangeHandle(val) {
      this.pageIndex = val;
      this.getDataList();
    },
    //  导出excel
    exportExcel() {
      this.downBlobFile("/webusmarket/admin/couponexchangekey/export", {...this.searchForm,templateId:this.dialogData.id}, "兑换码"+parseTime(new Date(),'{y}{m}{d}{h}{i}{s}')+".xlsx");
    },
  },
  mounted(){
    this.getDataList()
  },
}
</script>
<style lang="scss" scoped>
.mb20{
  margin-bottom:20px;
}
</style>