<template>
  <div>
    <div class="statisticAnalysis">
      <el-row class="top">
        <el-col class="background" :span="12">
          <p class="_title">
            <span>活跃IP排名</span>
            <span @click="ReadMore($event)">查看更多</span>
          </p>
          <div ref="ip" class="wrapper" />
          <div class="timeWrapper">
            <timeline :years="years" @select="filterIp" />
          </div>
        </el-col>
        <el-col class="background" :span="12">
          <p class="_title">
            <span>年度活跃APT组织排名</span>
            <span @click="ReadMore">查看更多</span>
          </p>
          <div ref="apt" class="wrapper" />
          <div class="timeWrapper">
            <timeline :years="years" @select="filterApt" />
          </div>
        </el-col>
      </el-row>
      <el-row class="bottom">
        <el-col :span="12" class="background">
          <p class="_title">
            <span>活跃邮箱排名</span>
            <span @click="ReadMore($event)">查看更多</span>
          </p>
          <div ref="email" class="wrapper" />
          <div class="timeWrapper">
            <timeline :years="years" @select="filterEmail" />
          </div>
        </el-col>
        <el-col :span="12" class="background">
          <p class="_title">
            <span>年度活跃APT来源国排名</span>
            <span @click="ReadMore($event)">查看更多</span>
          </p>
          <div ref="Country" class="wrapper" />
          <div class="timeWrapper">
            <timeline :years="years" @select="filterAptCountry" />
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="readMore">
      <read-more @cancelMessage="cancel" />
    </div>
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import { getEmailRank, getAptCountryCount, getAptRank, getIPRank } from '../../api/statisticAnalysis'
import timeline from '../../components/emailManage/timeline'
import ReadMore from '../../components/emailManage/readMore'
export default {
  name: 'StatisticAnalysis',
  components: { ReadMore, timeline },
  data() {
    return {
      aptName: '',
      maps: [],
      apts: '',
      timer: null,
      years: [],
      ipChart: null,
      emailChart: null,
      reportChart: null,
      aptChart: null
    }
  },
  watch: {
  },
  mounted() {
    // dom渲染后初始化echarts
    this.ipChart = this.$echarts.init(this.$refs.ip)
    this.emailChart = this.$echarts.init(this.$refs.email)
    this.aptChart = this.$echarts.init(this.$refs.apt)
    this.aptCountryChart = this.$echarts.init(this.$refs.Country)
    const _this = this
    window.onresize = function() {
      _this.$nextTick(_this.ipChart.resize())
      _this.$nextTick(_this.emailChart.resize())
      _this.$nextTick(_this.aptChart.resize())
      _this.$nextTick(_this.aptCountryChart.resize())
    }
  },
  async created() {
    const year = new Date().getFullYear()
    for (let i = year - 4; i <= year; i++) {
      this.years.push(i)
    }
    this.getIPReport([year - 4, year])
    this.getEmailReport([year - 4, year])
    this.getAptRank([year - 4, year])
    this.getAptCountryRank([year - 4, year])
    if (this.cancelMessage) {
      this.cancel()
    }
  },
  methods: {
    filterIp(timeRange) {
      this.getIPReport(timeRange)
    },
    filterEmail(timeRange) {
      this.getEmailReport(timeRange)
    },
    filterApt(timeRange) {
      this.getAptRank(timeRange)
    },
    filterAptCountry(timeRange) {
      this.getAptCountryRank(timeRange)
    },
    goTo(item) {
      if (item.url) {
        open(item.url)
      } else {
        this.$router.push(`/detail?name=${item.name}`)
      }
    },
    // 得到 活跃Ip排名 数据
    async getIPReport(timeRange) {
      const startDate = timeRange[0].toString() + '-01-01'
      const endDate = timeRange[1].toString() + '-12-30'
      const { data } = await getIPRank(startDate, endDate, '')
      const name = []
      const value = []
      for (let j = 0; j < data.length; j++) {
        name.push(data[j].name)
        value.push(data[j].count)
      }
      const colorList = [
        '#016fff', '#06c3d8', '#57a9e2', '#7347c4', '#7364e0',
        '#e9c5c1', '#dd767a', '#e16255', '#0fb5fd', '#015b7d'
      ]
      const option = {
        label: {
          normal: {

            // 在文本中，可以对部分文本采用 rich 中定义样式。
            // 这里需要在文本中使用标记符号：
            // `{styleName|text content text content}` 标记样式名。
            // 注意，换行仍是使用 '\n'。
            formatter: [
              '{a|这段文本采用样式a}',
              '{b|这段文本采用样式b}这段用默认样式{x|这段用样式x}'
            ].join('\n'),

            rich: {
              a: {
                color: 'red',
                lineHeight: 10
              },
              b: {
                height: 40
              },
              x: {
                fontSize: 18,
                fontFamily: 'Microsoft YaHei',
                borderColor: '#449933',
                borderRadius: 4
              }
            }
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          top: '1%',
          left: '-8%',
          right: '20%',
          bottom: '-2%',
          containLabel: true
        },
        xAxis: {
          show: false
        },
        yAxis: {
          type: 'category',
          show: false,
          inverse: true,
          data: name
        },
        series: [
          {
            type: 'bar',
            itemStyle: {
              normal: {
                color: function(params) {
                  return colorList[params.dataIndex]
                },
                label: {
                  show: true,
                  position: 'right',
                  formatter: '{b} {c}',
                  textStyle: {
                    fontSize: 10,
                    color: '#C3C3C4'
                  }
                }
              }
            },
            barWidth: 15,
            data: value
          }
        ]
      }

      this.ipChart && this.ipChart.setOption(option)
    },
    // 得到 报告排名 数据
    async getAptRank(timeRange) {
      const startDate = timeRange[0].toString() + '-01-01'
      const endDate = timeRange[1].toString() + '-12-30'
      const { data } = await getAptRank(startDate, endDate)
      const name = []
      const value = []
      const colorList = [
        '#016fff', '#06c3d8', '#57a9e2', '#7347c4', '#7364e0',
        '#e9c5c1', '#dd767a', '#e16255', '#0fb5fd', '#015b7d'
      ]

      data.forEach((item, i) => {
        name.push(data[i].name)
        value.push(data[i].count)
      })

      // 指定图表的配置项和数据
      const option = {
        // 工具箱
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          top: '13%',
          bottom: '2%',
          containLabel: true
        },
        // x轴
        xAxis: {
          axisLabel: {
            interval: 0,
            textStyle: {
              color: '#c0c0c1'
            },
            formatter: function(params) {
              var newParamsName = ''// 最终拼接成的字符串
              var paramsNameNumber = params.length// 实际标签的个数
              var provideNumber = 4 // 每行能显示的字的个数
              var rowNumber = Math.ceil(paramsNameNumber / provideNumber)// 换行的话，需要显示几行，向上取整
              /**
               * 判断标签的个数是否大于规定的个数， 如果大于，则进行换行处理 如果不大于，即等于或小于，就返回原标签
               */
              // 条件等同于rowNumber>1
              if (paramsNameNumber > provideNumber) {
                /** 循环每一行,p表示行 */
                for (var p = 0; p < rowNumber; p++) {
                  var tempStr = ''// 表示每一次截取的字符串
                  var start = p * provideNumber// 开始截取的位置
                  var end = start + provideNumber// 结束截取的位置
                  // 此处特殊处理最后一行的索引值
                  if (p === rowNumber - 1) {
                    // 最后一次不换行
                    tempStr = params.substring(start, paramsNameNumber)
                  } else {
                    // 每一次拼接字符串并换行
                    tempStr = params.substring(start, end) + '\n'
                  }
                  newParamsName += tempStr// 最终拼成的字符串
                }
              } else {
                // 将旧标签的值赋给新标签
                newParamsName = params
              }
              // 将最终的字符串返回
              return newParamsName
            }
          },
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          },
          data: name
        },
        yAxis: {
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: '#2F2F54',
              width: 1,
              type: 'solid'
            }
          },
          axisLabel: {
            textStyle: {
              color: '#c0c0c1'
            }
          }
        },
        // 数据
        series: [{
          name: '报告发布数',
          type: 'bar',
          barWidth: 40,
          label: {
            show: true,
            position: 'top',
            color: '#f2f2f3',
            fontSize: 12,
            distance: 2 // 距离
          },
          data: value,
          itemStyle: {
            normal: {
              barBorderRadius: 4,
              color: function(params) {
                return colorList[params.dataIndex]
              }
            }
          }
        }]
      }
      this.aptChart && this.aptChart.setOption(option)
    },
    // 得到 活跃邮箱排名
    async getEmailReport(timeRange) {
      const startDate = timeRange[0].toString() + '-01-01'
      const endDate = timeRange[1].toString() + '-12-30'
      const { data } = await getEmailRank(startDate, endDate, '')
      const name = []
      const value = []
      for (let j = 0; j < data.length; j++) {
        name.push(data[j].name)
        value.push(data[j].count)
      }
      const colorList = [
        '#016fff', '#06c3d8', '#57a9e2', '#7347c4', '#7364e0',
        '#e9c5c1', '#dd767a', '#e16255', '#0fb5fd', '#015b7d'
      ]
      const option = {
        label: {
          normal: {

            // 在文本中，可以对部分文本采用 rich 中定义样式。
            // 这里需要在文本中使用标记符号：
            // `{styleName|text content text content}` 标记样式名。
            // 注意，换行仍是使用 '\n'。
            formatter: [
              '{a|这段文本采用样式a}',
              '{b|这段文本采用样式b}这段用默认样式{x|这段用样式x}'
            ].join('\n'),

            rich: {
              a: {
                color: 'red',
                lineHeight: 10
              },
              b: {
                height: 40
              },
              x: {
                fontSize: 18,
                fontFamily: 'Microsoft YaHei',
                borderColor: '#449933',
                borderRadius: 4
              }
            }
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          top: '1%',
          left: '-16%',
          right: '24%',
          bottom: '0',
          containLabel: true
        },
        xAxis: {
          show: false
        },
        yAxis: {
          type: 'category',
          show: false,
          inverse: true,
          data: name
        },
        series: [
          {
            type: 'bar',
            itemStyle: {
              normal: {
                color: function(params) {
                  return colorList[params.dataIndex]
                },
                label: {
                  show: true,
                  position: 'right',
                  formatter: '{b} {c}',
                  textStyle: {
                    fontSize: 10,
                    color: '#C3C3C4'
                  }
                }
              }
            },
            barWidth: 15,
            data: value
          }
        ]
      }

      this.emailChart && this.emailChart.setOption(option)
    },
    // 得到活跃Apt国家排名
    async getAptCountryRank(timeRange) {
      const startDate = timeRange[0].toString() + '-01-01'
      const endDate = timeRange[1].toString() + '-12-30'
      const { data } = await getAptCountryCount(startDate, endDate)

      const name = []
      const value = []
      const colorList = [
        '#016fff', '#06c3d8', '#57a9e2', '#7347c4', '#7364e0',
        '#e9c5c1', '#dd767a', '#e16255', '#0fb5fd', '#015b7d'
      ]
      data.forEach((item, i) => {
        name.push(data[i].name)
        value.push(data[i].count)
      })

      // 指定图表的配置项和数据
      const option = {
        // 工具箱
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          top: '13%',
          bottom: '2%',
          containLabel: true
        },
        // x轴
        xAxis: {
          axisLabel: {
            interval: 0,
            textStyle: {
              color: '#c0c0c1'
            },
            formatter: function(params) {
              var newParamsName = ''// 最终拼接成的字符串
              var paramsNameNumber = params.length// 实际标签的个数
              var provideNumber = 4// 每行能显示的字的个数
              var rowNumber = Math.ceil(paramsNameNumber / provideNumber)// 换行的话，需要显示几行，向上取整
              if (paramsNameNumber > provideNumber) {
                for (var p = 0; p < rowNumber; p++) {
                  var tempStr = ''// 表示每一次截取的字符串
                  var start = p * provideNumber// 开始截取的位置
                  var end = start + provideNumber// 结束截取的位置
                  // 此处特殊处理最后一行的索引值
                  if (p === rowNumber - 1) {
                    // 最后一次不换行
                    tempStr = params.substring(start, paramsNameNumber)
                  } else {
                    // 每一次拼接字符串并换行
                    tempStr = params.substring(start, end) + '\n'
                  }
                  newParamsName += tempStr// 最终拼成的字符串
                }
              } else {
                // 将旧标签的值赋给新标签
                newParamsName = params
              }
              // 将最终的字符串返回
              return newParamsName
            }
          },
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          },
          data: name
        },
        yAxis: {
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: '#2F2F54',
              width: 1,
              type: 'solid'
            }
          },
          axisLabel: {
            textStyle: {
              color: '#c0c0c1'
            }
          }
        },
        // 数据
        series: [{
          name: '报告发布数',
          type: 'bar',
          barWidth: 40,
          label: {
            show: true,
            position: 'top',
            color: '#f2f2f3',
            fontSize: 12,
            distance: 2 // 距离
          },
          data: value,
          itemStyle: {
            normal: {
              barBorderRadius: 4,
              color: function(params) {
                return colorList[params.dataIndex]
              }
            }
          }
        }]
      }
      this.aptCountryChart && this.aptCountryChart.setOption(option)
    },
    // 弹出生成报告的弹窗
    ReadMore(event) {
      const readMore = document.getElementsByClassName('readMore')[0]
      readMore.style.display = 'block'
      readMore.style.zIndex = '100'
      readMore.style.left = event.x * 0.5 + 'px'
      readMore.style.top = event.y * 0.5 + 'px'
    },
    cancel() {
      const readMore = document.getElementsByClassName('readMore')[0]
      readMore.style.display = 'none'
    }
  }
}
</script>

