<template>
        <section>
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
                <label>Concepts</label>
                <ul class="demo-list-control mdl-list">
                    <li class="mdl-list-item" v-for="(concept, index) in receipt.concepts" :key="index">
                        <span class="mdl-list__item-primary-content">
                            <input 
                                type="text" 
                                class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label" 
                                v-model="concept.name">
                            <input 
                                type="number" 
                                class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label" 
                                pattern="-?[0-9]*(\.[0-9]+)?"
                                v-model="concept.amount"> €
                        </span>
                        <span class="mdl-list__item-secondary-action">
                            <button 
                                class="mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab mdl-button--colored" 
                                @click="deleteConcept(index)">
                                -
                            </button>
                        </span>
                    </li>
                </ul>
                <button 
                    class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect" 
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
                    <textarea class="mdl-textfield__input" rows="5" cols="50" id="payer" v-model="receipt.payer"></textarea>
                </div>
                <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                    <label class="mdl-textfield__label" for="collector">Collector</label>
                    <textarea class="mdl-textfield__input" rows="5" cols="50" id="collector" v-model="receipt.collector"></textarea>
                </div>
            </div>
            <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                <input 
                    class="mdl-textfield__input"
                    type="text" 
                    id="filename" 
                    placeholder="Write here ..." 
                    :value="filename"
                    v-on:input="$emit('filename', $event.target.value)">
                    <label class="mdl-textfield__label" for="filename">Filename</label>
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

<style scoped>

</style>
