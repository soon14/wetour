<template>
  <div class="mod-config">
    <basic-container>
      <div class="filter-container">
        
        <el-input
          v-model="searchForm.mobile"
          placeholder="手机号"
          style="width: 140px"
          class="filter-item"
          maxlength="11"
        />
        <el-button
          type="primary"
          class="filter-item"
          icon="el-icon-search"
          @click="currentChangeHandle(1)"
          >搜索</el-button
        >
        <el-button
          class="filter-item"
          @click="resetForm"
          >重置</el-button
        >
      </div>

      <div class="avue-crud">
        <el-table :data="dataList" border v-loading="dataListLoading">
          <el-table-column
            prop="id"
            header-align="center"
            align="center"
            label="序号"
          >
          </el-table-column>
          <el-table-column
            prop="mobile"
            header-align="center"
            align="center"
            label="手机号"
          >
          </el-table-column>
          
            
          <el-table-column
            prop="content"
            header-align="center"
            align="center"
            label="短信内容"
            show-overflow-tooltip	

          >
          </el-table-column>
         
         <el-table-column
            prop="createTime"
            header-align="center"
            align="center"
            label="发送时间"
            show-overflow-tooltip	

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
    </basic-container>
  </div>
</template>

<script>
import { fetchList } from "@/api/busadmin/mobile";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      dataForm: {
        key: "",
        
      },
      searchForm: {
        mobile:"",
        client: "intercity",
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
    };
  },
  filters:{
    
  },
  components: {
    // TableForm,
  },
  created() {
    this.getDataList();
  },
  computed: {
    ...mapGetters(["permissions"]),
  },
  methods: {
    resetForm(){
      this.searchForm = {
        mobile:"",
      }
    },
    // 获取数据列表
    getDataList() {
      this.dataListLoading = true;
      fetchList(
        Object.assign({
          current: this.pageIndex,
          size: this.pageSize,
          ...this.searchForm,
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
 
  },
};
</script>