<style scoped lang="scss">
$color-background-d: #242443;
$color-border: #1D1A3B;
$color-body: #010F2A;
.f{
  float: left;
}
.statisticAnalysis{
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: $color-body;
  .top{
    width: 100%;
    height: 45%;
    border-top:10px solid $color-body;
    border-bottom: 10px solid $color-body;
    .el-col{
      height: 100%;
      &:first-child{
        border-left: 10px solid $color-body;
        border-right: 10px solid $color-body;
      }
      &:nth-child(2){
        border-right: 15px solid $color-body;
      }
    }
  }
  .bottom{
    /*border-top: 2px solid $color-border;*/
    border-bottom: 20px solid $color-body;
    width: 100%;
    height: 45%;
    box-sizing: border-box;
    .el-col{
      height: 100%;
      &:first-child{
        border-left: 10px solid $color-body;
        border-right: 10px solid $color-body;
      }
      &:nth-child(2){
        border-right: 15px solid $color-body;
      }
    }
  }
  .background{
    background: $color-background-d;
    ._title{
      /*border-bottom: 1px solid $color-border;*/
      height: 35px;
      width: 100%;
      align-items: center;
      align-content: space-between;
      color: #eee;
      justify-content: space-between;
      display: flex;
      padding: 0 20px;
      span{
        font-weight: bold;
        font-size: 14px;
      }
      span:nth-child(2){
        cursor: pointer;
        font-size: 12px;
        color: #016FFF;
      }
    }
    .wrapper{
      width: 95%;
      height: calc(50vh - 135px);
    }
    .timeWrapper{
      padding: 0 20px;
      height: 50px;
      font-size: 10px;
      color: #d5d5d5;
      margin-bottom: 5px;
    }
  }
}
.readMore{
  width: 340px;
  height: 280px;
  display: none;
  position: absolute;
  background-color: #FFFFFF;
  box-shadow: 0 2px 4px rgba(119, 119, 119, 0.9), 0 0 6px rgba(21, 21, 21, 0.9);
  z-index:99999;
}
</style>
