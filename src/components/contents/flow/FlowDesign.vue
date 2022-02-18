<template>
  <v-card id="flowDesignContainer">

  </v-card>

</template>

<script>
import BpmnJS from "bpmn-js"
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
export default {
  name: "FlowDesign",
  data() {
    return {
      xml: "", // 后端查询到的xml
      users: [
        {name: "披头士", id: "1"},
        {name: "滚石乐队", id: "2"},
        {name: "平克·佛洛伊德", id: "3"},
      ],
      groups: [
        {name: "web", id: "4"},
        {name: "java", id: "5"},
        {name: "python", id: "6"},
      ],
      categorys: [
        {name: "音乐", id: "7"},
        {name: "文章", id: "8"},
      ],
    };
  },
  async mounted() {
    const viewer = new BpmnJS();

// attach it to some element
    viewer.attachTo('#flowDesignContainer');

  },
  methods: {
    getModelDetail() {
      // 发送请求，获取xml
      // this.xml = response.xml
    },
    save(data) {
      console.log(data);  // { process: {...}, xml: '...', svg: '...' }
    },
  },
};
</script>