<template>
  <div class="getReport">
    <div class="choseApt">
      <div class="text f"><p>选择组织:</p></div>
      <div class="form f">
        <el-select
          v-model="formValue"
          filterable
          size="mini"
          :popper-append-to-body="false"
          placeholder="请选择"
          @change="selectValue"
        >
          <el-option v-for="item in stateList" :key="item.value" size="mini" :value="item.label">
            {{ item.label }}
          </el-option>
        </el-select>
      </div>
    </div>
    <div class="choseIoc">
      <div class="text f"><p>选择IOC:</p></div>
      <div class="selectBox">
        <el-table
          ref="multipleTable"
          :data="tableData"
          :row-style="{height: '2px'}"
          :cell-style="{padding: '1px 0'}"
          :show-header="false"
          highlight-current-row
          @selection-change="handleSelectionChange"
        >
          >
          <el-table-column
            type="selection"
            width="35"
          />
          <el-table-column min-width="60%">
            <template slot-scope="scope">
              <span class="label" @click="IocResource(scope.row, scope.$index)">{{ scope.row.name }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="choseTime">
      <div class="text f"><p>选择时间:</p></div>
      <div class="f timeForm">
        <el-select
          v-model="timeValue1"
          filterable
          size="mini"
          :popper-append-to-body="false"
          placeholder="请选择"
          @change="selectStartTime"
        >
          <el-option v-for="item in timeList" :key="item.value" size="mini" :value="item.time">
            {{ item.time }}
          </el-option>
        </el-select>
      </div>
      <p style="width: 10px; overflow: hidden; color: #4d4d4d">——</p>
      <div class="f timeForm">
        <el-select
          v-model="timeValue2"
          filterable
          size="mini"
          :popper-append-to-body="false"
          placeholder="请选择"
          @change="selectEndTime"
        >
          <el-option v-for="item in timeList" :key="item.value" size="mini" :value="item.time">
            {{ item.time }}
          </el-option>
        </el-select>
      </div>
      <div />
    </div>
    <div class="button">
      <el-button class="elButton" size="medium" type="primary" @click="reportData">生成报告</el-button>
      <el-button class="elButton" size="medium" @click="cancel">取消</el-button>
    </div>
  </div>
</template>

<script>
import { getReport } from '../../api/statisticAnalysis'
import { mapGetters } from 'vuex'
import { getAptList } from '../../api/ruleManage'
export default {
  name: 'ReadMore',
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  data() {
    return {
      modal_loading: false,
      questionImageIsShow: false,
      stateList: [{}],
      formValue: '',
      timeList: [],
      timeValue1: '',
      timeValue2: '',
      tableData: [{
        name: '邮箱',
        value: 'fromAdd'
      }, {
        name: 'IP',
        value: 'fromIp'
      }, {
        name: '域名',
        value: 'domains'
      }, {
        name: 'HASH',
        value: 'hash'
      }],
      rePortObject: { startDate: '', endDate: '', aptName: '', iocs: '' },
      iocs: ''
    }
  },
  mounted() {
    this.getList()
  },
  async created() {
  },
  methods: {
    handleSelectionChange(val) {
      this.iocs = val
    },
    selectValue(aptName) {
      this.rePortObject.aptName = aptName
    },
    selectStartTime(startDate) {
      this.rePortObject.startDate = startDate + '-01-01'
    },
    selectEndTime(endDate) {
      this.rePortObject.endDate = endDate + 1 + '-01-01'
    },
    IocResource(row, index) {
      this.rePortObject.iocs = row.name
      console.log('IocResource row', row.name)
    },
    cancel() {
      this.$emit('cancelMessage')
    },
    async getList() {
      const res = await getAptList({ limit: 9999, page: 1 })
      this.stateList.splice(0, 1)
      res.data.forEach((res, i) => {
        this.stateList.push({
          value: i,
          label: res.name
        })
      })
      const nowDate = new Date()
      const year = nowDate.getFullYear()
      for (let i = year; i >= (year - 4); i--) {
        const value = i - 2019
        this.timeList.push({
          value: value,
          time: i
        })
      }
    },
    async reportData() {
      let str = ''
      if (this.rePortObject.startDate === '' || this.rePortObject.endDate === '' ||
        this.rePortObject.aptName === '' || this.iocs === '') {
        alert('选项不能为空')
      } else {
        this.iocs.forEach(item => {
          str += item.value + ','
        })
        const { data } = await getReport(this.rePortObject.startDate, this.rePortObject.endDate,
          this.rePortObject.aptName, this.name, str.substring(0, str.length - 1))
        if (!window.localStorage) {
          alert('浏览器不支持localstorage')
          return false
        } else {
          const storage = window.localStorage
          // 写入a字段
          storage.setItem('reportData', JSON.stringify(data))
        }
        this.$router.push('/getReport')
      }
    }
  }
}
</script>

<style scoped lang="scss">
  $color-border: #979797;
  $dark_gray:#889aa4;
  .f{
    float: left;
  }
  .text{
    width: 30%;
    text-align: center;
    /*border: 1px solid #000000;*/
  }
  @mixin flex{
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .getReport{
    width: 85%;
    height: 85%;
    position: relative;
    margin: 20px auto;
    /*border: 1px solid #00ff00;*/
    .choseApt{
      width: 100%;
      height: 40px;
      @include flex;
      /*border: 1px solid #000000;*/
      .form{
        width: 70%;
        height: 35px;
        /* border: 1px solid #00ff00;*/
        el-select{
          border: 1px solid #965DE0;
        }
        .el-select .el-input__inner {
          width: 360px;
          border: 1px solid #965DE0;
        }
      }
    }
    .choseIoc{
      width: 100%;
      height: 100px;
      /*border: 1px solid #000000;*/
      @include flex;
      .selectBox{
        width: 70%;
        height: 80%;
        overflow: auto;
        border: 1px solid #dfdfdf;
      }
    }
    .choseTime{
      width: 100%;
      height: 55px;
      /*border: 1px solid #000000;*/
      @include flex;
      .timeForm{
        width: 90px;
        height: 30px;
      }
    }
    .button{
      width: 100%;
      height: 40px;
      padding: 10px;
      @include flex;
      /*border: 1px solid #000000;*/
      .elButton{
        width: 110px;
        border-radius: 5px;
        &:first-child{
          background-color: #15a0cb;
        }
        &:nth-child(2){
          border: 1px solid #979797;
        }
      }
    }
  }
</style>
