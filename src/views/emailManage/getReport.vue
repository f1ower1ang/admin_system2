<template>
  <div>
    <div id="pdfDom" ref="print" class="results">
      <div class="title"><div class="top"><div class="box f" /><div class="text f">生成报告</div></div><p>{{ title }}</p></div>
      <div class="content" style="width: 75%; margin: 0 auto">
        <div class="introduction center">
          <div class="introLeft f"><span>组织简介</span></div>
          <div class="introRight f">
            <p>
              {{ summary }}
            </p>
          </div>
        </div>
        <div class="dataView center">
          <div class="dataVLeft f"><span>数据总览</span></div>
          <div class="dataVRight f">
            <table>
              <tr>
                <td><p>发件箱</p><p>{{ statisticData.fromAddCount }}</p></td>
                <td><p>发件IP</p><p>{{ statisticData.fromIpCount }}</p></td>
                <td><p>恶意域名</p><p>{{ statisticData.domainsCount }}</p></td>
                <td><p>样本</p><p>{{ statisticData.hashCount }}</p></td>
              </tr>
              <tr>
                <td><p>受害邮箱</p><p>{{ statisticData.toAddCount }}</p></td>
                <td><p>受害单位</p><p>{{ statisticData.organizationCount }}</p></td>
                <td><p>受害省份</p><p>{{ statisticData.provinceCount }}</p></td>
                <td><p>邮箱总数</p><p>{{ statisticData.emailCount }}</p></td>
              </tr>
            </table>
          </div>
        </div>
        <div class="Ioc center">
          <div class="IocLeft"><span>IOC资源</span></div>
          <div class="IocRight">
            <div class="background email">
              <p class="_title">
                <span>活跃邮箱排名</span>
              </p>
              <div ref="emailRank" class="chart" />
            </div>
            <div class="background domain">
              <p class="_title">
                <span>活跃域名排名</span>
              </p>
              <div ref="domainRank" class="chart" />
            </div>
            <div class="background ip">
              <p class="_title">
                <span>活跃IP排名</span>
              </p>
              <div ref="ipRank" class="chart" />
            </div>
            <div class="background hash">
              <p class="_title">
                <span>活跃hash排名</span>
              </p>
              <div ref="hash" class="chart" />
            </div>
          </div>
        </div>
        <div class="victimTarget center">
          <div class="victimLeft"><span>受害目标</span></div>
          <div class="victimRight">
            <div id="map" class="map" />
            <div class="background organization">
              <p class="_title">
                <span>受害单位排名</span>
              </p>
              <div ref="organization" class="chart" />
            </div>
            <div class="background victimEmail">
              <p class="_title">
                <span>受害邮箱排名</span>
              </p>
              <div ref="email" class="chart" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="content" style="width: 75%; margin: 0 auto">
      <div class="operate center no-print">
        <div class="operateLeft"><span>操作</span></div>
        <div class="operateRight center">
          <div class="button">
            <el-button class="elButton" size="medium" type="primary" @click="printTest">打印</el-button>
            <el-button class="elButton" size="medium" @click="getPdf()">生成PDF</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GetReport',
  data() {
    return {
      title: '',
      summary: '',
      statisticData: { aptCount: '', domainsCount: '', emailCount: '', fromAddCount: '', fromIpCount: '', hashCount: '', organizationCount: '', provinceCount: '', ruleCount: '', sourceCount: '', toAddCount: '', traceCount: '' },
      timer: null,
      years: [],
      ipChart: null,
      reportChart: null,
      aptChart: null,
      emailChart: null,
      domainChart: null,
      hashChart: null,
      OrganizationChart: null,
      getEmailChart: null,
      startDate: '',
      endDate: '',
      aptName: '',
      timeRangeInit: [],
      htmlTitle: '',
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
      getReportData: '',
      flag: 0,
      iocFlag: 0
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    printTest() {
      this.$print(this.$refs.print, { 'no-print': '.no-print' })
    },
    filterEmail(timeRange) {
      this.getEmailReport(timeRange)
    },
    async getData() {
      const storage = window.localStorage
      const reportData = JSON.parse(storage.getItem('reportData'))
      this.getReportData = reportData
      this.title = reportData.name // APT报告的名字
      this.htmlTitle = reportData.name
      this.summary = reportData.apts.summary
      this.startDate = reportData.startDate.substring(0, 10) // 起始时间
      this.endDate = reportData.endDate.substring(0, 10) // 结束时间
      this.aptName = reportData.aptName // apt名字
      this.statisticData = reportData.statistics
      this.ipChart = this.$echarts.init(this.$refs.ipRank)
      this.emailChart = this.$echarts.init(this.$refs.emailRank)
      this.domainChart = this.$echarts.init(this.$refs.domainRank)
      this.hashChart = this.$echarts.init(this.$refs.hash)
      this.OrganizationChart = this.$echarts.init(this.$refs.organization)
      this.getEmailChart = this.$echarts.init(this.$refs.email)
      this.$nextTick(() => {
        this.getMap()
        if (this.flag === 3) {
          const victimTarget = document.getElementsByClassName('victimRight')[0]
          victimTarget.style.height = '50px'
        }
        if (this.iocFlag === 4) {
          const victimTarget = document.getElementsByClassName('IocRight')[0]
          victimTarget.style.height = '50px'
        }
      })
      this.backTime()
    },
    backTime() {
      this.getIPReport()
      this.getEmailReport()
      this.getDomain()
      this.getHash()
      this.getOrganization()
      this.getEmail()
    },
    // 得到 活跃邮箱排名
    async getEmailReport() {
      const data = this.getReportData.countRankByFromAdd
      const name = []
      const value = []
      if (data.length === 0) {
        const email = document.getElementsByClassName('email')[0]
        email.style.display = 'none'
        this.iocFlag += 1
      } else {
        for (let j = 0; j < data.length; j++) {
          name.push(data[j].name.substring(0, 100))
          value.push(data[j].count)
        }
      }
      const colorList = [
        '#016fff', '#06c3d8', '#57a9e2', '#7347c4', '#7364e0',
        '#e9c5c1', '#dd767a', '#e16255', '#0fb5fd', '#015b7d'
      ]
      const option = {
        label: this.label,
        tooltip: this.tooltip,
        grid: {
          top: '1%',
          left: '-15%',
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
                    color: '#919192'
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
    // 活跃Ip排名
    async getIPReport() {
      const data = this.getReportData.countRankByFromIp
      const name = []
      const value = []
      if (data.length === 0) {
        const ip = document.getElementsByClassName('ip')[0]
        ip.style.display = 'none'
        this.iocFlag += 1
      } else {
        for (let j = 0; j < data.length; j++) {
          name.push(data[j].name.substring(0, 100))
          value.push(data[j].count)
        }
      }
      const colorList = [
        '#016fff', '#06c3d8', '#57a9e2', '#7347c4', '#7364e0',
        '#e9c5c1', '#dd767a', '#e16255', '#0fb5fd', '#015b7d'
      ]
      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          top: '1%',
          left: '-9%',
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
                    color: '#919192'
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
    // 活跃域名排名
    async getDomain() {
      const data = this.getReportData.countRankByDomains
      const name = []
      const value = []
      if (data.length === 0) {
        const domain = document.getElementsByClassName('domain')[0]
        domain.style.display = 'none'
        this.iocFlag += 1
      } else {
        for (let j = 0; j < data.length; j++) {
          name.push(data[j].name.substring(0, 100))
          value.push(data[j].count)
        }
      }
      const showName = []
      for (const i in name) {
        if (name[i].length > 20) {
          const str = name[i].substring(0, 20) + '...'
          showName[i] = (str)
        } else {
          showName[i] = name[i]
        }
      }
      const colorList = [
        '#016fff', '#06c3d8', '#57a9e2', '#7347c4', '#7364e0',
        '#e9c5c1', '#dd767a', '#e16255', '#0fb5fd', '#015b7d'
      ]
      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          formatter: function(params) {
            if (name[params[0].dataIndex].length > 40) {
              let i = 0
              let nameStr = ''
              while (i < name[params[0].dataIndex].length) {
                nameStr += name[params[0].dataIndex].substring(i, i + 40) + '<br>'
                i += 40
              }
              return nameStr
            } else {
              return name[params[0].dataIndex]
            }
          }
        },
        grid: {
          top: '1%',
          left: '-14%',
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
          data: showName
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
                  formatter: function(params) {
                    return params.name.substring(0, 10) + ' ' + params.value
                  },
                  textStyle: {
                    fontSize: 10,
                    color: '#919192'
                  }
                }
              }
            },
            barWidth: 15,
            data: value
          }
        ]
      }
      this.domainChart && this.domainChart.setOption(option)
    },
    async getHash() {
      const data = this.getReportData.countRankByHash
      const name = []
      const value = []
      if (data.length === 0) {
        const hash = document.getElementsByClassName('hash')[0]
        hash.style.display = 'none'
        this.iocFlag += 1
      } else {
        for (let j = 0; j < data.length; j++) {
          name.push(data[j].name.substring(0, 100))
          value.push(data[j].count)
        }
      }
      const colorList = [
        '#016fff', '#06c3d8', '#57a9e2', '#7347c4', '#7364e0',
        '#e9c5c1', '#dd767a', '#e16255', '#0fb5fd', '#015b7d'
      ]
      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          formatter: function(params) {
            if (name[params[0].dataIndex].length > 20) {
              let i = 0
              let nameStr = ''
              while (i < name[params[0].dataIndex].length) {
                nameStr += name[params[0].dataIndex].substring(i, i + 20) + '<br>'
                i += 20
              }
              return nameStr
            } else {
              return name[params[0].dataIndex]
            }
          }
        },
        grid: {
          top: '1%',
          left: '-27%',
          right: '44%',
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
                    color: '#919192'
                  }
                }
              }
            },
            barWidth: 15,
            data: value
          }
        ]
      }
      this.hashChart && this.hashChart.setOption(option)
    },
    async getOrganization() {
      const data = this.getReportData.countRankByOrganization
      const name = []
      const value = []
      if (data.length === 0) {
        const organization = document.getElementsByClassName('organization')[0]
        organization.style.display = 'none'
        this.flag += 1
      } else {
        for (let j = 0; j < data.length; j++) {
          name.push(data[j].name.substring(0, 100))
          value.push(data[j].count)
        }
      }
      const colorList = [
        '#016fff', '#06c3d8', '#57a9e2', '#7347c4', '#7364e0',
        '#e9c5c1', '#dd767a', '#e16255', '#0fb5fd', '#015b7d'
      ]
      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          top: '1%',
          left: '-3%',
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
                    color: '#919192'
                  }
                }
              }
            },
            barWidth: 15,
            data: value
          }
        ]
      }
      this.OrganizationChart && this.OrganizationChart.setOption(option)
    },
    // 受害邮箱排名
    async getEmail() {
      const data = this.getReportData.countRankByToAdd
      const name = []
      const value = []
      if (data.length === 0) {
        const victimEmail = document.getElementsByClassName('victimEmail')[0]
        victimEmail.style.display = 'none'
        this.flag += 1
      } else {
        for (let j = 0; j < data.length; j++) {
          name.push(data[j].name.substring(0, 100))
          value.push(data[j].count)
        }
      }
      const colorList = [
        '#016fff', '#06c3d8', '#57a9e2', '#7347c4', '#7364e0',
        '#e9c5c1', '#dd767a', '#e16255', '#0fb5fd', '#015b7d'
      ]
      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          top: '1%',
          left: '-14%',
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
                    color: '#919192'
                  }
                }
              }
            },
            barWidth: 15,
            data: value
          }
        ]
      }
      this.getEmailChart && this.getEmailChart.setOption(option)
    },
    async getMap() {
      const data = this.getReportData.countRankByProvince
      const mapData = []
      if (data.length === 0) {
        const map = document.getElementsByClassName('map')[0]
        map.style.display = 'none'
        this.flag += 1
      } else {
        for (const i in data) {
          mapData.push({
            name: data[i].name,
            value: data[i].count
          })
        }
      }
      var mapName = 'china'
      var geoCoordMap = {}
      // 获取地图数据
      const myChart = this.$echarts.init(document.getElementById('map'))
      // myChart.showLoading();
      var mapFeatures = this.$echarts.getMap(mapName).geoJson.features
      // myChart.hideLoading();
      mapFeatures.forEach(function(v) {
        // 地区名称
        var name = v.properties.name
        // 地区经纬度
        geoCoordMap[name] = v.properties.cp
      })
      var max = 480
      var min = 9
      var maxSize4Pin = 100
      var minSize4Pin = 20

      var convertData = function(mapData) {
        var res = []
        for (var i = 0; i < mapData.length; i++) {
          var geoCoord = geoCoordMap[mapData[i].name]
          if (geoCoord) {
            res.push({
              name: mapData[i].name,
              value: geoCoord.concat(mapData[i].value)
            })
          }
        }
        return res
      }
      var option = {
        tooltip: {
          trigger: 'item',
          formatter: function(params) {
            if (params.data === undefined) {
              return params.name
            }
            if (params.data.name === undefined || params.data.value[2] === undefined) {
              return params.data.name
            } else {
              return '<div style="padding: 10px">' + params.data.name + '<br/>' + 'count : ' + params.data.value[2] + '</div>'
            }
          }
        },
        visualMap: {
          show: false,
          min: 0,
          max: 400,
          left: 400,
          bottom: 200,
          text: ['高', '低'], // 文本，默认为数值文本
          calculable: true,
          seriesIndex: [1],
          inRange: {
            // color: ['#3B5077', '#031525'] // 蓝黑
            // color: ['#ffc0cb', '#800080'] // 红紫
            // color: ['#3C3B3F', '#605C3C'] // 黑绿
            // color: ['#0f0c29', '#302b63', '#24243e'] // 黑紫黑
            // color: ['#23074d', '#cc5333'] // 紫红
            // color: ["#00467F", "#A5CC82"] // 蓝绿
            color: ['#DAFCFE', '#A5D5F3', '#86BFED',
              '#77a5c9', '#4D94E1', '#0B7E9E'] // 浅蓝
            // color: ['#00467F', '#A5CC82'] // 蓝绿
            // color: ['#00467F', '#A5CC82'] // 蓝绿
            // color: ['#00467F', '#A5CC82'] // 蓝绿
            // color: ['#00467F', '#A5CC82'] // 蓝绿
          }
        },
        geo: {
          show: true,
          map: mapName,
          label: {
            normal: {
              show: false
            },
            emphasis: {
              show: false
            }
          },
          roam: true,
          itemStyle: {
            normal: {
              areaColor: '#e5fdff',
              borderColor: '#344668'
            },
            emphasis: {
              areaColor: '#2B91B7'
            }
          }
        },
        series: [
          {
            name: '散点',
            type: 'scatter',
            coordinateSystem: 'geo',
            data: convertData(mapData),
            symbolSize: function(val) {
              return val[2] / 100
            },
            label: {
              normal: {
                formatter: '{b}',
                position: 'right',
                show: true
              },
              emphasis: {
                show: true
              }
            },
            itemStyle: {
              normal: {
                color: '#8a6c5f'
              }
            }
          },
          {
            type: 'map',
            map: mapName,
            geoIndex: 0,
            aspectScale: 0.75, // 长宽比
            showLegendSymbol: false, // 存在legend时显示
            label: {
              normal: {
                show: true
              },
              emphasis: {
                show: false,
                textStyle: {
                  color: '#fff'
                }
              }
            },
            roam: true,
            itemStyle: {
              normal: {
                areaColor: '#17897a',
                borderColor: '#3B5077'
              },
              emphasis: {
                areaColor: '#2B91B7'
              }
            },
            animation: false,
            data: mapData
          },
          {
            name: '点',
            type: 'scatter',
            coordinateSystem: 'geo',
            symbol: 'pin', // 气泡
            symbolSize: function(val) {
              var a = (maxSize4Pin - minSize4Pin) / (max - min)
              var b = minSize4Pin - a * min
              b = maxSize4Pin - a * max
              return a * val[2] + b + 10
            },
            label: {
              normal: {
                formatter: function(params) {
                  return params.value[2]
                },
                show: true,
                textStyle: {
                  color: '#ffffff',
                  fontSize: 10
                }
              }
            },
            itemStyle: {
              normal: {
                color: '#F60306' // 标志颜色
              }
            },
            /* zlevel: 6,*/
            data: convertData(mapData)
          }
        ]
      }
      myChart.setOption(option)
    }
  }
}
</script>

