<template>
<section class="t-footer bg_2 js_footer">
  <div class="c-m" style="width:960px;margin:0 auto;">

    <!-- <el-row>
      <el-col :span="6">
        <h4 class="t-h">Resources</h4>
        <a class="t-a" target="_blank" href="http://tearust.com">Tearust</a> -->
        <!-- <a class="t-a" target="_blank" href="https://medium.com/@pushbar">Medium</a> -->
        <!-- <a class="t-a" target="_blank" href="https://github.com/tearust/tea-docs/discussions">Discussions</a> -->
        
      <!-- </el-col>
      <el-col :span="12">
        <h4 class="t-h">Tools</h4>
        <a class="t-a" href="javascript:void(0)" @click="$router.push('/tools/calculate_staking_profit');">Staking收益计算器</a>
      </el-col>
    </el-row> -->

    <div>
      <b class="lg">Block Height : {{chain.current_block_hash ? chain.current_block : ''}}</b>
      <b class="lg" style="margin-left: 15px;">Epoch version : {{epoch_version}}</b>
    </div>
    <div style="margin-top: 5px;">
      <b class="lg">Wallet version : {{version}}</b>
    </div>
    
    <el-divider></el-divider>
    <p style="margin:0 auto;text-align:center;font-size:16px;">Copyright © 2019-2021 <b>TeaProject.org</b> All Rights Reserved</p>
  </div>
</section>

</template>

<script>
import {mapGetters, mapState} from 'vuex';
import Base from '../workflow/Base';
import _ from 'lodash';
import utils from '../tea/utils';
export default {
  computed: {
    // ...mapGetters(['layer1_account']),
    ...mapState([
      'chain'
    ]),
  },
  data(){
    return {
      epoch_version: null,
      version: null,
    };
  },
  mounted(){
    this.epoch_version = utils.get_env('epoch_version');
    this.version = utils.get_env('version');
  }
}
</script>
<style lang="scss">
.t-footer{
  padding: 24px 0 40px;
  // position: fixed;
  // width: 100%;
  // bottom: 0;
  background: rgb(53, 166, 150);

  *{
    color: #fff;
  }

  .t-h{
    margin: 0 0 20px 0;
    text-align: left;
    font-size: 21px;
  }
  .t-a{
    font-size: 19px;
    display: table;
    &:hover{
      color: #ec7259;
    }
  }
}
@media screen and (max-width : 600px) {
  .t-footer{
    padding-left: 20px;
    padding-right: 20px;
  }
}
</style>