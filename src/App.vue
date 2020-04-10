<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <h1>Create PDF receipts with Vue</h1>
    <section>
      <div>
        <label for="filename">Filename</label>
        <input type="text" id="filename" placeholder="Write here ..." v-model="filename">
      </div>
      <div>
        <label for="num">Number of receipt</label>
        <input type="text" id="num" v-model="receipt.num">
        <label for="location">Location</label>
        <input type="text" id="location" v-model="receipt.loc">
        <label for="amount">Amount</label>
        <input type="text" id="amount" :value="conceptTotal + '€'" disabled>
      </div>
      <div>
        <label for="date">Emission date</label>
        <input type="date" id="date" v-model="receipt.date">
        <label for="exp">Expiration date</label>
        <input type="text" id="exp" v-model="receipt.expiration">
      </div>
      <div>
        <label for="concepts">Concepts</label>
        <div v-for="(concept, index) in receipt.concepts" :key="index">
          <input type="text" v-model="concept.name">
          <input type="number" v-model="concept.amount"> €
          <button @click="deleteConcept(index)">-</button>
        </div>
        <button @click="addConcept">+</button>
      </div>
      <div>
        <label for="home">Home Address: </label>
        <input type="text" id="home" v-model="receipt.home">
      </div>
      <div>
        <label for="payer">Payer</label>
        <textarea id="payer" v-model="receipt.payer"></textarea>
        <label for="collector">Collector</label>
        <textarea id="collector" v-model="receipt.collector"></textarea>
      </div>
    </section>
    <button @click="exportPDF">Export PDF</button>
  </div>
</template>

<script>
import jsPDF from 'jspdf'
import 'jspdf-autotable'

export default {
  name: 'App',
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
  computed: {
    conceptTotal() { 
      return this.receipt.concepts.reduce((total,item) => total + Number(item.amount, 2), 0);
    }
  },
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
    addConcept() { this.receipt.concepts.push({ name: '', amount: 0 }); },
    deleteConcept(index) { this.receipt.concepts.splice(index, 1); },
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
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

section {
  text-align: left;
  padding: 2rem
}
</style>