<style scoped lang="scss">
  @import "../../styles/variables";
  $color-background-d: #242443;
  $color-border: #979797;
  $color-font: #343434;
  @mixin border{
    border: {
      left:1px solid $color-border;
      bottom: 1px solid $color-border;
      right: 1px solid $color-border;
    }
  }
  @mixin chart{
    .background{
      width: 90%;
      height: 240px;
      display: block;
      margin: 40px auto 20px;
      border:1px solid #eeeeee;
      box-shadow: 0 2px 4px rgba(236, 236, 236, 0.12);
      ._title{
        /*border-bottom: 1px solid $color-border;*/
        height: 35px;
        width: 100%;
        align-items: center;
        align-content: space-between;
        color: #090909;
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
      .chart{
        width: 100%;
        height: 200px;
      }
    }
  }
  @mixin left{
    width: 20%;
    text-align: center;
    color: rgb(57, 57, 57);
    &:nth-of-type(1){
      font-weight: bold;
    }
  }
  @mixin right{
    width: 80%;
  }
  .center {
    display: flex;
    align-items:center;
    display: -webkit-flex;
  }
  .f{
    float: left;
  }
  .title {
    width: 100%;
    height: 100px;
    .top{
      width: 100%;
      height: 34px;
      padding: 18px;
      .box {
        width: 5px;
        height: 13px;
        background-color:  #197FEC;
      }
      .text {
        width: 200px;
        height: 34px;
        font-size: 14px;
        font-weight: bold;
        margin-left: 10px;
      }
    }
    p{
      text-align: center;
      font-size: $font-size-large-s;
      font-weight: 600;
      padding: 10px;
      margin-top: 20px;
      color: $color-font;
    }
  }
  .introduction{
    width: 100%;
    height: auto;
    margin-top: 20px;
    border: 1px solid $color-border;
    .introLeft{
      @include left;
    }
    .introRight{
      @include right;
      border-left: 1px solid $color-border;
      padding: 2px;
      p{
        margin: 20px;
        font-size: $font-size-medium-s;
        line-height: 20px;
      }
    }
  }
  .dataView{
    width: 100%;
    height: 130px;
    @include border;
    .dataVLeft{
      @include left;
    }
    .dataVRight{
      @include right;
      height: 100%;
      border-left: 1px solid $color-border;
      tr{
        width: 100%;
        height: 45px;
        td{
          width: 200px;
          text-align: center;
          padding: 10px;
          p:nth-child(1)
          {
            color: $color-pl;
            padding-top: 3px;
            font-size: $font-size-medium-s;
          }
          p:nth-child(2)
          {
            padding: 8px;
            font-weight: 500;
            color: $color-font;
            font-size: $font-size-medium;
          }
        }
      }
    }
  }
  .Ioc {
    width: 100%;
    @include border;
    .IocLeft{
      @include left;
    }
    .IocRight{
      @include right;
      border-left: 1px solid $color-border;
      @include chart;
    }
  }
  .victimTarget{
    width: 100%;
    @include border;
    .victimLeft{
      @include left;
    }
    .victimRight{
      @include right;
      border-left: 1px solid $color-border;
      .map{
        width: 90%;
        height: 300px;
        margin: 40px auto 20px;
        background-color: #FCF9FC;
        /* border: 1px solid #000000;*/
      }
      @include chart;
    }
  }
  .operate{
    width: 100%;
    height: 80px;
    @include border;
    margin-bottom: 20px;
    .operateLeft{
      @include left;
    }
    .operateRight{
      @include right;
      height: 80px;
      border-left: 1px solid $color-border;
      .button{
        width: 90%;
        margin: 20px auto;
        .elButton{
          width: 140px;
          height: 40px;
          border: none;
          border-radius: 6px;
          &:nth-of-type(1) {
            background-color: #169bd5
          }
          &:nth-of-type(2) {
            border: 1px solid $color-border;
            margin-left: 50px;
          }
        }
      }
    }
  }
</style>
