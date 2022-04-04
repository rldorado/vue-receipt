<template>
  <div id="app" class="md-layout md-js-layout md-layout--fixed-header">
    <md-app md-mode="reveal">
      <md-app-toolbar class="md-primary">
        <span class="md-title">
          <md-icon>receipt</md-icon>
            {{ $t('title') }}
          <md-icon>receipt</md-icon>
        </span>        
      </md-app-toolbar>

      <md-app-content>
        <form>
          <form-input :receipt="receipt" :filename="filename" />
          <md-field>
            <md-icon>drive_file_rename_outline</md-icon>
            <label>{{ $t('receipt.filename') }}</label>
            <md-input v-model="receipt.filename" />
          </md-field>
          <div>
            <md-button
              type="submit"
              class="md-primary md-raised md-dense"
              @click="exportPDF">
              <md-icon>picture_as_pdf</md-icon> {{ $t('export') }}
            </md-button>
            <md-button
              type="submit"
              class="md-secondary md-raised md-dense"
              :href="getJSONDataFile"
              download="data.json">
              <md-icon>download</md-icon> {{ $t('download') }}
            </md-button>
          </div>
        </form>
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
  data: () => {
    return {
      filename: '',
      receipt: {
        num: '04/2022',
        loc: '',
        amount: undefined,
        date: undefined,
        expiration: undefined,
        home: '',
        concepts: [{ name: '', amount: 0 }],
        payer: '',
        collector: ''
      }
    }
  },
  created () {
    if (localStorage.getItem('receiptMetadata')) {
      try {
        this.receipt = JSON.parse(localStorage.getItem('receiptMetadata'));
      } catch(e) {
        localStorage.removeItem('receiptMetadata');
      }
    }
    this.$material.locale.dateFormat = 'dd/MM/yyyy';
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
      doc.text(40, 40, this.$t('pdf.title'));
      const firstRowHeader = [
        this.$t('receipt.number'),
        this.$t('receipt.location'),
        this.$t('receipt.total')
      ];
      const firstRowBody = [
        `${this.receipt.num}`,
        `${this.receipt.loc}`,
        `${this.receipt.amount} €`
      ]
      doc.autoTable({
        head: [firstRowHeader],
        body: [firstRowBody],
        margin: { top: 60 }
      });
      const secondRowHeader = [
        this.$t('receipt.emission'),
        this.$t('receipt.expiration')
      ];
      const secondRowBody = [
        `${this.receipt.date}`,
        `${this.receipt.expiration}`
      ]
      doc.autoTable({
          head: [secondRowHeader],
          body: [secondRowBody]
      });

      let concepts = this.receipt.concepts;
      const total = concepts.reduce((total,item) => total + Number(item.amount, 2), 0);
      const conceptBody = [
        ...concepts.map(el => [el.name, el.amount + ' €']), 
        [
          { content: `${this.$t('pdf.total')}`, styles: { fillColor: [239, 154, 154] } }, 
          { content: `${total} €`, styles: { fillColor: [239, 154, 154] } }
        ]
      ];

      doc.autoTable({ 
        body: conceptBody,
        columns: [
          { header: this.$t('receipt.concept'), dataKey: 'name' },
          { header: this.$t('receipt.amount'), dataKey: 'amount' }
        ]
      });

      doc.autoTable({ head: [[this.$t('receipt.address')]], body: [[`${this.receipt.home}`]] })
      doc.autoTable({
          head: [[this.$t('receipt.payer'), this.$t('receipt.collector')]],
          body: [[`${this.receipt.payer}`,`${this.receipt.collector}`]]
      });
    }
  }
}
</script>