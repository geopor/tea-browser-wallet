<template>
<div class="c-pageheader">

<el-menu active-text-color="#35a696" :default-active="activeIndex" class="p-header" @select="handleSelect" mode="horizontal">
  <a href="javascript:void(0)" onClick="location.reload()" style="float:left;">
    <el-image
      src="/tea_logo/logo.png"
      fit="fit">
    </el-image>
    
    <!-- <b class="lg">{{chain.current_block_hash ? chain.current_block : ''}}</b> -->
  </a>
  

  
  <!-- <el-menu-item style="margin-left: 50px;" index="/login_account">{{layer1_account.name || 'N/A'}}</el-menu-item> -->
  <div style="margin-left: 50px;" class="el-menu-item">
    <el-dropdown trigger="click" @command="handleCommand">
      <el-button size="small" type="primary" round style="font-size: 14px; " @click="clickSelectAccount()">
        {{layer1_account.name || 'Select account'}}
        <!-- <i class="el-icon-arrow-down el-icon--right"></i> -->
      </el-button>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item v-for="(item, i) of all_account" :key="i" :command="item">
          <span v-if="layer1_account && layer1_account.address!==item.address">{{item.ori_name}}</span>
        </el-dropdown-item>
        
      </el-dropdown-menu>
    </el-dropdown>
  </div>

  <!-- <el-menu-item index="/social_recovery">{{'Recovery'}}</el-menu-item> -->

  <el-menu-item index="/log">{{'Log'}}</el-menu-item>

  <el-menu-item index="/top_tree_list">{{'Mining Camellia'}}</el-menu-item>
  <el-menu-item index="/auction_store">{{'Marketplace'}}</el-menu-item>

  <el-menu-item v-if="has_seed_pool" index="/lucky_draw">{{'Seed pool'}}</el-menu-item>
  <el-menu-item index="/login_account">My assets</el-menu-item>
  <el-menu-item index="/home">{{'Welcome'}}</el-menu-item>

  <!-- <el-menu-item v-if="$root.isDev()" index="/test">{{'Test'}}</el-menu-item> -->

  
</el-menu>
<div class="t-state" :class="'x_'+connected"></div>
</div>
  

</template>
<script>
import {mapGetters, mapState} from 'vuex';
import Base from '../workflow/Base';
import _ from 'lodash';
import utils from '../tea/utils';
export default {
  data() {
    return {
      activeIndex: null,
      connected: 0,
      has_seed_pool: false,

      all_account: [],
      no_plugin_account: false,
    };
  },
  watch: {
    '$route': {
      immediate: true,
      handler (to, from){
        let name = to.path;

        this.activeIndex = name;
      }
    }
  },
  computed: {
    ...mapState([
      'chain'
    ]),
    ...mapGetters(['layer1_account']),
    // ...mapState([
    //   'chain'
    // ]),
  },
  methods: {
    handleSelect(key, keyPath) {
      if(key === 'lang'){
        this.changeLang();
        return false;
      }
      
      if(this.$route.path !== key){
        this.$router.push(key);
      }
      
    },
    changeLang(){
      if(this.$i18n.locale === 'en'){
        window.changeLanguage('zh');
      }
      else{
        window.changeLanguage('en');
      }

    },

    async initAllPluginAccount(wf){
      const layer1_instance = wf.getLayer1Instance();
      let tmp = await wf.getAllLayer1Account();
      tmp = _.map(tmp||[], (item)=>{
        (async ()=>{
          // item.balance = await layer1_instance.getAccountBalance(item.address);
          item.ori_name = _.clone(item.name);
          item.name = item.name + '  -  ' + item.balance;
        })();
        return item;
      });

      if(tmp.length < 1){
        this.no_plugin_account = true;
      }
      else{
        this.no_plugin_account = false;
      }

      this.all_account = tmp;
    },

    async handleCommand(item){

      this.$store.commit('set_account', item);
      if(this.wf){
        this.wf.refreshCurrentAccount();
        utils.publish('refresh-current-account__my_staking');

        utils.publish('refresh-current-account__account', {
          tab: 'my_coupon'
        });
      }

    },
    async clickSelectAccount(){
      if(this.no_plugin_account){
        const html = `
          <p style="font-size: 15px;">Please add an account or <a target="_blank" href="https://teaproject.org/#/doc_list/%2FFAQ%2Fhow_to_install_polkadot_extension.md ">install polkadot browser extension</a></p>
        `;
        this.$alert(html, {
          dangerouslyUseHTMLString: true,
        });
      }
    }
    
  },
  mounted(){

    let time = 500;

    const loop = async (cb)=>{
      try{
        const wf = new Base();
        const connected = wf.layer1.isConnected();
        if(connected !== this.connected){
          this.connected = connected;

          if(this.connected === 2){
            this.wf = wf;
            this.initAllPluginAccount(wf);
            cb();
          }
          
        }
        
        if(this.connected > 0){
          time = 2000;
        }

      }catch(e){
        this.connected = 0;
      }
     
      _.delay(()=>{
        loop(cb);
      }, time);
    };

    loop(async ()=>{
      if(this.wf && this.chain){
        await this.wf.init();
        const block = await this.wf.getCurrentBlock();

        // console.log(1, this.chain.metadata.consts.cml.couponTimoutHeight.toJSON());
        const outdated_block = this.chain.metadata.consts.cml.couponTimoutHeight.toJSON();
        if(block <= outdated_block){
          this.has_seed_pool = true;
        }
      }
    });


  }
}
</script>
<style lang="scss">
.c-pageheader{
  position: sticky;
  top: 0;
  display: block;
  border-bottom: 1px solid #eee;
  background: #fff;
  z-index: 99;
  text-align: center;
}

.p-header{
  padding: 0 0 10px;
  width: 1080px;
  margin: 0 auto !important;
  .lg{
    font-size: 20px;
    color: #333;
    position: relative;
    vertical-align: top;
    top: 20px;
    left: 90px;
  }
  .el-image{
    width: 60px; 
    height: 60px;
    width: 90px;
    height: 90px;
    position: absolute;
    top: -10px;
  }
  
}
.el-menu--horizontal > .el-menu-item{
  float: right !important;
  padding: 10px !important;
  font-size: 17px !important;
}
.el-menu--horizontal > .el-submenu{
  float: right !important;
  
}
.el-menu.el-menu--horizontal{
  border-bottom: none;
}

.t-state{
  height: 2px;
  width: 100%;
  display: block;
  
  &.x_0{
    background: red;
  }
  &.x_1{
    background: yellow;
  }
  &.x_2{
    background: #35a696;
  }

}
</style>