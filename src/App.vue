<template>
  <div id="app" class="md-layout md-js-layout md-layout--fixed-header">
    <md-app md-mode="reveal">
      <md-app-toolbar class="md-primary">
        <md-button class="md-icon-button" @click="menuVisible = !menuVisible">
          <md-icon>menu</md-icon>
        </md-button>
        <span class="md-title">
          <md-icon>receipt</md-icon>
            {{ $t('title') }}
          <md-icon>receipt</md-icon>
        </span>        
      </md-app-toolbar>

      <md-app-drawer :md-active.sync="menuVisible">
        <md-toolbar class="md-transparent" md-elevation="0">
          {{ $t('menu') }}
        </md-toolbar>

        <md-list>
          <md-list-item>
            <md-icon>picture_as_pdf</md-icon>
            <a @click="exportPDF" href="" class="md-list-item-text">{{ $t('export') }}</a>
          </md-list-item>

          <md-list-item>
            <md-icon>download</md-icon>
            <span 
              :href="getJSONDataFile"
              download="data.json"
              class="md-list-item-text">
              {{ $t('download') }}
            </span>
          </md-list-item>
        </md-list>
      </md-app-drawer>

      <md-app-content>
        <FormInput :receipt="receipt" :filename="filename" />
        <md-button class="md-primary md-raised" @click="exportPDF">
          <md-icon>picture_as_pdf</md-icon> {{ $t('export') }}
        </md-button>
        <md-button class="md-secondary md-raised" :href="getJSONDataFile" download="data.json">
          <md-icon>download</md-icon> {{ $t('download') }}
        </md-button>
      </md-app-content>
    </md-app>
  </div>
</template>

<script>
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import FormInput from '@/components/FormInput'

export default {
  name: 'App',
  components: { FormInput },
  computed: {
    getJSONDataFile () {
      return 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(this.receipt));
    }
  },
  data: () => ({
      menuVisible: false,
      filename: '',
      receipt: {
        num: '04/2020',
        loc: '',
        amount: 0,
        date: undefined,
        expiration: undefined,
        home: '',
        concepts: [{ name: '', amount: 0 }],
        payer: '',
        collector: ''
      }
  }),
  created () {
    if (localStorage.getItem('receiptMetadata')) {
      try {
        this.receipt = JSON.parse(localStorage.getItem('receiptMetadata'));
      } catch(e) {
        localStorage.removeItem('receiptMetadata');
      }
    }
  },
  methods: {
    exportPDF() {
      let doc = new jsPDF('landscape', 'pt');
      this.generatePDF(doc);
      this.saveReceipt();
      doc.save(`${this.filename}.pdf`);
    },
    saveReceipt() {
      if (!this.receipt) return;
      const parsed = JSON.stringify(this.receipt);
      localStorage.setItem('receiptMetadata', parsed);
    },
    generatePDF (doc) {
      this.receipt.amount = this.receipt.concepts.reduce((total,item) => total + Number(item.amount, 2), 0);
      doc.text(40, 40, 'Factura de alquiler');
      const firstRow = ['Numero', 'Localidad', 'Importe'];
      doc.autoTable({
        head: [firstRow],
        body: [[`${this.receipt.num}`, `${this.receipt.loc}`, `${this.receipt.amount} €`]],
        margin: { top: 60 }
      });
      const secondRow = ['Fecha','Vencimiento'];
      doc.autoTable({
          head: [secondRow],
          body: [[`${this.receipt.date}`, `${this.receipt.expiration}`]]
      });

      let concepts = this.receipt.concepts;
      const total = concepts.reduce((total,item) => total + Number(item.amount, 2), 0);
      const conceptBody = [
        ...concepts.map(el => [el.name, el.amount + ' €']), 
        [
          { content: 'TOTAL', styles: { fillColor: [55, 275, 255] } }, 
          { content: `${total} €`, styles: { fillColor: [55, 275, 255] } }
        ]
        //['TOTAL', `${total} €`, { fillColor: [239, 154, 154] }]
      ];

      doc.autoTable({ 
        body: conceptBody,
        columns: [{ header: 'Concepto', dataKey: 'name' }, { header: 'Importe', dataKey: 'amount' }]
      });

      doc.autoTable({ head: [['Domicilio']], body: [[`${this.receipt.home}`]] })
      doc.autoTable({
          head: [['Pagador', 'Cobrador']],
          body: [[`${this.receipt.payer}`,`${this.receipt.collector}`]]
      });
    }
  }
}
</script>