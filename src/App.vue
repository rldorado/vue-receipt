<template>
  <div id="app" class="mdl-layout mdl-js-layout mdl-layout--fixed-header">
    <header class="mdl-layout__header">
      <div class="mdl-layout__header-row">
        <span class="mdl-layout-title">Create PDF receipts with Vue</span>
        <div class="mdl-layout-spacer"></div>
        <nav class="mdl-navigation mdl-layout--large-screen-only">
          <a class="mdl-navigation__link" @click="exportPDF">Export PDF</a>
        </nav>
      </div>
    </header>
    <div class="mdl-layout__drawer">
      <span class="mdl-layout-title">Menu</span>
      <nav class="mdl-navigation">
        <a class="mdl-navigation__link" @click="exportPDF">Export PDF</a>
      </nav>
    </div>
    <main class="mdl-layout__content">
      <FormInput :receipt="receipt" :filename="filename" />
      <button 
        class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent" 
        @click="exportPDF">
        Export PDF
      </button>
    </main>
  </div>
</template>

<script>
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import FormInput from '@/components/FormInput'

export default {
  name: 'App',
  components: { FormInput },
  data: () => ({
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
  mounted() {
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

      const concepts = this.receipt.concepts;

      doc.autoTable({ 
        body: concepts,
        columns: [{ header: 'Concepto', dataKey: 'name' }, { header: 'Importe', dataKey: 'amount' }]
      });

      doc.autoTable({ head: [['Domicilio']], body: [[`${this.receipt.home}`]] })
      doc.autoTable({
          head: [['Pagador', 'Cobrador']],
          body: [[`${this.receipt.payer}`,`${this.receipt.collector}`]]
      })
      this.saveReceipt();
      doc.save(`${this.filename}.pdf`);
    },
    saveReceipt() {
      if (!this.receipt) return;
      const parsed = JSON.stringify(this.receipt);
      localStorage.setItem('receiptMetadata', parsed);
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

main {
  text-align: left;
  padding: 2rem
}

a[title="Hosted on free web hosting 000webhost.com. Host your own website for FREE."] {
  display: none;
}
</style>
