<template>
        <section>
            <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                <input 
                    class="mdl-textfield__input"
                    type="text" 
                    id="filename" 
                    placeholder="Write here ..." 
                    v-model="filename">
                    <label class="mdl-textfield__label" for="filename">Filename</label>
            </div>
            <div>
                <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                    <label class="mdl-textfield__label" for="num">Number of receipt</label>
                    <input class="mdl-textfield__input" type="text" id="num" v-model="receipt.num">
                </div>
                <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                    <label class="mdl-textfield__label" for="location">Location</label>
                    <input class="mdl-textfield__input" type="text" id="location" v-model="receipt.loc">
                </div>
                <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                    <label class="mdl-textfield__label" for="amount">Amount</label>
                    <input class="mdl-textfield__input" type="text" id="amount" :value="conceptTotal + '€'" disabled>
                </div>
            </div>
            <div>
                <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                    <label class="mdl-textfield__label" for="date">Emission date</label>
                    <input class="mdl-textfield__input" type="date" id="date" v-model="receipt.date">
                </div>
                <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                    <label class="mdl-textfield__label" for="exp">Expiration date</label>
                    <input class="mdl-textfield__input" type="text" id="exp" v-model="receipt.expiration">
                </div>
            </div>
            <div>
                <label for="concepts">Concepts</label>
                <div v-for="(concept, index) in receipt.concepts" :key="index">
                <input type="text" v-model="concept.name">
                <input type="number" v-model="concept.amount"> €
                <button @click="deleteConcept(index)">-</button>
                </div>
                <button 
                    class="mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab" 
                    @click="addConcept">
                    +
                </button>
            </div>
            <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                <label class="mdl-textfield__label" for="home">Address:</label>
                <input 
                    class="mdl-textfield__input" 
                    type="text" id="home" 
                    placeholder="Write here ..."
                    v-model="receipt.home">
            </div>
            <div>
                <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                    <label class="mdl-textfield__label" for="payer">Payer</label>
                    <textarea class="mdl-textfield__input" id="payer" v-model="receipt.payer"></textarea>
                </div>
                <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                    <label class="mdl-textfield__label" for="collector">Collector</label>
                    <textarea class="mdl-textfield__input" id="collector" v-model="receipt.collector"></textarea>
                </div>
            </div>
        </section>
</template>

<script>
export default {
    props: ['receipt', 'filename'],
    computed: {
        conceptTotal() { 
            return this.receipt.concepts.reduce((total,item) => total + Number(item.amount, 2), 0);
        }
    },
    methods: {
        addConcept() { this.receipt.concepts.push({ name: '', amount: 0 }); },
        deleteConcept(index) { this.receipt.concepts.splice(index, 1); }
    }
}
</script>

