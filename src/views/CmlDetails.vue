<template>
  <div class="tea-page">

    <h4>Camellia detail</h4>
    <el-table 
      :data="cml ? [cml] : []"
      stripe
      size="small"
      border
    >
      <el-table-column
        prop="id"
        width="90"
        label="CML ID"
      />
      <el-table-column
        prop="cml_type"
        label="Type"
        width="70"
      />

      <el-table-column
        prop="lifespan"
        label="Life remaining"
      >
        <template slot-scope="scope">
          {{scope.row.life_day}}
        </template>
      </el-table-column>


      <el-table-column
        prop="machine_id"
        label="Miner ID"
      > 
        <template slot-scope="scope">
          <el-button
            @click="showMinerInfo(scope.row.machine_id)"
            type="text"
            size="small">
            {{scope.row.machine_id}}
          </el-button>
        </template>
      </el-table-column>


      <el-table-column
        prop="performance"
        label="Performance"
        width="120"
      />

      <el-table-column
        prop="defrost_schedule"
        label="Defrost schedule"
        width="150"
      />

      <el-table-column
        prop="defrost_day"
        label="Defrost day"
        width="120"
      />

      <el-table-column
          prop="status"
          label="Status"
          width="120"
        >
        <template slot-scope="scope">{{scope.row.status | str}}</template>
      </el-table-column>

      <el-table-column
        v-if="is_staking"
        label="Staking to"
        width="120"
      >
        <template slot-scope="scope">
          <el-button type="text" @click="changeCmlId(scope.row.staking_cml_id)">{{scope.row.staking_cml_id}}</el-button>
        </template>
      </el-table-column>
      


    </el-table>

    <el-divider />
    <h4>Staking slots</h4>
    <el-table 
      :data="cml ? cml.staking_slot : []"
      stripe
      class="tea-table"
      size="small"
      border
    >
      <el-table-column
        label="Index"
        width="100"
      >
        <template slot-scope="scope">{{scope.$index}}</template>
      </el-table-column>
      <el-table-column
        prop="owner"
        label="Staker"
      >
        <template slot-scope="scope">
          <el-button 
            @click="$router.push('/user_details/'+scope.row.owner)"
            type="text">
            {{scope.row.owner}}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="category"
        label="Staking with"
        width="120"
      />

      <el-table-column
        label="Staking CML ID"
        width="180"
      >
        <template slot-scope="scope">
          <el-button type="text" @click="changeCmlId(scope.row.cml)">{{scope.row.cml}}</el-button>
        </template>
      </el-table-column>

      <el-table-column
        label="Amount"
        width="150"
      >
        <template v-if="scope.row.amount" slot-scope="scope">
          <span :inner-html.prop="scope.row.amount | balance"></span>
        </template>
      </el-table-column>
      <el-table-column
        label="Weight"
        prop="weight"
        width="150"
      />
      
      
    </el-table>




  </div>
</template>
<script>
import { mapState } from 'vuex';
import store from '../store/index';
import utils from '../tea/utils';
import Base from '../workflow/Base';
import {hexToString} from 'tearust_layer1';
import {_} from 'tearust_utils';
export default {
  data(){
    return {
      cml: null,
      id: null,
      is_staking: false,
    };
  },
  async mounted(){
    this.id = this.$route.params.id;

    this.$root.loading(true);
    this.wf = new Base();
    await this.wf.init();

    
    await this.refresh();
    this.$root.loading(false);
  },

  methods: {
    async refresh(){
      const layer1_instance = this.wf.getLayer1Instance();
      const api = layer1_instance.getApi();
      const cml_data = await this.wf.getCmlByList([this.id]);
      // console.log(111, cml_data[0]);
      this.cml = cml_data[0];
      this.cml.staking_slot = await Promise.all(_.map(this.cml.staking_slot, async (item, index)=>{
        item.weight = await utils.getStakingWeightByIndex(index, this.cml.slot_len);
        return item;
      }));
      this.is_staking = this.cml.status === 'Staking';
    },
    async showMinerInfo(miner_id){
      const layer1_instance = this.wf.getLayer1Instance();
      const api = layer1_instance.getApi();

      let mm = await api.query.cml.minerItemStore(miner_id);
      mm = mm.toJSON();

      mm.id = hexToString(mm.id);
      mm.ip = hexToString(mm.ip);
      
      this.$store.commit('modal/open', {
        key: 'data_details',
        param: {
          ...mm,
          title: 'Miner details',
        },
      });
    },
    async changeCmlId(cml_id){
      this.$root.goPath('/cml_details/'+cml_id, 'replace');
      this.id = cml_id

      this.$root.loading(true);
      await this.refresh();
      this.$root.loading(false);
    }
  }
}
</script>