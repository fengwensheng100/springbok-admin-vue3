<template>
  <div class="statistics">
    <el-row :gutter="20">
      <el-col :span="4">
        <div>
          <el-card shadow="hover">
            <div class="el-statistic">
              <el-row>
                <el-col :span="18">
                  <div class="head">
                    <span class="title">订单数</span>
                  </div>
                  <div class="con">
                    <span class="number">{{ form.orderCount }}</span>
                  </div>
                </el-col>
                <el-col :span="6">
                  <div style="font-size: 10px">
                    <DataAnalysis />
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-card>
        </div>
      </el-col>
      <el-col :span="4">
        <div>
          <el-card shadow="hover">
            <div class="el-statistic">
              <el-row>
                <el-col :span="18">
                  <div class="head">
                    <span class="title">订单金额</span>
                  </div>
                  <div class="con">
                    <span class="number">¥{{ form.orderAmount }}</span>
                  </div>
                </el-col>
                <el-col :span="6">
                  <div style="font-size: 10px">
                    <Money />
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-card>
        </div>
      </el-col>
      <el-col :span="4">
        <div>
          <el-card shadow="hover">
            <div class="el-statistic">
              <el-row>
                <el-col :span="18">
                  <div class="head">
                    <span class="title">客单价</span>
                  </div>
                  <div class="con">
                    <span class="number"
                      >¥{{
                        (form.orderAmount / form.orderCount).toFixed(2)
                      }}</span
                    >
                  </div>
                </el-col>
                <el-col :span="6">
                  <div style="font-size: 10px">
                    <Coin />
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-card>
        </div>
      </el-col>
      <el-col :span="4">
        <div>
          <el-card shadow="hover">
            <div class="el-statistic">
              <el-row>
                <el-col :span="18">
                  <div class="head">
                    <span class="title">待发货</span>
                  </div>
                  <div class="con">
                    <span class="number">{{ form.waitingDeliverCount }}</span>
                  </div>
                </el-col>
                <el-col :span="6">
                  <div style="font-size: 10px">
                    <Van />
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-card>
        </div>
      </el-col>
      <el-col :span="4">
        <div>
          <el-card shadow="hover">
            <div class="el-statistic">
              <el-row>
                <el-col :span="18">
                  <div class="head">
                    <span class="title">商品数</span>
                  </div>
                  <div class="con">
                    <span class="number">{{ form.itemSaleCount }}</span>
                  </div>
                </el-col>
                <el-col :span="6">
                  <div style="font-size: 10px">
                    <Goods />
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-card>
        </div>
      </el-col>
      <el-col :span="4">
        <div>
          <el-card shadow="hover">
            <div class="el-statistic">
              <el-row>
                <el-col :span="18">
                  <div class="head">
                    <span class="title">会员数</span>
                  </div>
                  <div class="con">
                    <span class="number">{{ form.memberCount }}</span>
                  </div>
                </el-col>
                <el-col :span="6">
                  <div style="font-size: 10px">
                    <User />
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-card>
        </div>
      </el-col>
    </el-row>
    <el-row id="chart1" style="height: 300px; margin-top: 30px"> </el-row>
    <el-row style="height: 300px; margin-top: 30px">
      <el-col id="chart2" :span="12"></el-col>
      <el-col id="chart3" :span="12"></el-col>
    </el-row>
  </div>
</template>

<script setup name="Index">
import { statistics } from "@/api/index";
import { ref, onMounted } from "vue";
import * as echarts from "echarts";

let form = ref({});
let itemSaleTop10 = ref([]);
let itemSaleAmountTop10 = ref([]);
let loginStatisticsXAxis = ref([]);
let loginStatistics = ref([]);

function loadData() {
  statistics()
    .then((res) => {
      form.value = res.data;
      if (form.value.topItemSaleStatisticsByMonth) {
        form.value.topItemSaleStatisticsByMonth.forEach((item) => {
          itemSaleTop10.value.push(item.itemSaleName);
          itemSaleAmountTop10.value.push(item.amount);
        });
      }
      if (form.value.loginStatistics) {
        form.value.loginStatistics.forEach((loginStatistic) => {
          loginStatisticsXAxis.value.push(loginStatistic.date);
          loginStatistics.value.push(loginStatistic.count);
        });
      }
      draw();
    })
    .catch((err) => {
      console.log(err);
    });
  draw();
}

function draw() {
  // 访问人数统计
  let chart1 = echarts.init(document.getElementById("chart1"));
  let option1 = {
    tooltip: {
      trigger: "axis",
    },
    title: {
      left: "center",
      text: "访问人数统计",
    },
    xAxis: {
      type: "category",
      data: loginStatisticsXAxis.value,
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        name: "访问人数",
        type: "line",
        smooth: true,
        symbol: "none",
        areaStyle: {},
        data: loginStatistics.value,
      },
    ],
  };
  chart1.setOption(option1);
  // 商品销售额前十
  let chart2 = echarts.init(document.getElementById("chart2"));
  let option2 = {
    tooltip: {},
    legend: {
      data: ["销售额"],
    },
    xAxis: {
      name: "本月商品销售额前十",
      nameLocation: "center",
      nameGap: 30,
      data: itemSaleTop10.value,
    },
    yAxis: {},
    series: [
      {
        name: "销售额",
        type: "bar",
        data: itemSaleAmountTop10.value,
      },
    ],
  };
  chart2.setOption(option2);
  // 会员性别占比
  let chart3 = echarts.init(document.getElementById("chart3"));
  let option3 = {
    title: {
      text: "会员性别占比",
    },
    series: [
      {
        type: "pie",
        data: [
          {
            value: 335,
            name: "男",
          },
          {
            value: 234,
            name: "女",
          },
        ],
        radius: "50%",
      },
    ],
  };
  chart3.setOption(option3);
}
onMounted(() => {
  loadData();
});
</script>

<style scoped>
.statistics .el-card .title {
  font-size: 15px;
}
.statistics .el-card .number {
  font-size: 25px;
}
</style>
